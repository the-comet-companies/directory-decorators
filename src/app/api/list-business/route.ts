import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const PENDING_FILE = path.join(process.cwd(), 'companies', 'pending-companies.json')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, address, city, state, zipCode, phone, email, website, description, printingMethods, logo, sampleImages } = body

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Build attachments from base64 images
    const attachments: { filename: string; content: string; encoding: string; cid: string }[] = []

    if (logo) {
      const match = logo.match(/^data:(image\/\w+);base64,(.+)$/)
      if (match) {
        const ext = match[1].split('/')[1]
        attachments.push({
          filename: `logo.${ext}`,
          content: match[2],
          encoding: 'base64',
          cid: 'logo',
        })
      }
    }

    if (sampleImages && Array.isArray(sampleImages)) {
      sampleImages.forEach((img: string, i: number) => {
        const match = img.match(/^data:(image\/\w+);base64,(.+)$/)
        if (match) {
          const ext = match[1].split('/')[1]
          attachments.push({
            filename: `sample-${i + 1}.${ext}`,
            content: match[2],
            encoding: 'base64',
            cid: `sample-${i + 1}`,
          })
        }
      })
    }

    const methodsList = printingMethods?.length > 0
      ? printingMethods.join(', ')
      : 'Not specified'

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#1e293b;margin-bottom:4px;">New Business Listing Request</h2>
        <p style="color:#64748b;margin-top:0;">Submitted via Print Services Hub USA</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>

        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#64748b;width:140px;">Business Name</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Address</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${address}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">City / State / ZIP</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${city}, ${state} ${zipCode || ''}</td></tr>
          ${phone ? `<tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${phone}</td></tr>` : ''}
          ${email ? `<tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${email}</td></tr>` : ''}
          ${website ? `<tr><td style="padding:8px 0;color:#64748b;">Website</td><td style="padding:8px 0;color:#1e293b;font-weight:600;"><a href="${website}">${website}</a></td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#64748b;">Printing Methods</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${methodsList}</td></tr>
        </table>

        ${description ? `
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
        <p style="color:#64748b;margin-bottom:8px;">Description</p>
        <p style="color:#1e293b;background:#f8fafc;padding:16px;border-radius:8px;margin:0;">${description.replace(/\n/g, '<br/>')}</p>
        ` : ''}

        ${logo ? `
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
        <p style="color:#64748b;margin-bottom:8px;">Logo</p>
        <img src="cid:logo" style="max-width:200px;border-radius:8px;" />
        ` : ''}

        ${sampleImages?.length > 0 ? `
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
        <p style="color:#64748b;margin-bottom:8px;">Sample Images (${sampleImages.length})</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${sampleImages.map((_: string, i: number) => `<img src="cid:sample-${i + 1}" style="max-width:200px;border-radius:8px;" />`).join('')}
        </div>
        ` : ''}

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
        <p style="color:#94a3b8;font-size:12px;margin:0;">Sent from Print Services Hub USA · ${new Date().toLocaleString()}</p>
      </div>
    `

    await transporter.sendMail({
      from: `"Print Services Hub" <${process.env.SMTP_USER}>`,
      to: 'jepoylorem@gmail.com',
      replyTo: email || undefined,
      subject: `New Listing Request: ${name} — ${city}, ${state}`,
      html,
      attachments,
    })

    // Save to pending JSON (without base64 images to keep file small)
    let pending: unknown[] = []
    if (fs.existsSync(PENDING_FILE)) {
      try { pending = JSON.parse(fs.readFileSync(PENDING_FILE, 'utf-8')) } catch { pending = [] }
    }
    pending.push({
      name, address, city, state, zipCode, phone, email, website, description,
      printingMethods,
      hasLogo: !!logo,
      sampleImageCount: sampleImages?.length || 0,
      id: `pending-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    })
    fs.writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 2), 'utf-8')

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('list-business error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to send.' }, { status: 500 })
  }
}

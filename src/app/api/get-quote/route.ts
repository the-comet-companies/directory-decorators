import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, company, serviceType, quantity, details, deadline } = body

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#1e293b;margin-bottom:4px;">New Quote Request</h2>
        <p style="color:#64748b;margin-top:0;">Received from Print Services Hub USA</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>

        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#64748b;width:160px;">Name</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${email}</td></tr>
          ${phone ? `<tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${phone}</td></tr>` : ''}
          ${company ? `<tr><td style="padding:8px 0;color:#64748b;">Company</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${company}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#64748b;">Service Type</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${serviceType}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Quantity</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${quantity}</td></tr>
          ${deadline ? `<tr><td style="padding:8px 0;color:#64748b;">Deadline</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${deadline}</td></tr>` : ''}
        </table>

        ${details ? `
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
        <p style="color:#64748b;margin-bottom:8px;">Project Details</p>
        <p style="color:#1e293b;background:#f8fafc;padding:16px;border-radius:8px;margin:0;">${details.replace(/\n/g, '<br/>')}</p>
        ` : ''}

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
        <p style="color:#94a3b8;font-size:12px;margin:0;">Sent from printserviceshub.com · ${new Date().toLocaleString()}</p>
      </div>
    `

    await transporter.sendMail({
      from: `"Print Services Hub" <${process.env.SMTP_USER}>`,
      to: 'jepoylorem@gmail.com',
      replyTo: email,
      subject: `Quote Request from ${name}${company ? ` · ${company}` : ''} — ${serviceType}`,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('get-quote error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to send.' }, { status: 500 })
  }
}

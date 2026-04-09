import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getProviderBySlug } from '@/lib/data'
import { createQuoteLead } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, serviceType, quantity, deadline, description, providerSlugs } = body

    if (!name || !email || !providerSlugs?.length) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const providers = providerSlugs
      .map((slug: string) => getProviderBySlug(slug))
      .filter(Boolean)

    if (providers.length === 0) {
      return NextResponse.json({ ok: false, error: 'No valid providers found.' }, { status: 400 })
    }

    const projectHtml = `
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#64748b;width:140px;">Customer Name</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;color:#1e293b;font-weight:600;"><a href="mailto:${email}">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${phone}</td></tr>` : ''}
        ${serviceType ? `<tr><td style="padding:8px 0;color:#64748b;">Service Type</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${serviceType}</td></tr>` : ''}
        ${quantity ? `<tr><td style="padding:8px 0;color:#64748b;">Quantity</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${quantity} pieces</td></tr>` : ''}
        ${deadline ? `<tr><td style="padding:8px 0;color:#64748b;">Deadline</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">${deadline}</td></tr>` : ''}
      </table>
      ${description ? `
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;"/>
      <p style="color:#64748b;margin-bottom:8px;">Project Description</p>
      <p style="color:#1e293b;background:#f8fafc;padding:16px;border-radius:8px;margin:0;">${description.replace(/\n/g, '<br/>')}</p>
      ` : ''}
    `

    // Send individual emails to each provider that has an email
    const sentTo: string[] = []
    const noEmail: string[] = []

    for (const provider of providers) {
      if (provider.email && provider.email.trim()) {
        await transporter.sendMail({
          from: `"Print Services Hub" <${process.env.SMTP_USER}>`,
          to: provider.email,
          replyTo: email,
          subject: `Quote Request: ${serviceType || 'Custom Printing'} — ${quantity ? quantity + ' pieces' : 'Quote needed'}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
              <h2 style="color:#1e293b;margin-bottom:4px;">New Quote Request</h2>
              <p style="color:#64748b;margin-top:0;">A customer found you on <a href="https://directory.shoptitan.app/provider/${provider.slug}">Print Services Hub USA</a></p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
              ${projectHtml}
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
              <p style="color:#1e293b;font-weight:600;">Reply directly to this email to respond to the customer.</p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
              <p style="color:#94a3b8;font-size:12px;margin:0;">Sent via Print Services Hub USA · ${new Date().toLocaleString()}</p>
            </div>
          `,
        })
        sentTo.push(`${provider.name} (${provider.email})`)
      } else {
        noEmail.push(provider.name)
      }
    }

    // Save lead to database
    createQuoteLead({
      name,
      email,
      phone: phone || '',
      serviceType: serviceType || '',
      quantity: quantity || '',
      deadline: deadline || '',
      description: description || '',
      providers: providers.map((p: { slug: string; name: string }) => ({ slug: p.slug, name: p.name })),
    })

    // Send summary to admin
    const providerList = providers.map((p: { name: string; email?: string; city: string; serviceArea: string[] }) =>
      `<li style="padding:4px 0;"><strong>${p.name}</strong> — ${p.city}, ${p.serviceArea[1] || ''} ${p.email ? `(<a href="mailto:${p.email}">${p.email}</a> — sent directly)` : '(no email — needs manual forwarding)'}</li>`
    ).join('')

    await transporter.sendMail({
      from: `"Print Services Hub" <${process.env.SMTP_USER}>`,
      to: 'jepoylorem@gmail.com',
      replyTo: email,
      subject: `Quote Request Summary: ${name} → ${providers.length} provider${providers.length > 1 ? 's' : ''} — ${serviceType || 'Custom Printing'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#1e293b;margin-bottom:4px;">Quote Request Summary</h2>
          <p style="color:#64748b;margin-top:0;">Submitted via Print Services Hub USA</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>

          ${projectHtml}

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
          <h3 style="color:#1e293b;margin-bottom:8px;">Providers Selected (${providers.length})</h3>
          <ul style="color:#1e293b;padding-left:20px;">${providerList}</ul>

          ${sentTo.length > 0 ? `<p style="color:#16a34a;font-size:13px;margin-top:12px;">✓ Sent directly to: ${sentTo.join(', ')}</p>` : ''}
          ${noEmail.length > 0 ? `<p style="color:#dc2626;font-size:13px;margin-top:8px;">✗ No email on file (forward manually): ${noEmail.join(', ')}</p>` : ''}

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
          <p style="color:#94a3b8;font-size:12px;margin:0;">Sent from Print Services Hub USA · ${new Date().toLocaleString()}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('request-quotes error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to send.' }, { status: 500 })
  }
}

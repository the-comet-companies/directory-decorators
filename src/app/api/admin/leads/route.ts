import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getQuoteLeads } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser || authUser.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format')

    const leads = (await getQuoteLeads()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // CSV export
    if (format === 'csv') {
      const header = 'Name,Email,Phone,Service Type,Quantity,Deadline,Providers,Date'
      const rows = leads.map(l => {
        const providers = l.providers.map(p => p.name).join('; ')
        const date = new Date(l.createdAt).toLocaleDateString('en-US')
        return [l.name, l.email, l.phone, l.serviceType, l.quantity, l.deadline, providers, date]
          .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
          .join(',')
      })
      const csv = [header, ...rows].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="quote-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      })
    }

    return NextResponse.json({ ok: true, leads })
  } catch (err) {
    console.error('Admin leads error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to load leads.' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'companies', 'added-companies.json')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Read existing entries
    let entries: unknown[] = []
    if (fs.existsSync(FILE)) {
      const raw = fs.readFileSync(FILE, 'utf-8')
      entries = JSON.parse(raw)
    }

    const entry = {
      ...body,
      id: `user-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      source: 'user-submission',
    }

    entries.push(entry)
    fs.writeFileSync(FILE, JSON.stringify(entries, null, 2), 'utf-8')

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('list-business error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to save.' }, { status: 500 })
  }
}

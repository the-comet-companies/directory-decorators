import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600

export async function GET() {
  const [{ data: dtlaData }, { data: topData }] = await Promise.all([
    supabase.from('companies').select('name, slug').eq('slug', 'dtla-print-los-angeles-ca').maybeSingle(),
    supabase
      .from('companies')
      .select('name, slug')
      .neq('slug', 'dtla-print-los-angeles-ca')
      .order('rating', { ascending: false })
      .order('review_count', { ascending: false })
      .limit(9),
  ])

  const result: { name: string; slug: string }[] = []
  if (dtlaData) result.push(dtlaData)
  if (topData) result.push(...topData)
  return NextResponse.json(result.slice(0, 10))
}

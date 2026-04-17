import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600

export async function GET() {
  const { data } = await supabase
    .from('companies')
    .select('name, slug')
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
    .limit(10)

  return NextResponse.json(data || [])
}

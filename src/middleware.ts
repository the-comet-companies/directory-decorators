import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // 301 redirect old domain to new domain (preserves SEO)
  if (host === 'directory.dtlaprint.com' || host === 'www.directory.dtlaprint.com') {
    const url = new URL(request.url)
    url.host = 'directory.shoptitan.app'
    url.protocol = 'https'
    return NextResponse.redirect(url.toString(), 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}

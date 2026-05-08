import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/os', '/os/(.*)'],
}

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.next()
}

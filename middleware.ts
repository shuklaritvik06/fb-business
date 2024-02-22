import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  const excludedPaths = ['login', 'register']

  if (
    !session &&
    excludedPaths.some((path) => new URL(request.url).pathname === `/${path}`)
  ) {
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (
    session &&
    excludedPaths.some((path) => new URL(request.url).pathname === `/${path}`)
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.png).*)'],
}

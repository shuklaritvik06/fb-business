import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { customInitApp } from '@/lib/firebase-admin'
import { auth } from 'firebase-admin'

customInitApp()

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  const excludedPaths = ['login', 'register']

  if (
    !session &&
    excludedPaths.some((path) => request.nextUrl.pathname.includes(path))
  ) {
    return NextResponse.next()
  }

  try {
    const decodedClaims = await auth().verifySessionCookie(session!, true)

    if (!decodedClaims) {
      return NextResponse.redirect(new URL('/register', request.url))
    }
  } catch (error) {
    console.error('Error fetching API:', error)
  }

  return NextResponse.next()
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api|_next/static|_next/image|favicon.png|connect).*)'],
}

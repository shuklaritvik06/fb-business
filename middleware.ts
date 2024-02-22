import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const base_url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://richpanel-assignment-alpha.vercel.app/'

  const session = request.cookies.get('session')

  if (!session?.value) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const responseAPI = await fetch(base_url + '/api/login', {
    credentials: 'include',
    headers: {
      Cookie: `session=${session?.value}`,
    },
  })

  if (responseAPI.status !== 200) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|register).*)'],
}

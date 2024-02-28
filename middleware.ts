import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const base_url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://richpanel-assignment-git-dev-shuklaritvik06.vercel.app/'

  const apiUrl = new URL('/api/login', base_url)

  const session = request.cookies.get('session')?.value

  const excludedPaths = ['login', 'register']

  if (
    !session &&
    excludedPaths.some((path) => request.nextUrl.pathname.includes(path))
  ) {
    return NextResponse.next()
  }

  try {
    const responseAPI = await fetch(apiUrl.href, {
      headers: {
        Cookie: `session=${session}`,
      },
    })

    if (
      responseAPI.status !== 200 &&
      !excludedPaths.some((path) => request.nextUrl.pathname.includes(path))
    ) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (error) {
    console.error('Error fetching API:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.png|connect).*)'],
}

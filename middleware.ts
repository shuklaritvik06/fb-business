import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const index = request.url.lastIndexOf('/')
  const url = request.url.slice(0, index)

  const apiUrl = new URL('/api/login', url)

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

    if (responseAPI.status === 200) {
      return NextResponse.next()
    }

    // if (
    //   responseAPI.status !== 200 &&
    //   !excludedPaths.some((path) => request.nextUrl.pathname.includes(path))
    // ) {
    //   return NextResponse.redirect(new URL('/register', request.url))
    // }
  } catch (error) {
    console.error('Error fetching API:', error)
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.png|connect).*)'],
}

import { customInitApp } from '@/lib/firebase-admin'
import { auth } from 'firebase-admin'
import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

customInitApp()

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const authorization = headers().get('Authorization')
    if (authorization?.startsWith('Bearer ')) {
      const idToken = authorization.split('Bearer ')[1]
      const decodedToken = await auth().verifyIdToken(idToken)
      if (decodedToken) {
        const expiresIn = 60 * 60 * 5 * 1000
        const sessionCookie = await auth().createSessionCookie(idToken, {
          expiresIn,
        })
        const options = {
          name: 'session',
          value: sessionCookie,
          maxAge: expiresIn / 1000,
          httpOnly: true,
        }

        cookies().set(options)
      }
    }
    return NextResponse.json({ isLogged: true }, { status: 200 })
  } catch (err) {
    console.error('Error while making request to Firebase:', err)
    return NextResponse.json({ isLogged: false, err: err }, { status: 401 })
  }
}

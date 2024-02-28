'use client'

import React, { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClipLoader } from 'react-spinners'
import { loginUser } from '@/firebase/fb-helper-utils'
import {
  Persistence,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth'
import { firebase_auth } from '@/lib/firebase-client'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState<string | null>('')
  const [password, setPassword] = useState<string | null>('')
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [error, setError] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe)
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const persistenceType = rememberMe ? browserSessionPersistence : 'NONE'

      if (!email || !password) {
        setError('Please provide both email and password.')
        return
      }

      const user = await setPersistence(
        firebase_auth,
        persistenceType as Persistence
      ).then(() => {
        return loginUser(email, password)
      })

      if (user) {
        fetch('/api/login', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        }).then(() => {
          router.replace('/connect')
        })
      }

      setEmail('')
      setPassword('')
      setError(null)
      setLoading(false)
    } catch (error: any) {
      console.log(error)
      if (error.code) {
        const errorCode = error.code
        const errorMessages: { [key: string]: string } = {
          'auth/user-not-found': 'User not found. Please check your email.',
          'auth/wrong-password': 'Incorrect password. Please try again.',
          'auth/invalid-email':
            'Invalid email address. Please enter a valid email.',
          'auth/weak-password':
            'Weak password. Please choose a stronger password.',
          'auth/email-already-in-use':
            'Email is already in use. Please choose a different email.',
        }
        toast.error(errorMessages[errorCode] || error.message)
        setError(errorMessages[errorCode] || error.message)
      } else {
        setError(error.message)
      }
      setLoading(false)
    } finally {
      setTimeout(() => {
        setError('')
      }, 2000)
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-primary">
      <div className="mx-2 w-full max-w-md rounded-xl bg-white p-10">
        <h1 className="text-center text-lg font-semibold text-content">
          Login to your account
        </h1>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="mt-8">
            <label
              htmlFor="rp-email"
              className="block text-sm font-medium text-content"
            >
              Email
            </label>
            <input
              type="email"
              id="rp-email"
              placeholder="manoj@richpanel.com"
              value={email!}
              onChange={handleEmailChange}
              className="mt-1 w-full rounded-md border-2 border-gray-200 p-2 outline-none placeholder:text-sm placeholder:text-slate-400"
            />
          </div>
          <div>
            <label
              htmlFor="rp-passwd"
              className="block text-sm font-medium text-content"
            >
              Password
            </label>
            <input
              type="password"
              id="rp-passwd"
              placeholder="●●●●●●●●●●●"
              value={password!}
              onChange={handlePasswordChange}
              className="mt-1 w-full rounded-md border-2 border-gray-200 p-2 outline-none placeholder:text-sm placeholder:text-slate-300"
            />
          </div>
          <div className="relative">
            <div
              className={`absolute left-0 top-1/2 h-5 w-5  -translate-y-1/2 transform cursor-pointer rounded border border-gray-600 transition-all duration-200 ${
                rememberMe ? 'bg-primary' : ''
              }`}
              onClick={handleRememberMeChange}
            >
              {rememberMe && (
                <svg
                  className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform font-bold text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              id="rp-remember"
              className="hidden"
              onChange={handleRememberMeChange}
              checked={rememberMe}
            />
            <label
              htmlFor="rp-remember"
              className="cursor-pointer pl-7 text-sm text-content"
            >
              Remember Me
            </label>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}{' '}
          <button
            type="submit"
            disabled={!email || !password}
            className="w-full cursor-pointer rounded bg-primary py-3 text-white hover:bg-primary/80 hover:transition-all hover:duration-200 disabled:bg-primary/70"
          >
            {loading ? <ClipLoader size={20} color="white" /> : 'Login'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-content">
          New to helper?{' '}
          <span
            className="cursor-pointer font-medium text-primary hover:underline"
            onClick={() => router.push('/register')}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login

'use client'

import React, { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/firebase/fb-helper-utils'
import {
  Persistence,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth'
import { firebase_auth } from '@/lib/firebase-client'
import { ClipLoader } from 'react-spinners'

const CreateAccount = () => {
  const [checked, setChecked] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const handleChecked = () => {
    setChecked(!checked)
  }

  const handleFileOpen = () => {
    const element = document.getElementById('fileInput') as HTMLElement
    element.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0]

    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed')
        return
      }
      const reader = new FileReader()

      reader.onload = (e) => {
        setSelectedFile(e.target?.result as string)
      }

      reader.readAsDataURL(file)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    const persistenceType = checked ? browserSessionPersistence : 'NONE'

    const nameInput = document.getElementById('rp-name') as HTMLInputElement
    const emailInput = document.getElementById('rp-email') as HTMLInputElement
    const passwordInput = document.getElementById(
      'rp-passwd'
    ) as HTMLInputElement

    const name = nameInput?.value
    const email = emailInput?.value
    const password = passwordInput?.value

    try {
      if (!name || !email || !password || !selectedFile) {
        throw new Error('All fields are required')
      }

      if (selectedFile.trim() === '') {
        throw new Error('Selected file is empty')
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email address')
      }

      await setPersistence(firebase_auth, persistenceType as Persistence).then(
        () => {
          return registerUser(name, email, selectedFile, password)
        }
      )

      toast.success('Account created successfully!')
      router.push('/login')
    } catch (error: any) {
      toast.error(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-primary">
      <div className="mx-2 w-full max-w-md rounded-xl bg-white p-10">
        <h1 className="text-center text-lg font-semibold text-content">
          Create Account
        </h1>
        <form className="space-y-6" onSubmit={handleSignUp}>
          <div className="mt-8">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex justify-center">
              <div
                className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-gray-200"
                onClick={handleFileOpen}
              >
                {selectedFile ? (
                  <Image
                    width={0}
                    height={0}
                    src={selectedFile}
                    alt="Selected File"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <svg
                    fill="#333"
                    height="20px"
                    width="20px"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 74.207 74.207"
                  >
                    <g>
                      <path
                        d="M57.746,14.658h-2.757l-1.021-3.363c-0.965-3.178-3.844-5.313-7.164-5.313H28.801c-3.321,0-6.201,2.135-7.165,5.313
		l-1.021,3.363h-4.153C7.385,14.658,0,22.043,0,31.121v20.642c0,9.077,7.385,16.462,16.462,16.462h41.283
		c9.077,0,16.462-7.385,16.462-16.462V31.121C74.208,22.043,66.823,14.658,57.746,14.658z M68.208,51.762
		c0,5.769-4.693,10.462-10.462,10.462H16.462C10.693,62.223,6,57.53,6,51.762V31.121c0-5.769,4.693-10.462,10.462-10.462h8.603
		l2.313-7.621c0.192-0.631,0.764-1.055,1.423-1.055h18.003c0.659,0,1.23,0.424,1.423,1.057l2.314,7.619h7.204
		c5.769,0,10.462,4.693,10.462,10.462L68.208,51.762L68.208,51.762z"
                      />
                      <path
                        d="M37.228,25.406c-8.844,0-16.04,7.195-16.04,16.04c0,8.844,7.195,16.039,16.04,16.039s16.041-7.195,16.041-16.039
		C53.269,32.601,46.073,25.406,37.228,25.406z M37.228,51.486c-5.536,0-10.04-4.504-10.04-10.039c0-5.536,4.504-10.04,10.04-10.04
		c5.537,0,10.041,4.504,10.041,10.04C47.269,46.982,42.765,51.486,37.228,51.486z"
                      />
                    </g>
                  </svg>
                )}
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="rp-name"
              className="block text-sm font-medium text-content"
            >
              Name
            </label>
            <input
              type="text"
              id="rp-name"
              placeholder="Manoj Kumar"
              className="mt-1 w-full rounded-md border-2 border-gray-200 p-2 outline-none placeholder:text-sm placeholder:text-slate-400"
            />
          </div>
          <div>
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
              className="mt-1 w-full rounded-md border-2 border-gray-200 p-2 outline-none placeholder:text-sm placeholder:text-slate-300"
            />
          </div>
          <div className="relative">
            <div
              className={`absolute left-0 top-1/2 h-5 w-5  -translate-y-1/2 transform cursor-pointer rounded border border-gray-600 transition-all duration-200 ${
                checked ? 'bg-primary' : ''
              }`}
              onClick={handleChecked}
            >
              {checked && (
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
              onChange={handleChecked}
              checked={checked}
            />
            <label
              htmlFor="rp-remember"
              className="cursor-pointer pl-7 text-sm text-content"
            >
              Remember Me
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded bg-primary py-3 text-white hover:bg-primary/80 hover:transition-all hover:duration-200 disabled:bg-primary/70"
          >
            {loading ? <ClipLoader size={20} color="white" /> : 'Sign Up'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-content">
          Already have an account?{' '}
          <span
            className="cursor-pointer font-medium text-primary hover:underline"
            onClick={() => router.replace('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default CreateAccount

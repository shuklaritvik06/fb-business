'use client'

import { RichPanelContextValues } from '@/context/app-context'
import { firebase_auth } from '@/lib/firebase-client'
import { IFBAccountData } from '@/types/richpanel-fb.types'
import { FacebookAuthProvider, linkWithPopup, unlink } from 'firebase/auth'
import { ClipLoader } from 'react-spinners'
import Link from 'next/link'
import React, { useContext, useState } from 'react'

const ConnectFB = () => {
  const [loading, setLoading] = useState(false)
  const { connected, setConnected, setPageName, pageName } = useContext(
    RichPanelContextValues
  )!

  const fetchPageData = (accessToken: string) => {
    fetch('https://graph.facebook.com/v13.0/me?fields=accounts', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data: IFBAccountData) => {
        const page_data = data.accounts.data[0]
        setPageName(page_data.name)
        setConnected(true)
        localStorage.setItem('facebook_page_data', JSON.stringify(page_data))
      })
  }

  const unlinkFB = () => {
    setLoading(true)
    unlink(firebase_auth.currentUser!, 'facebook.com')
      .then(() => {
        setConnected(false)
        localStorage.removeItem('facebook_page_data')
        localStorage.removeItem('facebook_user_access_token')
      })
      .catch((error: any) => {
        console.log('Error unlinking: ', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const integrateFacebook = () => {
    setLoading(true)
    const facebookProvider = new FacebookAuthProvider()
    const facebookScopes = [
      'email',
      'pages_manage_metadata',
      'pages_read_engagement',
      'pages_messaging',
    ]

    for (const scopeIndex in facebookScopes) {
      facebookProvider.addScope(facebookScopes[scopeIndex])
    }

    linkWithPopup(firebase_auth.currentUser!, facebookProvider)
      .then((result) => {
        const credential = FacebookAuthProvider.credentialFromResult(result)
        const accessToken = credential?.accessToken
        if (accessToken) {
          localStorage.setItem('facebook_user_access_token', accessToken)
          fetchPageData(accessToken)
        }
      })
      .catch((error) => {
        console.error('Facebook Authentication Error:', error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const renderConnectedPageInfo = () => (
    <p className="mt-5 text-center text-content">
      Integrated Page:{' '}
      <span className="font-bold text-content">
        {pageName ??
          JSON.parse(localStorage.getItem('facebook_page_data') || '{}').name}
      </span>
    </p>
  )

  const renderActionButtons = () => (
    <div className="mt-8 flex flex-col gap-3">
      <div
        className="w-full cursor-pointer rounded bg-danger py-3 text-center text-white hover:bg-danger/80 hover:transition-all hover:duration-200"
        onClick={unlinkFB}
      >
        {loading ? (
          <ClipLoader size={20} color="white" />
        ) : (
          'Delete Integration'
        )}
      </div>
      <Link
        href="/"
        className="w-full cursor-pointer rounded bg-primary py-3 text-center text-white hover:bg-primary/80 hover:transition-all hover:duration-200"
      >
        Reply to Messages
      </Link>
    </div>
  )

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-primary">
      <div className="mx-2 w-full max-w-md rounded-xl bg-white p-10">
        <h1 className="text-center text-lg font-semibold text-content">
          Facebook Page Integration
        </h1>
        {connected && renderConnectedPageInfo()}
        {connected ? (
          renderActionButtons()
        ) : (
          <button
            onClick={integrateFacebook}
            className="mt-8 w-full cursor-pointer rounded bg-primary py-3 text-center text-white hover:bg-primary/80 hover:transition-all hover:duration-200"
          >
            Connect Page
          </button>
        )}
      </div>
    </div>
  )
}

export default ConnectFB

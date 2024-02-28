'use client'

import { onAuthStateChanged, User } from 'firebase/auth'
import React, {
  ReactNode,
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { destroyCookie, parseCookies } from 'nookies'

import { firebase_auth } from '@/lib/firebase-client'
import { IRichPanelContext } from '@/types/richpanel-fb.types'

export const RichPanelContextValues = createContext<IRichPanelContext | null>(
  null
)

const RichPanelContext = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [pageName, setPageName] = useState<string | null>(null)

  const cookies = parseCookies()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase_auth, (authUser) => {
      if (authUser) {
        setUser(authUser)
      } else {
        destroyCookie(null, 'session')
      }
    })

    if (!cookies['session']) {
      window.location.href = '/login'
    }

    return () => unsubscribe()
  }, [cookies])

  useLayoutEffect(() => {
    const token = localStorage.getItem('facebook_page_data')
    if (token) {
      setConnected(true)
    }
  }, [])

  const contextValues: IRichPanelContext = {
    setConnected,
    connected,
    user,
    setUser,
    pageName,
    setPageName,
  }

  return (
    <RichPanelContextValues.Provider value={contextValues}>
      {children}
    </RichPanelContextValues.Provider>
  )
}

export default RichPanelContext

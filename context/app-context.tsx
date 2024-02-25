'use client'

import { firebase_auth } from '@/lib/firebase-client'
import { IRichPanelContext } from '@/types/richpanel-fb.types'
import { User, onAuthStateChanged } from 'firebase/auth'
import React, {
  ReactNode,
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

export const RichPanelContextValues = createContext<IRichPanelContext | null>(
  null
)

const RichPanelContext = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [pageName, setPageName] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase_auth, (authUser) => {
      setUser(authUser)
    })
    return () => unsubscribe()
  }, [])

  useLayoutEffect(() => {
    const token = localStorage.getItem(`facebook_page_data`)
    if (token) {
      setConnected(true)
    }
  }, [])

  return (
    <RichPanelContextValues.Provider
      value={{ setConnected, connected, user, setUser, pageName, setPageName }}
    >
      {children}
    </RichPanelContextValues.Provider>
  )
}

export default RichPanelContext

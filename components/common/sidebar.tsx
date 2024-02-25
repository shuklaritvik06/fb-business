'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Inbox, Analytics, Users } from '@/components/icons/app-icons'
import { usePathname } from 'next/navigation'
import UserMenu from './user-menu'

const SideBar = () => {
  const pathname = usePathname()

  const getLinkClassName = (path: string) => {
    return `w-full flex justify-center px-4 py-6 ${
      pathname === path && 'bg-white'
    }`
  }

  return (
    <aside className="hidden h-screen bg-primary lg:block lg:w-20">
      <div className="flex h-full flex-col justify-between">
        <div className="mt-5 flex flex-col items-center">
          <Link href="/">
            <Image
              src={'logo.svg'}
              width={0}
              height={0}
              alt="Logo"
              className="h-10 w-10"
            />
          </Link>
          <div className="mt-6 flex w-full flex-col items-center">
            <Link href="/" className={getLinkClassName('/')}>
              <Inbox selected={pathname === '/'} />
            </Link>
            <Link href="/teams" className={getLinkClassName('/teams')}>
              <Users selected={pathname === '/teams'} />
            </Link>
            <Link href="/analytics" className={getLinkClassName('/analytics')}>
              <Analytics selected={pathname === '/analytics'} />
            </Link>
          </div>
        </div>
        <UserMenu />
      </div>
    </aside>
  )
}

export default SideBar

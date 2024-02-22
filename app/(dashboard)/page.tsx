import { HomeMain } from '@/components'
import SideBar from '@/components/common/sidebar'
import React from 'react'

const DashboardPage = () => {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <SideBar />
      <div className="flex-1">
        <HomeMain />
      </div>
    </main>
  )
}

export default DashboardPage

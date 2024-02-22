import { ConnectFB } from '@/components'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  metadataBase: new URL('https://richpanel.com'),
  title: 'Connect',
  openGraph: {
    title: 'Richpanel | Facebook Messenger Manager - Connect',
    description:
      'Respond faster &amp; smarter with the leader in AI for customer service.',
    type: 'website',
    url: 'https://richpanel.com',
  },
  twitter: {
    card: 'summary',
    title: 'Richpanel | Facebook Messenger Manager - Connect',
    description:
      'Respond faster &amp; smarter with the leader in AI for customer service.',
    site: 'richpanel.com',
  },
  description:
    'Respond faster &amp; smarter with the leader in AI for customer service.',
}

const ConnectFBPage = () => {
  return (
    <main>
      <ConnectFB />
    </main>
  )
}

export default ConnectFBPage

import { CreateAccount } from '@/components'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  metadataBase: new URL('https://richpanel.com'),
  title: 'Register',
  openGraph: {
    title: 'Richpanel | Facebook Messenger Manager - Authenticate',
    description:
      'Respond faster &amp; smarter with the leader in AI for customer service.',
    type: 'website',
    url: 'https://richpanel.com',
  },
  twitter: {
    card: 'summary',
    title: 'Richpanel | Facebook Messenger Manager - Authenticate',
    description:
      'Respond faster &amp; smarter with the leader in AI for customer service.',
    site: 'richpanel.com',
  },
  description:
    'Respond faster &amp; smarter with the leader in AI for customer service.',
}

const RegisterPage = () => {
  return (
    <main>
      <CreateAccount />
    </main>
  )
}

export default RegisterPage

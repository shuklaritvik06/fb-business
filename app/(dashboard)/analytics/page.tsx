import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  metadataBase: new URL('https://richpanel.com'),
  title: 'Analyze',
  openGraph: {
    title: 'Richpanel | Facebook Messenger Manager - Analytics',
    description:
      'Respond faster &amp; smarter with the leader in AI for customer service.',
    type: 'website',
    url: 'https://richpanel.com',
  },
  twitter: {
    card: 'summary',
    title: 'Richpanel | Facebook Messenger Manager - Analytics',
    description:
      'Respond faster &amp; smarter with the leader in AI for customer service.',
    site: 'richpanel.com',
  },
  description:
    'Respond faster &amp; smarter with the leader in AI for customer service.',
}

const AnalyticsPage = () => {
  return <main></main>
}

export default AnalyticsPage

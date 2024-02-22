import { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://richpanel.com'),
  title: {
    default: 'Richpanel | Facebook Messenger Manager',
    template: 'Richpanel | Facebook Messenger Manager - %s',
  },
  openGraph: {
    title: 'Richpanel | Facebook Messenger Manager',
    description:
      'Respond faster &amp; smarter with the leader in AI for customer service.',
    type: 'website',
    url: 'https://richpanel.com',
  },
  twitter: {
    card: 'summary',
    title: 'Richpanel | Facebook Messenger Manager',
    description:
      'Respond faster &amp; smarter with the leader in AI for customer service.',
    site: 'richpanel.com',
  },
  description:
    'Respond faster &amp; smarter with the leader in AI for customer service.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="favicon.png" />
      </head>
      <body className={roboto.className} suppressHydrationWarning>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}

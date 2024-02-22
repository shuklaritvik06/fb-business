import { Roboto } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '../globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

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
      <body suppressHydrationWarning className={roboto.className}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Travel App',
  description: 'Explore the world with our travel app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

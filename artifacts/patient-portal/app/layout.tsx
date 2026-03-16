import type { Metadata } from 'next'
import { DM_Sans, Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Pulse & Function — Patient Portal',
  description: 'Premium functional medicine patient portal by Dr Sarah Al-Temimi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${inter.variable} font-body bg-cream-200 text-cream-900`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

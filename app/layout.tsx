import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hormozi Brain — $100M Business Advisor',
  description: 'Cố vấn kinh doanh theo framework $100M của Alex Hormozi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${geist.variable} h-full`}>
      <body className="h-full bg-zinc-950 antialiased">{children}</body>
    </html>
  )
}

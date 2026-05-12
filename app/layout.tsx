import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './Providers' // <-- Import ini

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MatchMyPath',
  description: 'Butuh Pekerjaan Sampingan?,Cari Tau dulu SKILLMUUU',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers> {/* <-- Bungkus children dengan Providers */}
          {children}
        </Providers>
      </body>
    </html>
  )
}
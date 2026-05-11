import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/layout/AuthProvider'

export const metadata: Metadata = {
  title: 'FeedForward - Turn Surplus into Sustenance',
  description: 'A real-time digital platform turning restaurant, hotel, and supermarket surplus food into community meals in under 90 minutes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-slate-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

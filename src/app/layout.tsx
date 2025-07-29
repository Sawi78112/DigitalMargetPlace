import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/providers/theme-provider'
import { QueryProvider } from '@/lib/providers/query-provider'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digital Market Place',
  description: 'Digital Market Place - Your one-stop destination for digital products',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={`${inter.className} light`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#333',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                },
              }}
            />
            <SonnerToaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 
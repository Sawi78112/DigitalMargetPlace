'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthCheck } from '@/lib/hooks/use-current-user'

export default function ULayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuthCheck()

  useEffect(() => {
    if (isLoading) return

    // If not authenticated, redirect to login
    if (!user) {
      router.push('/login')
      return
    }

    // If user needs verification and not already on email-confirmation page
    const needVerification = 
      pathname.startsWith('/u') && 
      !pathname.startsWith('/u/email-confirmation') && 
      !user.verified_at

    if (needVerification) {
      router.push('/u/email-confirmation')
      return
    }

    // If user is verified and on email-confirmation page, redirect to home
    if (pathname === '/u/email-confirmation' && user.verified_at) {
      router.push('/home')
      return
    }
  }, [user, isLoading, pathname, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl">Loading...</h1>
        </div>
      </div>
    )
  }

  // Don't render children until auth check is complete
  if (!user) return null

  return <>{children}</>
} 
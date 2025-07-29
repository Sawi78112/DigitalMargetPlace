'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthCheck } from '@/lib/hooks/use-current-user'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isLoading, isUnauthenticated } = useAuthCheck()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isLoading && isUnauthenticated) {
      router.push('/login')
    }
  }, [isMounted, isLoading, isUnauthenticated, router])

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl">Loading...</h1>
        </div>
      </div>
    )
  }

  if (isUnauthenticated) {
    return null
  }

  return <>{children}</>
} 
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UPage() {
  const router = useRouter()

  useEffect(() => {
    // Default /u route should redirect to email-confirmation
    router.push('/u/email-confirmation')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl">Redirecting...</h1>
      </div>
    </div>
  )
} 
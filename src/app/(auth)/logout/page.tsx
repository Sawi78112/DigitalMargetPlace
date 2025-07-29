'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/api'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    auth.clearToken()
    router.push('/login')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl">Logging out...</h1>
      </div>
    </div>
  )
} 
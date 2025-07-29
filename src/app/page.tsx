'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/api'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const token = auth.getToken()
    if (token) {
      router.push('/home')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl">Loading...</h1>
      </div>
    </div>
  )
} 
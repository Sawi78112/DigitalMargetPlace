'use client'

import { useQuery } from '@tanstack/react-query'
import { getUserMe, auth, type User } from '@/lib/api'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getUserMe,
    enabled: !!auth.getToken(),
    retry: false,
  })
}

export function useAuthCheck() {
  const { data: user, isLoading, error } = useCurrentUser()
  const token = auth.getToken()
  
  return {
    user,
    isLoading,
    isAuthenticated: !!token && !!user,
    isUnauthenticated: !token || !!error,
  }
} 
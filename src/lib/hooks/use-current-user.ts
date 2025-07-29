import { useQuery } from '@tanstack/react-query'
import { auth, getUserMe } from '@/lib/api'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getUserMe,
    enabled: !!auth.getToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAuthCheck() {
  const { data: user, isLoading, isError } = useCurrentUser()
  const token = auth.getToken()
  
  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user && !isError,
    isUnauthenticated: !token || !!isError,
  }
} 
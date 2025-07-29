'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { User } from '@/lib/types'

export function useCurrentUser(initialData?: User | null) {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async (): Promise<User> => {
      return api<User>({
        method: 'GET',
        url: '/auth/me',
      })
    },
    initialData: initialData || undefined,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

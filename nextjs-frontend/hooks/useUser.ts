'use client'

import { useQuery } from '@tanstack/react-query'
import fetchSingleUser from '@/utils/fetchSingleUser'

function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchSingleUser(userId),
  })
}

export default useUser

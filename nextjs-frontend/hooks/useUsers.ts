'use client'

import { useQuery } from '@tanstack/react-query'
import fetchAllUsers from '@/utils/fetchAllUsers'

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  })
}

export default useUsers

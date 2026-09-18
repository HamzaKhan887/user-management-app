'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import createUser from '@/utils/createUser'
import { toast } from '@/components/ui/toast'

function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.add({
        type: 'success',
        description: 'User created successfully.',
      })
    },
    onError: () => {
      toast.add({
        type: 'error',
        description: 'Failed to create user. Please try again.',
      })
    },
  })
}

export default useCreateUser

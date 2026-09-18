'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import deleteUser from '@/utils/deleteUser'

function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', variables] })
      toast.add({
        type: 'success',
        description: 'Successfully deleted user',
      })
    },
    onError: () => {
      toast.add({
        type: 'error',
        description: 'Could not delete user. Please try again',
      })
    },
  })
}

export default useDeleteUser

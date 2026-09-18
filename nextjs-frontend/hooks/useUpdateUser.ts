'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import updateUser from '@/utils/updateUser'
import { CreateAndEditUser } from '@/utils/types'
import { toast } from '@/components/ui/toast'

function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      user,
    }: {
      userId: string
      user: CreateAndEditUser
    }) => updateUser(userId, user),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] })
      toast.add({
        type: 'success',
        description: 'Successfully updated user',
      })
    },
    onError: () => {
      toast.add({
        type: 'error',
        description: 'Could not update user. Please try again',
      })
    },
  })
}

export default useUpdateUser

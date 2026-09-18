import { UserFormValues, User } from '@/utils/types'
import api from '@/utils/api'

async function updateUser(userId: string, user: UserFormValues) {
  const response = await api.put<User>(`/users/${userId}`, user)
  return response.data
}

export default updateUser

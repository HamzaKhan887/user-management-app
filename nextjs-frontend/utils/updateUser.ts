import { CreateAndEditUser, User } from '@/utils/types'
import api from '@/utils/api'

async function updateUser(userId: string, user: CreateAndEditUser) {
  const response = await api.put<User>(`/users/${userId}`, user)
  return response.data
}

export default updateUser

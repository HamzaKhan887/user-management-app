import api from '@/utils/api'

async function deleteUser(userId: string) {
  const response = await api.delete<{ message: string }>(`/users/${userId}`)
  return response.data
}

export default deleteUser

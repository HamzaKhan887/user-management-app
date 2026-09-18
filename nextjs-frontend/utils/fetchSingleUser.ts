import api from '@/utils/api'
import { User } from '@/utils/types'

async function fetchSingleUser(userId: string) {
  const response = await api.get<User>(`/users/${userId}`)
  return response.data
}

export default fetchSingleUser

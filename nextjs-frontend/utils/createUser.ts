import { UserFormValues, User } from '@/utils/types'
import api from '@/utils/api'

async function createUser(user: UserFormValues) {
  const response = await api.post<User>('/users', user)
  return response.data
}

export default createUser

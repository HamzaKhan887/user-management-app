import { CreateAndEditUser } from '@/utils/types'
import api from '@/utils/api'

async function createUser(user: CreateAndEditUser) {
  const response = await api.post('/users', user)
  return response.data
}

export default createUser

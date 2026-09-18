import api from './api'
import { User } from '@/utils/types'

async function fetchAllUsers() {
  const response = await api.get<User[]>('/users')
  return response.data || []
}

export default fetchAllUsers

import 'dotenv/config'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_AWS_API_URL

if (!API_URL) {
  console.error(
    'NEXT_PUBLIC_AWS_API_URL is not set. Check your .env.local file.'
  )
  process.exit(1)
}

async function unseed() {
  console.log('Fetching all users...')

  const { data: users } = await axios.get(`${API_URL}/users`)
  const seededUsers = users.filter((user: { email: string }) =>
    user.email.endsWith('@example.com')
  )

  if (seededUsers.length === 0) {
    console.log('No seeded users found.')
    return
  }

  console.log(`Found ${seededUsers.length} seeded users. Deleting...`)

  for (const user of seededUsers) {
    try {
      await axios.delete(`${API_URL}/users/${user.id}`)
      console.log(`✓ Deleted ${user.name}`)
    } catch (error) {
      console.error(`✗ Failed to delete ${user.name}:`, error)
    }
  }

  console.log('Done.')
}

unseed()

import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_AWS_API_URL

if (!API_URL) {
  console.error(
    'NEXT_PUBLIC_AWS_API_URL is not set. Check your .env.local file.'
  )
  process.exit(1)
}

const users = [
  { name: 'Alice Johnson', email: 'alice.johnson@example.com' },
  { name: 'Brian Smith', email: 'brian.smith@example.com' },
  { name: 'Chloe Martinez', email: 'chloe.martinez@example.com' },
  { name: 'Daniel Lee', email: 'daniel.lee@example.com' },
  { name: 'Emma Wilson', email: 'emma.wilson@example.com' },
  { name: 'Farhan Ahmed', email: 'farhan.ahmed@example.com' },
  { name: 'Grace Kim', email: 'grace.kim@example.com' },
  { name: 'Henry Brown', email: 'henry.brown@example.com' },
  { name: 'Isabella Garcia', email: 'isabella.garcia@example.com' },
  { name: 'Jack Thompson', email: 'jack.thompson@example.com' },
  { name: 'Kavya Patel', email: 'kavya.patel@example.com' },
  { name: "Liam O'Connor", email: 'liam.oconnor@example.com' },
  { name: 'Maya Rodriguez', email: 'maya.rodriguez@example.com' },
  { name: 'Noah Davis', email: 'noah.davis@example.com' },
  { name: 'Olivia Chen', email: 'olivia.chen@example.com' },
  { name: 'Priya Sharma', email: 'priya.sharma@example.com' },
  { name: 'Quinn Taylor', email: 'quinn.taylor@example.com' },
  { name: 'Ryan Mitchell', email: 'ryan.mitchell@example.com' },
  { name: 'Sofia Rossi', email: 'sofia.rossi@example.com' },
  { name: 'Tyler Anderson', email: 'tyler.anderson@example.com' },
]

async function seed() {
  console.log(`Seeding ${users.length} users...`)

  for (const user of users) {
    try {
      await axios.post(`${API_URL}/users`, user)
      console.log(`✓ Created ${user.name}`)
    } catch (error) {
      console.error(`✗ Failed to create ${user.name}:`, error)
    }
  }

  console.log('Done.')
}

seed()

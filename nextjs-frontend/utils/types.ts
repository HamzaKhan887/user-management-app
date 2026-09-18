import * as z from 'zod'

export const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.email('Enter a valid email address.'),
})

export type CreateAndEditUser = z.infer<typeof userFormSchema>

export type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

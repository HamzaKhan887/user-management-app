'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SingleUser from '@/components/SingleUser'
import useUsers from '@/hooks/useUsers'

function UserList() {
  const { data } = useUsers()
  const users = data || []
  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <Card className='w-full max-w-4xl'>
      <CardHeader>
        <CardTitle>Users List</CardTitle>
        <CardDescription>
          List of all users in the DynamoDB table
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedUsers.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-2 py-12 text-center'>
            <p className='text-lg font-medium text-muted-foreground'>
              No users yet
            </p>
            <p className='text-sm text-muted-foreground'>
              Create your first user using the form to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className='text-right'>Edit User</TableHead>
                <TableHead className='text-right'>Delete User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <SingleUser key={user.id} {...user} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className='flex-col gap-2 text-muted-foreground'>
        {sortedUsers.length} {sortedUsers.length === 1 ? 'user' : 'users'}
      </CardFooter>
    </Card>
  )
}

export default UserList

import DeleteUserButton from '@/components/DeleteUserButton'
import { TableCell, TableRow } from '@/components/ui/table'
import { User } from '@/utils/types'
import EditUserButton from '@/components/EditUserButton'

function SingleUser({ id, name, email, createdAt }: User) {
  return (
    <TableRow>
      <TableCell className='font-medium'>{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>
        {new Date(createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC',
        })}{' '}
        <span className='text-muted-foreground text-xs'>(UTC)</span>
      </TableCell>
      <TableCell className='text-right'>
        <EditUserButton userId={id} />
      </TableCell>
      <TableCell className='text-right'>
        <DeleteUserButton userId={id} />
      </TableCell>
    </TableRow>
  )
}

export default SingleUser

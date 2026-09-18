import DeleteUserButton from '@/components/DeleteUserButton'
import { TableCell, TableRow } from '@/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { User } from '@/utils/types'
import EditUserButton from '@/components/EditUserButton'

function SingleUser({ id, name, email, createdAt, imageUrl }: User) {
  return (
    <TableRow>
      <TableCell>
        <div className='flex justify-center'>
          <Avatar>
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </TableCell>
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
        <EditUserButton user={{ id, name, email, createdAt, imageUrl }} />
      </TableCell>
      <TableCell className='text-right'>
        <DeleteUserButton userId={id} />
      </TableCell>
    </TableRow>
  )
}

export default SingleUser

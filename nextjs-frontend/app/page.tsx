import CreateUserForm from '@/components/CreateUserForm'
import UserList from '@/components/UserList'
import Navbar from '@/components/Navbar'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  noop,
} from '@tanstack/react-query'
import fetchAllUsers from '@/utils/fetchAllUsers'

export default async function Home() {
  const queryClient = new QueryClient()
  await queryClient
    .query({
      queryKey: ['users'],
      queryFn: fetchAllUsers,
    })
    .catch(noop)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Navbar />
      <div className='align-elements py-8 items-start'>
        <CreateUserForm />
        <UserList />
      </div>
    </HydrationBoundary>
  )
}

import { ToggleTheme } from '@/components/ToggleTheme'

function Navbar() {
  return (
    <div className='align-elements items-center py-6 border-b'>
      <div className='flex flex-col gap-1'>
        <span className='text-xl font-semibold tracking-tight'>
          User Management App
        </span>
        <span className='text-xs text-muted-foreground'>
          Using AWS Lambda, API Gateway and DynamoDB
        </span>
      </div>
      <ToggleTheme />
    </div>
  )
}

export default Navbar

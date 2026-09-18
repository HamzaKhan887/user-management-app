'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import useUser from '@/hooks/useUser'
import useUpdateUser from '@/hooks/useUpdateUser'
import { CreateAndEditUser, userFormSchema } from '@/utils/types'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

function EditUserButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState<boolean>(false)
  const { data } = useUser(userId)

  const form = useForm<CreateAndEditUser>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        email: data.email,
      })
    }
  }, [data, form])

  const { mutateAsync, isPending } = useUpdateUser()

  async function onSubmit(data: CreateAndEditUser) {
    await mutateAsync({ userId, user: data })
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant='outline'>Edit</Button>} />
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form id='edit-user-form' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='name-1'>Name</FieldLabel>
                  <Input
                    {...field}
                    id='name-1'
                    aria-invalid={fieldState.invalid}
                    placeholder='Enter a name'
                    autoComplete='off'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='email-1'>Email</FieldLabel>
                  <Input
                    {...field}
                    id='email-1'
                    aria-invalid={fieldState.invalid}
                    placeholder='Enter an email'
                    autoComplete='off'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose render={<Button variant='outline'>Cancel</Button>} />
          <Button type='submit' form='edit-user-form' disabled={isPending}>
            {isPending ? <Spinner /> : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserButton

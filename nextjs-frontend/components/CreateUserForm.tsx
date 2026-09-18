'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CreateAndEditUser, userFormSchema } from '@/utils/types'
import useCreateUser from '@/hooks/useCreateUser'
import { Spinner } from './ui/spinner'

function CreateUserForm() {
  const form = useForm<CreateAndEditUser>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  const { mutateAsync, isPending } = useCreateUser()

  async function onSubmit(data: CreateAndEditUser) {
    await mutateAsync(data)
    form.reset()
  }

  return (
    <Card className='w-full sm:max-w-md'>
      <CardHeader>
        <CardTitle>Create User</CardTitle>
        <CardDescription>Create a new user</CardDescription>
      </CardHeader>
      <CardContent>
        <form id='create-user-form' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='name'>Name</FieldLabel>
                  <Input
                    {...field}
                    id='name'
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
                  <FieldLabel htmlFor='email'>Email</FieldLabel>
                  <Input
                    {...field}
                    id='email'
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
      </CardContent>
      <CardFooter>
        <Field orientation='horizontal'>
          <Button type='button' variant='outline' onClick={() => form.reset()}>
            Reset
          </Button>

          <Button type='submit' form='create-user-form' disabled={isPending}>
            {isPending ? <Spinner /> : 'Submit'}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

export default CreateUserForm

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
import { UserFormValues, userFormSchema } from '@/utils/types'
import useCreateUser from '@/hooks/useCreateUser'
import { Spinner } from './ui/spinner'
import { useState } from 'react'

function CreateUserForm() {
  const [fileInputKey, setFileInputKey] = useState(0)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      imageData: '',
    },
  })

  const { mutateAsync, isPending } = useCreateUser()

  function resetForm() {
    form.reset()
    setFileInputKey((k) => k + 1)
  }

  async function onSubmit(data: UserFormValues) {
    await mutateAsync(data)
    resetForm()
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
                  <FieldLabel htmlFor='name'>
                    Name <span className='text-muted-foreground -ml-1'>*</span>
                  </FieldLabel>
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
                  <FieldLabel htmlFor='email'>
                    Email
                    <span className='text-muted-foreground -ml-1'>*</span>
                  </FieldLabel>
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
            <Controller
              name='imageData'
              control={form.control}
              render={({
                field: { onChange, onBlur, name, ref },
                fieldState,
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='image'>Profile Picture</FieldLabel>
                  <Input
                    type='file'
                    accept='image/jpeg,image/png,image/gif'
                    id='image'
                    key={fileInputKey}
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) {
                        onChange('')
                        return
                      }

                      const reader = new FileReader()
                      reader.onload = () => {
                        onChange(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }}
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
          <Button type='button' variant='outline' onClick={resetForm}>
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

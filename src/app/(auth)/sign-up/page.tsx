'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'

import { useDebounceCallback } from 'usehooks-ts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import * as z from 'zod'

import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { signUpSchema } from '@/schemas/signUpSchema'
import ApiResponse from '@/types/ApiResponse'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const Page = () => {

  const router = useRouter()

  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 300)

  // React Hook Form + Zod
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),

    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  // Username Availability Check
  useEffect(() => {

    const checkUsernameUnique = async () => {

      if (!username) return

      setIsCheckingUsername(true)
      setUsernameMessage('')

      try {

        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        )

        setUsernameMessage(response.data.message)

      } catch (error) {

        const axiosError = error as AxiosError<ApiResponse>

        setUsernameMessage(
          axiosError.response?.data.message ??
          'Error checking username'
        )

      } finally {
        setIsCheckingUsername(false)
      }
    }

    checkUsernameUnique()

  }, [username])

  // Form Submit
  const onSubmit = async (
    data: z.infer<typeof signUpSchema>
  ) => {

    setIsSubmitting(true)

    try {

      const response = await axios.post<ApiResponse>(
        '/api/sign-up',
        data
      )

      toast.success(response.data.message)

      router.replace(`/verify/${data.username}`)

    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>

      toast.error(
        axiosError.response?.data.message ||
        'Error signing up'
      )

    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">

      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-md">

        {/* Heading */}
        <div className="mb-6 text-center">

          <h1 className="text-4xl font-extrabold leading-none tracking-tight text-black">
            Join Mystery
            <br />
            Message
          </h1>

          <p className="mt-4 text-base text-gray-700">
            Sign up to start your anonymous adventure
          </p>

        </div>

        {/* Form */}
        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Username */}
            <FormField
              control={form.control}
              name="username"

              render={({ field }) => (

                <FormItem>

                  <FormLabel className="text-base font-semibold text-black">
                    Username
                  </FormLabel>

                  <FormControl>

                    <Input
                      placeholder="username"
                      className="h-10 rounded-md border-gray-300 text-sm text-black placeholder:text-gray-500"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                
                  </FormControl>
                {isCheckingUsername && <Loader2 className="animate-spin"/>}
                <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}>
                    {usernameMessage}
                </p>
                  <FormMessage />

                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"

              render={({ field }) => (

                <FormItem>

                  <FormLabel className="text-base font-semibold text-black">
                    Email
                  </FormLabel>

                  <FormControl>

                    <Input
                      type="email"
                      placeholder="email"
                      className="h-10 rounded-md border-gray-300 text-sm text-black placeholder:text-gray-500"
                      {...field}
                    />

                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"

              render={({ field }) => (

                <FormItem>

                  <FormLabel className="text-base font-semibold text-black">
                    Password
                  </FormLabel>

                  <FormControl>

                    <Input
                      type="password"
                      placeholder="password"
                      className="h-10 rounded-md border-gray-300 text-sm text-black placeholder:text-gray-500"
                      {...field}
                    />

                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg bg-[#0b1023] px-6 text-sm font-medium text-white hover:bg-[#11182f]"
            >

              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Signup'
                )
              }

            </Button>

          </form>

        </Form>

        {/* Footer */}
        <div className="mt-8 text-center text-base">

          <p className="text-gray-800">

            Already a member?{' '}

            <Link
              href="/sign-in"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Page
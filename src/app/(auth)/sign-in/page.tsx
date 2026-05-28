'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

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
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'

const Page = () => {
  const router = useRouter()

  // React Hook Form + Zod
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  // Form Submit
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Invalid email or password')
      } else {
        toast.error(result.error)
      }
    }

    if (result?.url) {
      router.replace('/dashboard')
    }
    console.log(result)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f5f8] px-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-10 shadow-sm border border-gray-100/40">

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-[38px] font-black tracking-tight text-[#0a0f1d] leading-[1.1] text-center">
            Join Mystery Message
          </h1>
          <p className="mt-4 text-[15px] font-medium text-gray-700">
            Sign in to start your anonymous adventure
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Email / Username */}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-bold text-[#1a1a1a]">
                    Email/Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="email/username"
                      className="h-11 rounded-lg border border-gray-200 bg-white text-sm text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-400 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-500" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-bold text-[#1a1a1a]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password"
                      className="h-11 rounded-lg border border-gray-200 bg-white text-sm text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-400 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-500" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-1">
              <Button
                type="submit"
                className="h-10 rounded-md bg-[#0a0f1d] px-5 text-sm font-bold text-white hover:bg-[#151c33] transition-colors shadow-sm"
              >
                Signin
              </Button>
            </div>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm font-medium">
          <p className="text-gray-700">
            Already a member?{' '}
            <Link
              href="/sign-in"
              className="text-blue-600 hover:underline transition-all"
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
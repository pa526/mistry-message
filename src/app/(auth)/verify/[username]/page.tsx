'use client'
import { toast } from 'sonner'
import { useRouter, useParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import ApiResponse from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
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

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            });

            toast.success(response.data.message);
            router.replace('/sign-in')
        } catch(error) {
            console.error('Error in verification of user', error)
            const axiosError = error as AxiosError<ApiResponse>
            
            toast.error(
                axiosError.response?.data.message ||
                'Error verifying account'
            )            
        } 
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4">
            <div className="w-full max-w-[420px] rounded-2xl bg-white p-10 shadow-sm border border-gray-100/50">

                {/* Heading */}
                <div className="mb-8 text-center">
                    <h1 className="text-[38px] font-black tracking-tight text-[#0a0f1d] leading-tight">
                        Verify Your Account
                    </h1>
                    <p className="mt-4 text-[15px] font-medium text-gray-600">
                        Enter the verification code sent to your email
                    </p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-[15px] font-bold text-[#1a1a1a] flex items-center gap-0.5">
                                        Verification Code
                                        <span className="text-red-500 font-bold">*</span>
                                    </FormLabel>
                                    
                                    <FormControl>
                                        <Input
                                            placeholder="code"
                                            className="h-12 px-4 rounded-xl border border-gray-200 bg-white text-base text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-400 transition-all"
                                            {...field}
                                        />
                                    </FormControl>
                                    
                                    <FormMessage className="text-xs font-medium text-red-500" />
                                </FormItem>
                            )}
                        />

                        <Button 
                            type="submit" 
                            className="h-11 px-6 rounded-lg bg-[#0f141c] hover:bg-[#18202c] text-white font-semibold text-sm transition-colors shadow-sm"
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount
'use client'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

const Page = () => {

    const param = useParams<{ username: string }>()
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (data: any) => {
        try {
            const result = await axios.post<ApiResponse>(`/api/reset-password`, {
                username: param.username,
                password: data.password,
                confirmPassword: data.confirmPassword
            })
            toast({
                title: 'Success',
                description: result.data.message
            });
            router.replace(`/sign-in`)
        } catch (error) {
            console.log("Something went wrong", error)
            toast({
                title: 'Failed',
                description: "Error while resetting password",
                variant: 'destructive'
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h1 className="">Reset Your Password Here</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Reset</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page

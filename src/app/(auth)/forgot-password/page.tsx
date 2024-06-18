'use client'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm({
        defaultValues: {
            identifier: ''
        },
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const result = await axios.post(`/api/forgot-password`, {identifier: data.identifier})
            setIsSubmitting(false)
            if(result.data.success) {
                toast({
                    title: 'Success',
                    description: result.data.message
                });
                router.replace(`/verify2/${result.data.username}`)
            } else {
                toast({
                    title: 'Failed',
                    description: result.data.message
                });
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            ('There was a problem with your sign-up. Please try again.');
            toast({
                title: 'Somethig went wrong',
                description: errorMessage,
                variant: 'destructive',
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-800'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter Your Username or Email</FormLabel>
                                    <Input type="text" {...field} name="identifier" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page

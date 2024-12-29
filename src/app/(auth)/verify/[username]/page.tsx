'use client'


import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import * as Z from 'zod'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const VerifyAccount= () => {

    const router = useRouter()
    const params = useParams<{username: string}>()
    const {toast} = useToast();

    const form = useForm<Z.infer<typeof verifySchema>>({  //providing type here but it is completely optional.  "<z.infer<typeof signUpSchema>>"
        resolver: zodResolver(verifySchema),
       
      })

      const onSubmit = async (data: Z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`,{
                username: params.username,
                code: data.code
            })
//added the if statement
            if(response.data.success){
              toast({
                  title: "Success",
                  description: "response.data.message"
              })
            }

            router.push('/sign-in')
        } catch (error) {
              console.error("Error in signup of user", error)
              const axiosError = error as AxiosError<ApiResponse>
              const errorMessage = axiosError.response?.data.message;
              toast({
                title:"signup failed",
                description: errorMessage,
                variant: "destructive"
              })
            } 
      }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb-4">Enter Your Verifiication Code To Your Email.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input placeholder="code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    </div>
  )
}



export default VerifyAccount;

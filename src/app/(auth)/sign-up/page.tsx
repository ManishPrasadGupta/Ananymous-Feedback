'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm  } from "react-hook-form"
import * as z  from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'



function Signup() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername ] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 300)
  const { toast } = useToast();
  const router = useRouter() // useRouter use karna hain kyuki user ko yaha se waha toh bhejna hi hain aur yeh `navigation` wala use krna hain

  //ZOD implementation
  const form = useForm<z.infer<typeof signUpSchema>>({  //providing type here but it is completely optional.  "<z.infer<typeof signUpSchema>>"
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if(username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const AxiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            AxiosError.response?.data.message ?? "Error checking username"
          )
        }finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
     const response =  await axios.post<ApiResponse>('/api/sign-up', data)
     toast({
      title: 'success',
      description: response.data.message
     })
     router.replace(`/verify/${username}`)
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message;
      toast({
        title:"signup failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally{
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader2
                    className='animate-spin' />}
                    <p className={`text-sm ${usernameMessage === "username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                      test {usernameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
            />

            <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />

            <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="password" {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />
         
            <Button className='w-full' type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait
                </>
              ) : ('Sign Up')
              }
            </Button>
            

          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a menber?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;


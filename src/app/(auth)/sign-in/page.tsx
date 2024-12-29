'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm  } from "react-hook-form"
import * as z  from "zod"
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'
import { Loader2 } from "lucide-react"
import { useState } from "react"



function Signin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter() // useRouter use karna hain kyuki user ko yaha se waha toh bhejna hi hain aur yeh `navigation` wala use krna hain
  
  //ZOD implementation
  const form = useForm<z.infer<typeof signInSchema>>({  //providing type here but it is completely optional.  "<z.infer<typeof signUpSchema>>"
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    },
  })
  
  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    //signIn -> nextauth se kar rahe toh jaise `signup` kiya waisa toh karne hi nahi hain....

    const result = await signIn('credentials', { 
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    } )
    if(result?.error){
      toast({
        title: "Login failed",
        description: "Incorrect username or password:",
        variant: "destructive"
      })
    } else{
      toast({
        title: 'Login Successful',

        variant: "default" 
      })
      setIsSubmitting(true);
    }
    
    if(result?.url){
      router.replace('/user_dashboard')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >


            <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input placeholder="email/Username" {...field}
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
         
            {/* <Button className='w-full' type="submit" >
            Sign In
            </Button> */}

            <Button className='w-full' type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait
                </>
              ) : ('Sign In')
              }
            </Button>
            
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet??{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;


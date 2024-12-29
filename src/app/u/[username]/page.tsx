"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,

} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import axios, { AxiosError } from "axios"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { messageSchema } from "@/schemas/messageSchema"
import {toast} from "@/hooks/use-toast"
import { ApiResponse } from "@/types/ApiResponse"
import { Separator } from "@radix-ui/react-separator"
import Link from "next/link"

 
const SendMessage= () => {
  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  const messageContent = form.watch("content")
  const params = useParams<{username: string}>();
  const username = params.username;
  
  if (!username) {
    console.error("Username is undefined");
    return null;
  }
  

  const onMessageSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      if(response.data.success){
        toast({
          title: "success",
          description: response.data.message,
        })
        
        form.reset( {...form.getValues(), content: ''});
      }
    } catch (error:any) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'error',
          description: axiosError.response?.data.message ?? "Failed to send message",
          variant: 'destructive',
        });
        } finally {
          setIsLoading(false);
      }
    }

    return (
      <div className="container mx-auto my-8 p-6 rounded max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Public Profile Link
        </h1>
          <div className="flex justify-center">
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onMessageSubmit)} 
                className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Send Ananymous Feedback to @{username}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  {isLoading ? (
                    <Button disabled >
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading || !messageContent}>
                     Send It
                    </Button>)
                  }
                </div>
              </form>
            </Form>
          </div>
          <Separator className="my-6" />
          <div className="text-center">
          <div className="mb-4">Get Your Message Board</div>
            <Link href={'/sign-up'}>
              <Button>Create Your Account</Button>
            </Link>
          </div>
      </div>
    )
}


export default SendMessage;
'use client'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"


  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User.model"
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import dayjs from "dayjs"
  
type MessageCardProps = {
    username: string; //changed
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onMessageDelete }) => {  //here add message.

    const { toast } = useToast();

//confirm delete message.    
    const handleDeleteConfirm = async () => {
        
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            if(response.status !== 200){
                toast({
                    title: 'Error',
                    description: 'Failed to delete message',
                    variant: 'destructive'
                })
                return;
            }
            toast({
                title: response.data.message,
            });
            onMessageDelete(message._id as string);

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
              title: 'Error',
              description:
                axiosError.response?.data.message ?? 'Failed to delete message',
              variant: 'destructive',
            });
            
        }
    }

    return (
        <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent/>
    </Card>
    )
}

export default MessageCard

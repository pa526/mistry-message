'use client'

import { Message } from "@/models/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import ApiResponse from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {toast} from 'sonner'


function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId))
  }

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })

  const {register, watch, setValue} = form;

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response =await axios.get('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch(error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to fetch accept message status')
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback (async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh) {
        toast.success('Showing latest messages')
      }
      
    } catch(error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to fetch accept message status')
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setMessages])

   //handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast.success('Updated accept message status')
    } catch(error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to fetch accept message status')
    }
  }

  

  useEffect(() => {
    if(!session || !session.user) return;
    fetchMessages()
    fetchAcceptMessage()

  }, [session, setValue, fetchAcceptMessage, fetchMessages])


  if(!session || !session.user) {
    return <div>Please sign in to view your dashboard</div>
  }

  return (
    <div>Dashboard</div>
  )
}

export default Page
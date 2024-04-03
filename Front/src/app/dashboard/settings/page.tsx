"use client"
import React, {useEffect} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSelector, useDispatch } from 'react-redux'
import { setChannelId, setTokenId } from "../../redux/slice/dataSlice"
import { toast } from "sonner"

const FormSchema = z.object({
  tokenId: z.string(),
  channeId: z.string().min(1)
})

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tokenId: '',
      channeId: ''
    },
  })

    const dispatch = useDispatch()
    const onSubmit = (data: z.infer<typeof FormSchema>) => {
      dispatch(setTokenId(data.tokenId))
      dispatch(setChannelId(data.channeId))
      toast.success('New settings saved !')
    }

    const tokenId = useSelector((state: any) => state.data.tokenId)
    const channelId = useSelector((state: any) => state.data.channelId)

    
    useEffect(() => {
      form.setValue('tokenId', tokenId)
      form.setValue('channeId', channelId)
    }, [tokenId, channelId, form])
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="tokenId"
          render={({ field }) => (
            <FormItem>
              <FormMessage />
              <FormLabel>Channel ID</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Token Discord Id" {...field} />
              </FormControl>
              <FormDescription>
                This is your channel ID
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="channeId"
          render={({ field }) => (
            <FormItem>
              <FormMessage />
              <FormLabel>Token ID</FormLabel>
              <FormControl>
                <Input placeholder="Channel Discord Id" {...field} />
              </FormControl>
              <FormDescription>
                This is your token ID
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}/>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

const PageSettings: React.FC = () => {
    return (
        <div className="flex h-full items-center justify-center">
            <InputForm />
        </div>
    );
};

export default PageSettings;
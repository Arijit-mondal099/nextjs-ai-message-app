"use client";

import CopyLink from "@/components/common/CopyLink";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  acceptMsgSchema,
  AcceptMsgSchemaData,
} from "@/schemas/acceptMessage.schema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { RefreshCcw, Trash2 } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Message = {
  _id: string,
  content: string,
  createdAt: Date
}

export default function Dashboard() {
  const [isAcceptMessage, setIsAcceptMessage] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter()

  const { register, watch, setValue } = useForm<AcceptMsgSchemaData>({
    resolver: zodResolver(acceptMsgSchema),
  });
  const acceptMessage = watch("acceptMessage")

  const fetchMessages = useCallback(async function () {
    try {
      setIsLoading(true)
      const { data } = await axios.get<ApiResponse<Message[]>>("/api/messages");
      if (data.success) {
        setMessages(data?.data ?? [])
      }
    } catch (error: unknown) {
      const msg = error instanceof AxiosError ? error.response?.data.message : "Something went wrong"
      toast.error(msg);
    } finally {
      setIsLoading(false)
    }
  }, []);

  const getMessageAcceptStatus = useCallback(async function () {
    try {
      const { data } = await axios.get<ApiResponse<{ isAcceptingMessage: boolean }>>("/api/messages/accept-messages");
      if (data.success && data?.data) {
        setValue("acceptMessage", data.data?.isAcceptingMessage)
        setIsAcceptMessage(data.data?.isAcceptingMessage)
      }
    } catch (error) {
      const msg = error instanceof AxiosError ? error.response?.data.message : "Something went wrong"
      toast.error(msg);
    }
  }, [setValue]);

  const toggleAcceptMessageStatus = useCallback(async function () {
    try {
      await axios.patch<ApiResponse<undefined>>("/api/messages/accept-messages", { acceptMessage: !isAcceptMessage });
      setValue("acceptMessage", !isAcceptMessage)
      setIsAcceptMessage(!isAcceptMessage)
    } catch (error: unknown) {
      const msg = error instanceof AxiosError ? error.response?.data.message : "Something went wrong"
      toast.error(msg);
    }
  }, [isAcceptMessage, setValue]);

  const handleDeleteMessage = useCallback(async function (msgId: string) {
    try {
      setMessages(messages.filter(m => m._id !== msgId))
      await axios.delete(`/api/messages/delete-message/${msgId}`)
    } catch (error: unknown) {
      const msg = error instanceof AxiosError ? error.response?.data.message : "Something went wrong"
      toast.error(msg);
    }
  }, [messages])

  useEffect(() => {
    if (!session || !session?.user) {
      return router.replace("/sign-in")
    }

    fetchMessages()
    getMessageAcceptStatus()
  }, [fetchMessages, getMessageAcceptStatus, session, router]);

  return (
    <div className="min-h-dvh w-full pt-24">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold">User Dashboard</h1>
          </div>

          <div className="space-y-2">
            <h2>Copy your public link</h2>
            <div>
              <CopyLink
                link={`${process.env.NEXT_PUBLIC_APP_URL}/u/${user?.username}`}
              />
            </div>
          </div>


            <div className="flex items-center gap-2">
              <Switch 
                { ...register("acceptMessage") }
                checked={acceptMessage}
                onCheckedChange={toggleAcceptMessageStatus}
                disabled={isLoading}
              />

              <Label htmlFor="acceptMessage">
                <span>Accept Message</span> :{" "}
                <span>{isAcceptMessage ? "On" : "Off"}</span>
              </Label>
            </div>
        </div>

        <div className="w-full h-0.5 bg-gray-100 my-10" />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Feedback Messages</h2>

            <Button
              onClick={() => fetchMessages()}
            >
              <RefreshCcw className={`${isLoading && "animate-spin"}`} />
            </Button>
          </div>

          <div className="w-full grid md:grid-cols-2 gap-4">
            {messages.length ? (
              messages.map(m => (
                <Card key={m._id}>
                  <CardContent>
                    <CardTitle>
                      <div className="flex items-center justify-between">
                        <h2>Feedback message</h2>
                        <Button 
                          variant={"destructive"} 
                          size={"sm"}
                          onClick={() => handleDeleteMessage(m._id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </CardTitle>

                    <CardDescription>
                      <p>{m.content}</p>
                    </CardDescription>
                  </CardContent>

                  <CardFooter>
                    <p>{new Date(m.createdAt).toLocaleDateString()}</p>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>Opps look like you haven&apos;t got any feedback message yet!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

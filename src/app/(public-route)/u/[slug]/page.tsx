"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema, MessageSchemaData } from "@/schemas/message.schema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, Send } from "lucide-react";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Params = {
  params: Promise<{ slug: string }>;
};

export default function Messages({ params }: Params) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { slug } = use(params);

  const form = useForm<MessageSchemaData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(formData: MessageSchemaData) {
    try {
      setIsLoading(true);

      const payload = {
        username: slug,
        message: formData.content,
      };

      const { data } = await axios.post<ApiResponse<undefined>>(
        "/api/messages",
        payload,
      );
      if (data.success) {
        toast.success(data.message);
        form.reset();
      }
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data.message
          : "Something went wrong try again later";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-dvh w-full">
      <div className="container mx-auto py-20 px-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold">Send Feedback</h1>
        </div>

        <div>
          <Card>
            <CardContent>
              <form
                className="space-y-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <Label id="msg">Send your feedback to @{slug}</Label>
                <Textarea
                  {...form.register("content")}
                  id="msg"
                  placeholder="send your feedback"
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.content.message}
                  </p>
                )}

                <Button
                  disabled={isLoading}
                  type="submit"
                  size={"lg"}
                  className="cursor-pointer min-w-28"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span>Send</span> <Send />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

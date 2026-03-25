"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema, VerifySchemaData } from "@/schemas/verify.schema";
import { ApiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import { Controller } from "react-hook-form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Params {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function VerifyAccount({ searchParams }: Params) {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const { q } = use(searchParams) as { q: string };
  const router = useRouter();
  const form = useForm<VerifySchemaData>({
    resolver: zodResolver(verifySchema),
  });

  async function onSubmit(formData: VerifySchemaData) {
    setIsSubmiting(true);

    console.log("hii")
    try {
      const { data } = await axios.post<ApiResponse<undefined>>(
        "/api/auth/verify-email",
        formData,
      );
      if (data.success) {
        toast.success(data.message);
        router.replace("/sign-in");
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Something went wrong!",
      );
    } finally {
      setIsSubmiting(false);
    }
  }

  useEffect(() => {
    if (!q?.trim()) router.back();
    form.setValue("username", q);
  }, [router, q, form]);

  return (
    <div className="min-h-dvh w-full flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl">Verify Your Account</h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col items-center gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Controller
              control={form.control}
              name="token"
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />

            <Button type="submit" className="w-28 cursor-pointer">
              {isSubmiting ? <Loader2 className="animate-spin" /> : "Verify"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

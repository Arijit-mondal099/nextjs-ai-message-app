"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupData, signupSchema } from "@/schemas/signup.schema";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignUp() {
  const [username, setUsername] = useState<string>("");
  const debounced = useDebounceCallback(setUsername, 500);
  const [error, setError] = useState<string>("");
  const [usernameChecking, setUsernameChecking] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const router = useRouter()

  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(formData: SignupData) {
    setIsSubmiting(true);

    try {
        const { data } = await axios.post<ApiResponse<undefined>>("/api/auth/sign-up", formData)
        if (data.success) router.replace(`/verify-account?q=${formData.username}`)
    } catch (error: unknown) {
      const msg = error instanceof AxiosError ? error.response?.data.message : "Something went wrong please try again later";
      toast.error(msg)
    } finally {
      setIsSubmiting(false);
    }
  }

  useEffect(() => {
    async function checkIsUsernameUnique() {
      if (!username) return;
      setUsernameChecking(true);
      setError("");

      try {
        const { data } = await axios.get<ApiResponse<undefined>>(
          `/api/users/check-username-unique?q=${username}`,
        );

        if (!data.success) setError(data.message);
      } catch (err: unknown) {
        const errMsg =
          err instanceof AxiosError
            ? err.response?.data.message
            : "Oops invalid username try another!";
        setError(errMsg);
      } finally {
        setUsernameChecking(false);
      }
    }

    checkIsUsernameUnique();
  }, [username]);

  return (
    <div className="min-h-dvh w-full flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl">Signup your account</h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label>Username</Label>
              <Input
                {...form.register("username", {
                  onChange: (e) => debounced(e.target.value),
                })}
                type="text"
                placeholder="username"
              />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.username.message}
                </p>
              )}
              {usernameChecking && <Loader2 className="h-3 w-3 animate-spin" />}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                {...form.register("email")}
                type="email"
                placeholder="email"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                {...form.register("password")}
                type="password"
                placeholder="password"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmiting || usernameChecking}
            >
              {isSubmiting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p>
            Alredy have an account then{" "}
            <Link href="/sign-in" className="text-blue-500 underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

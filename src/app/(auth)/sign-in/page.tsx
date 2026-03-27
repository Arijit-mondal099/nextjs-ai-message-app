"use client";

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
import { signinSchema, SignInSchemaData } from "@/schemas/signin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignIn() {
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<SignInSchemaData>({
    resolver: zodResolver(signinSchema),
  });

  async function onSubmit(formData: SignInSchemaData) {
    setIsSubmiting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: formData.indentifier,
        password: formData.password,
      });

      if (result?.error) {
        toast.error("Oops invalid credentials");
      } else {
        toast.success("Signin successfully");
        router.replace("/dashboard");
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong please try again later",
      );
    } finally {
      setIsSubmiting(false);
    }
  }

  return (
    <div className="min-h-dvh w-full flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl">Signin your account</h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label>Email or Username</Label>
              <Input
                {...form.register("indentifier")}
                type="text"
                placeholder="email or username"
              />
              {form.formState.errors.indentifier && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.indentifier.message}
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
              disabled={isSubmiting}
            >
              {isSubmiting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p>
            Don&apos;t have an account then{" "}
            <Link href="/sign-up" className="text-blue-500 underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

"use client"

import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";


export default function Home() {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <div className="min-h-dvh w-full flex items-center justify-center gap-8">
      <div className="max-w-7xl w-full h-auto mx-auto px-4 py-6 text-center">
        <h1 className="text-5xl font-bold">Well Come to Home Page</h1>

        <div className="mt-10 space-x-4">
          <Link href="/dashboard">
            <Button size={"lg"} variant={"secondary"} className="cursor-pointer">
              Dashboard
            </Button>
          </Link>
          <Link href={`/u/${user?.username}`}>
            <Button size={"lg"} className="cursor-pointer">
              Messages
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

"use client";

import { User } from "next-auth";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="fixed top-0 left-0 w-full z-999 border-b bg-white border-gray-200 shadow">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="font-semibold text-lg">
          <Link href="/">Message</Link>
        </h1>

        {user ? (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{user?.username}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="p-2 w-40">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/dashboard"
                          className="block px-3 py-2 rounded hover:bg-accent text-sm"
                        >
                          Dashboard
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3 text-sm"
                        onClick={() => signOut()}
                      >
                        Sign Out
                      </Button>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <Link href="/sign-in">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

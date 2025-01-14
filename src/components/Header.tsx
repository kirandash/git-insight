"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
};

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Features", href: "/#features" },
    { name: "How it works", href: "/#how-it-works" },
    { name: "App", href: "/dashboard" },
    { name: "Send request", href: "/playground" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-semibold text-white flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              GI
            </div>
            Git Insight
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm ${
                  pathname === item.href
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Button
                variant="ghost"
                className="text-gray-400 hover:bg-gray-800 hover:text-white"
                onClick={() => signIn("google")}
              >
                Sign in
              </Button>
              <Button
                onClick={() => signIn("google")}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign up
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? ""}
                      className="rounded-full"
                      fill
                    />
                  ) : (
                    <span className="text-white">
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex-col items-start">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
}

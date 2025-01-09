"use client";

import { Button } from "@/components/ui/button";
import { Github, Mail, Moon, Twitter } from "lucide-react";
import Image from "next/image";

export function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <select className="bg-transparent text-sm">
            <option>Personal</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Github className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mail className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Moon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  FileCode2,
  LayoutDashboard,
  Receipt,
  Terminal,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "./SignOutButton";

type SidebarLink = {
  title: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
};

const links: SidebarLink[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  // {
  //   title: "Research Assistant",
  //   href: "/assistant",
  //   icon: <MessageSquare className="h-4 w-4" />,
  // },
  // {
  //   title: "Research Reports",
  //   href: "/reports",
  //   icon: <FileText className="h-4 w-4" />,
  // },
  {
    title: "API Playground",
    href: "/playground",
    icon: <Terminal className="h-4 w-4" />,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: <Receipt className="h-4 w-4" />,
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: <FileCode2 className="h-4 w-4" />,
    external: true,
  },
];

type SidebarProps = {
  onClose?: () => void;
};

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-60 p-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="font-semibold text-xl">Git Insight</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onClose}
          aria-label="Close Sidebar"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-1 flex-1">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === link.href
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
                {...(link.external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {link.icon}
                <span>{link.title}</span>
                {link.external && <ExternalLink className="h-3 w-3 ml-auto" />}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <SignOutButton />
    </div>
  );
}

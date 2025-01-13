"use client";

import { cn } from "@/lib/utils";
import {
  ExternalLink,
  FileCode2,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Receipt,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  {
    title: "Research Assistant",
    href: "/dashboard/assistant",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    title: "Research Reports",
    href: "/dashboard/reports",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "API Playground",
    href: "/dashboard/playground",
    icon: <Terminal className="h-4 w-4" />,
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: <Receipt className="h-4 w-4" />,
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: <FileCode2 className="h-4 w-4" />,
    external: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-6 w-60 p-4">
      <div className="flex items-center gap-2 px-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <span className="font-semibold text-xl">Git Insight</span>
      </div>

      <div className="space-y-1">
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
    </div>
  );
}

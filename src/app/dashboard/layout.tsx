"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Hide sidebar by default on mobile
    const isMobile = window.innerWidth < 768;
    setShowSidebar(!isMobile);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn(
      "flex h-screen transition-all duration-300 ease-in-out",
      showSidebar ? "md:pl-60" : "pl-0"
    )}>
      {/* Overlay for mobile */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-background z-40 transition-transform duration-300 ease-in-out",
          showSidebar ? "translate-x-0" : "-translate-x-full",
          "w-60" // Fixed width
        )}
      >
        <Sidebar onClose={() => setShowSidebar(false)} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full">
        {/* Header with toggle button */}
        <div className="sticky top-0 z-20 border-b bg-background p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            className="hover:bg-secondary"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

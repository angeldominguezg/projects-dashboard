"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-40 w-72 -translate-x-full border-r bg-background transition-transform md:translate-x-0",
          isSidebarOpen && "translate-x-0"
        )}
      >
        <Sidebar className="w-full" />
      </div>

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all",
        isSidebarOpen ? "md:ml-72" : ""
      )}>
        <div className="container p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

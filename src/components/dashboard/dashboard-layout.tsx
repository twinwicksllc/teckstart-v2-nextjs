"use client";

import { ReactNode } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  user: {
    id: number;
    email: string;
    name: string;
    role: "user" | "admin";
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background, #ededf4)" }}>
      <div className="flex min-h-screen">
        {/* Sidebar (fixed) */}
        <DashboardSidebar user={user} />
        {/* Main Content */}
        <div className="flex-1 min-h-screen pl-64">
          {children}
        </div>
      </div>
    </div>
  );
}

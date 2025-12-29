"use client";

import { ReactNode } from "react";
import { memo } from "react";
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

const DashboardLayoutComponent = ({ children, user }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar user={user} />
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
};

export const DashboardLayout = memo(DashboardLayoutComponent);

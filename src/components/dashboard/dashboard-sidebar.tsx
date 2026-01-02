"use client"

import { LayoutDashboard, Receipt, BarChart3, FileText, Settings, LogOut } from "lucide-react"
import Image from "next/image"

interface User {
  id: number
  email: string
  name: string
  role: "user" | "admin"
}

interface DashboardSidebarProps {
  user: User
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Receipt, label: "Expenses", href: "/expenses" },
    { icon: FileText, label: "Projects", href: "/projects" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo Section */}
      <div className="flex items-center justify-center px-6 py-6 border-b border-sidebar-border bg-[#EDEDF4]">
        <Image
          src="/teckstart-logo.png"
          alt="Teckstart Logo"
          width={180}
          height={60}
          className="object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.href}
              onClick={() => (window.location.href = item.href)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sm font-semibold text-sidebar-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs opacity-70 truncate">{user.email}</p>
          </div>
        </div>
        <button
          className="w-full justify-start mt-2 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors flex items-center gap-3"
          onClick={() => (window.location.href = "/logout")}
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}

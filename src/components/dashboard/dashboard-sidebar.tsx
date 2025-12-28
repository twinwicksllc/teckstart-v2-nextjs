"use client"

import { LayoutDashboard, Receipt, BarChart3, FileText, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: Receipt, label: "Expenses", href: "/expenses" },
    { icon: FileText, label: "Projects", href: "/projects" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-64 flex flex-col" style={{ backgroundColor: "var(--sidebar-bg)" }}>
      {/* Logo Section */}
      <div
        className="flex items-center justify-center px-6 py-6 border-b"
        style={{ borderColor: "var(--sidebar-hover)" }}
      >
        <Image
          src="/images/teckstart-logo.png"
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
              style={{
                color: "var(--sidebar-text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--sidebar-hover)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t" style={{ borderColor: "var(--sidebar-hover)" }}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ color: "var(--sidebar-text)" }}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs opacity-70 truncate">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 mt-2"
          style={{ color: "var(--sidebar-text)" }}
          onClick={() => (window.location.href = "/logout")}
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  )
}
}

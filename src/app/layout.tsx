import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TeckStart - Freelance Business Management",
  description: "Comprehensive platform for managing your freelance business finances, expenses, projects, and invoicing with AI-powered features.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon-180x180.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      
      <body
        className={`${geist.className} ${geistMono.className} font-sans antialiased teckstart-body`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
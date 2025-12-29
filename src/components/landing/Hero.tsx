'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Play } from 'lucide-react'
import { Button } from './Button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-deep-space via-[#1a4d7a] to-deep-space">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(254, 179, 60, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ghost-white mb-6 leading-tight">
                Track Projects & Expenses with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-[#ffa500]">
                  AI-Powered Intelligence
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-ghost-white/80 mb-8 leading-relaxed"
            >
              Join thousands of freelancers who save 10+ hours weekly with automated receipt parsing and IRS-compliant expense tracking
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="ghost" size="lg" className="flex items-center gap-2">
                  <Play size={20} />
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6"
            >
              {['No Credit Card Required', '14-Day Free Trial', 'Cancel Anytime'].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-celadon" />
                  <span className="text-sm text-celadon">{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Dashboard Mockup */}
              <div className="bg-gradient-to-br from-ghost-white to-white rounded-2xl shadow-2xl p-8 transform perspective-1000 rotate-y-5">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-deep-space/10">
                    <div className="h-3 w-32 bg-deep-space/20 rounded"></div>
                    <div className="h-3 w-20 bg-orange/30 rounded"></div>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-orange/10 to-orange/5 p-4 rounded-xl">
                      <div className="h-2 w-16 bg-orange/30 rounded mb-2"></div>
                      <div className="h-6 w-24 bg-orange/40 rounded"></div>
                    </div>
                    <div className="bg-gradient-to-br from-medium-jungle/10 to-medium-jungle/5 p-4 rounded-xl">
                      <div className="h-2 w-16 bg-medium-jungle/30 rounded mb-2"></div>
                      <div className="h-6 w-24 bg-medium-jungle/40 rounded"></div>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="bg-gradient-to-br from-deep-space/5 to-deep-space/10 p-6 rounded-xl">
                    <div className="flex items-end justify-between h-32 gap-2">
                      {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-orange to-orange/50 rounded-t"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* List Items */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-ghost-white/50 rounded-lg">
                        <div className="h-8 w-8 bg-deep-space/10 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-2 w-32 bg-deep-space/20 rounded mb-1"></div>
                          <div className="h-2 w-20 bg-deep-space/10 rounded"></div>
                        </div>
                        <div className="h-2 w-16 bg-medium-jungle/30 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 w-48"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 bg-gradient-to-br from-orange to-[#ffa500] rounded-lg"></div>
                  <div>
                    <div className="h-2 w-20 bg-deep-space/20 rounded mb-1"></div>
                    <div className="h-2 w-16 bg-deep-space/10 rounded"></div>
                  </div>
                </div>
                <div className="h-1 w-full bg-medium-jungle/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-medium-jungle rounded-full"></div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 w-40"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="h-2 w-16 bg-deep-space/20 rounded"></div>
                  <div className="h-6 w-6 bg-cherry-rose/20 rounded-full"></div>
                </div>
                <div className="h-8 w-full bg-gradient-to-r from-cherry-rose/10 to-cherry-rose/5 rounded"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#EDEDF4"
          />
        </svg>
      </div>
    </section>
  )
}
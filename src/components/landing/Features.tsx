'use client'

import { motion } from 'framer-motion'
import { FolderKanban, Receipt, Sparkles, BarChart3, Smartphone, Puzzle } from 'lucide-react'

const features = [
  {
    icon: FolderKanban,
    title: 'Project Tracking',
    description: 'Track budgets, timelines, and client information in one centralized dashboard',
    points: [
      'Real-time budget tracking',
      'Client management',
      'Status monitoring',
      'Automated reports'
    ],
    gradient: 'from-orange to-[#ffa500]',
    size: 'large'
  },
  {
    icon: Receipt,
    title: 'Expense Management',
    description: 'Upload receipts and let AI automatically parse and categorize expenses',
    points: [
      'AI-powered receipt parsing',
      'IRS Schedule C categories',
      'Tax optimization',
      'Bulk upload support'
    ],
    gradient: 'from-medium-jungle to-[#2d7a30]',
    size: 'large'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Automation',
    description: 'AWS Bedrock AI learns your vendors and automates categorization',
    points: [
      'Vendor template caching',
      'Auto-categorization',
      'Tax compliance checking'
    ],
    gradient: 'from-cherry-rose to-[#8f1635]',
    size: 'medium'
  },
  {
    icon: BarChart3,
    title: 'Reporting & Analytics',
    description: 'Comprehensive insights into your business performance',
    points: [
      'Visual dashboards',
      'Export to Excel/PDF',
      'Custom reports'
    ],
    gradient: 'from-deep-space to-[#1a4d7a]',
    size: 'medium'
  },
  {
    icon: Smartphone,
    title: 'Mobile Access',
    description: 'Manage your business on the go with our responsive design',
    points: [
      'Works on any device',
      'Offline support',
      'Real-time sync'
    ],
    gradient: 'from-orange to-[#ffa500]',
    size: 'medium'
  },
  {
    icon: Puzzle,
    title: 'Integrations',
    description: 'Connect with your favorite tools and services',
    points: [
      'QuickBooks sync',
      'Bank connections',
      'API access'
    ],
    gradient: 'from-medium-jungle to-[#2d7a30]',
    size: 'medium'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-ghost-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-deep-space mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed specifically for freelancers and small business owners
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isLarge = feature.size === 'large'
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`
                  bg-white rounded-3xl p-8 border border-deep-space/10 
                  shadow-[0_4px_20px_rgba(0,0,0,0.05)] 
                  hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] 
                  transition-all duration-300
                  ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}
                `}
              >
                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} 
                  flex items-center justify-center mb-6
                  shadow-lg
                `}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-deep-space mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Key Points */}
                <ul className="space-y-2">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-medium-jungle mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-slate-600">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
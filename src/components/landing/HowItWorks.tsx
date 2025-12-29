'use client'

import { motion } from 'framer-motion'
import { UserPlus, Upload, Cpu, LineChart } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Sign Up',
    description: 'Create your free account in under 60 seconds. No credit card required.'
  },
  {
    icon: Upload,
    number: '02',
    title: 'Upload Receipts',
    description: 'Snap photos or upload digital receipts. Bulk upload supported.'
  },
  {
    icon: Cpu,
    number: '03',
    title: 'AI Processes',
    description: 'Our AI extracts data, categorizes expenses, and learns your patterns.'
  },
  {
    icon: LineChart,
    number: '04',
    title: 'Track & Report',
    description: 'View insights, generate reports, and maximize your tax deductions.'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-b from-ghost-white to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-deep-space mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get started in minutes with our simple 4-step process
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-celadon via-medium-jungle to-celadon transform -translate-y-1/2 z-0" />

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon
              
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                    {/* Step Number Circle */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange to-[#ffa500] flex items-center justify-center shadow-lg">
                        <span className="text-deep-space font-bold text-lg">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-6 mt-8">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-deep-space/10 to-deep-space/5 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-deep-space" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-deep-space mb-3 text-center">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow - Mobile/Tablet */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <svg
                        className="w-6 h-6 text-celadon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-slate-600 mb-6">
            Ready to streamline your freelance business?
          </p>
          <a href="/register">
            <button className="px-8 py-4 bg-gradient-to-r from-orange to-[#ffa500] text-deep-space font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-[0_10px_30px_rgba(254,179,60,0.3)]">
              Get Started Free
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
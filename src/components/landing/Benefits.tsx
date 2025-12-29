'use client'

import { motion } from 'framer-motion'
import { Clock, DollarSign, Shield } from 'lucide-react'

const benefits = [
  {
    icon: Clock,
    number: '10+',
    unit: 'Hours',
    subtext: 'Saved per week on average',
    description: 'Automate expense tracking and focus on billable work',
    color: 'orange'
  },
  {
    icon: DollarSign,
    number: '$5,000+',
    unit: '',
    subtext: 'Average tax savings per year',
    description: 'Never miss a deductible expense with AI categorization',
    color: 'medium-jungle'
  },
  {
    icon: Shield,
    number: '100%',
    unit: '',
    subtext: 'IRS Schedule C compliant',
    description: 'Automated tax compliance checking and reporting',
    color: 'cherry-rose'
  }
]

export default function Benefits() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-deep-space mb-4">
            Why Freelancers Choose TeckStart
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real results from real users who transformed their business operations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            const colorClasses = {
              orange: 'text-orange bg-orange/10',
              'medium-jungle': 'text-medium-jungle bg-medium-jungle/10',
              'cherry-rose': 'text-cherry-rose bg-cherry-rose/10'
            }

            return (
              <motion.div
                key={benefit.subtext}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`
                    w-20 h-20 rounded-2xl ${colorClasses[benefit.color as keyof typeof colorClasses]}
                    flex items-center justify-center
                  `}>
                    <Icon className="w-10 h-10" />
                  </div>
                </div>

                {/* Number */}
                <div className={`
                  text-5xl lg:text-6xl font-extrabold mb-2
                  ${benefit.color === 'orange' ? 'text-orange' : ''}
                  ${benefit.color === 'medium-jungle' ? 'text-medium-jungle' : ''}
                  ${benefit.color === 'cherry-rose' ? 'text-cherry-rose' : ''}
                `}>
                  {benefit.number}
                </div>

                {/* Subtext */}
                <div className="text-slate-600 font-medium mb-4">
                  {benefit.subtext}
                </div>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-gradient-to-r from-ghost-white to-white rounded-3xl"
        >
          {[
            { value: '10,000+', label: 'Active Users' },
            { value: '1M+', label: 'Receipts Processed' },
            { value: '99.9%', label: 'Uptime' },
            { value: '4.9/5', label: 'User Rating' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-deep-space mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
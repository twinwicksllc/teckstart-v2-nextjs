'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Button } from './Button'
import Link from 'next/link'

export default function CTA() {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-gradient-to-r from-orange via-[#ffa500] to-orange relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(14, 45, 76, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-deep-space mb-6">
            Ready to Optimize Your Freelance Business?
          </h2>
          <p className="text-xl text-deep-space/80 mb-10 leading-relaxed">
            Join thousands of freelancers saving time and maximizing deductions with TeckStart
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Link href="/register">
              <Button
                variant="primary"
                size="lg"
                className="bg-deep-space text-ghost-white hover:bg-[#1a4d7a] shadow-[0_12px_40px_rgba(14,45,76,0.3)] text-xl px-12 py-5"
              >
                Start Your Free Trial
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-deep-space/70"
          >
            {['No credit card required', '14-day free trial', 'Cancel anytime'].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-deep-space" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>

          {/* Pricing Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-deep-space/10"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-deep-space mb-2">$19</div>
                <div className="text-deep-space/70 mb-4">per month</div>
                <div className="text-sm text-deep-space/60">Perfect for solo freelancers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-deep-space mb-2">$39</div>
                <div className="text-deep-space/70 mb-4">per month</div>
                <div className="text-sm text-deep-space/60">For growing businesses</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-deep-space mb-2">Custom</div>
                <div className="text-deep-space/70 mb-4">pricing</div>
                <div className="text-sm text-deep-space/60">Enterprise solutions</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
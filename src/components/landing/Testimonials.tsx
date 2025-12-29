'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: "TeckStart saved me 15 hours a month on expense tracking. The AI receipt parsing is incredibly accurate!",
    author: "Sarah Johnson",
    role: "Freelance Designer",
    rating: 5
  },
  {
    quote: "As a freelance consultant, staying IRS compliant was always stressful. TeckStart makes it effortless.",
    author: "Michael Chen",
    role: "Business Consultant",
    rating: 5
  },
  {
    quote: "The project tracking features help me stay on budget and deliver on time. Game changer!",
    author: "Emily Rodriguez",
    role: "Web Developer",
    rating: 5
  },
  {
    quote: "I've tried many expense trackers, but TeckStart's AI is on another level. It learns my vendors and categories perfectly.",
    author: "David Thompson",
    role: "Marketing Freelancer",
    rating: 5
  },
  {
    quote: "The mobile app is fantastic. I can snap receipts on the go and everything syncs instantly.",
    author: "Lisa Anderson",
    role: "Photographer",
    rating: 5
  },
  {
    quote: "TeckStart helped me find $3,000 in missed deductions last year. Worth every penny!",
    author: "James Wilson",
    role: "Software Engineer",
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-deep-space overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-ghost-white mb-4">
            Loved by Freelancers Everywhere
          </h2>
          <p className="text-xl text-ghost-white/80 max-w-2xl mx-auto">
            Join thousands of satisfied users who transformed their business
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative">
          {/* First Row - Scroll Left */}
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-6 mb-6"
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`row1-${index}`}
                className="flex-shrink-0 w-[400px] bg-white/10 backdrop-blur-md border border-ghost-white/20 rounded-2xl p-8"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange text-orange" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-ghost-white leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div>
                  <div className="font-semibold text-orange">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-ghost-white/70">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Second Row - Scroll Right */}
          <motion.div
            animate={{ x: [-1920, 0] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-6"
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`row2-${index}`}
                className="flex-shrink-0 w-[400px] bg-white/10 backdrop-blur-md border border-ghost-white/20 rounded-2xl p-8"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange text-orange" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-ghost-white leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div>
                  <div className="font-semibold text-orange">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-ghost-white/70">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-deep-space to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-deep-space to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
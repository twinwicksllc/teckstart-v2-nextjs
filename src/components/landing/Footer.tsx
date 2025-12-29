'use client'

import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Integrations', href: '#' },
    { name: 'Changelog', href: '#' },
    { name: 'Roadmap', href: '#' }
  ],
  resources: [
    { name: 'Blog', href: '#' },
    { name: 'Help Center', href: '#' },
    { name: 'API Docs', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Templates', href: '#' }
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' }
  ]
}

export default function Footer() {
  return (
    <footer className="bg-deep-space text-ghost-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange to-[#ffa500] rounded-lg flex items-center justify-center">
                <span className="text-deep-space font-bold text-xl">T</span>
              </div>
              <span className="text-ghost-white font-bold text-xl">TeckStart</span>
            </div>
            <p className="text-ghost-white/70 mb-6 leading-relaxed max-w-sm">
              AI-Powered Expense & Project Tracking for Freelancers. Save time, maximize deductions, and grow your business.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Facebook, href: '#' }
              ].map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-ghost-white/10 hover:bg-orange flex items-center justify-center transition-colors duration-200"
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-orange font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-ghost-white/80 hover:text-orange transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-orange font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-ghost-white/80 hover:text-orange transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-orange font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-ghost-white/80 hover:text-orange transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-orange/10 rounded-2xl p-8 mb-12 border border-ghost-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-12 h-12 text-orange mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-ghost-white/70 mb-6">
              Get the latest features, tips, and insights delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-ghost-white/20 text-ghost-white placeholder:text-ghost-white/50 focus:outline-none focus:ring-2 focus:ring-orange"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-orange text-deep-space font-semibold rounded-lg hover:bg-[#ffa500] transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-ghost-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-ghost-white/60 text-sm">
              © {new Date().getFullYear()} TeckStart. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-ghost-white/60 hover:text-orange transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-ghost-white/60 hover:text-orange transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-ghost-white/60 hover:text-orange transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
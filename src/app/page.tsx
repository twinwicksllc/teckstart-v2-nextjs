import Link from "next/link"
import styles from './landing.module.css'

export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-background ${styles.landingContainer}`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img alt="TeckStart logo" src="/teckstart-logo.png" className="h-24 w-24 rounded" />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#process"
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="/login"
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Video */}
        <div className={`absolute inset-0 z-0 ${styles.videoBackground}`}>
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.pexels.com/videos/854322/pictures/preview-0.jpg"
            className="h-full w-full object-cover"
          >
            <source src="https://videos.pexels.com/video-files/854322/854322-hd_1280_720_25fps.mp4" type="video/mp4" />
          </video>
          <div className={styles.videoOverlay} />
        </div>

        {/* Hero Content */}
        <div className={`container relative z-10 mx-auto px-6 py-24 md:py-32 ${styles.heroContent}`}>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl text-balance">
                Transform Your Freelance Business with AI-Powered Expense Tracking
              </h1>
              <p className="text-lg text-white/90 leading-relaxed text-pretty">
                Streamline expense management, automate receipt parsing, and maximize tax deductions with TeckStart&apos;s
                intelligent automation platform.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img alt="Dashboard mockup" src="/dashboard-example.jpg" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4 text-balance">
              Powerful Features for Freelancers
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything you need to manage expenses, track projects, and maximize tax deductions
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-[#AF1B3F]/10 p-4">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="#AF1B3F" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">AI Receipt Parsing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload receipts and let AI automatically extract data, categorize expenses, and identify tax deductions
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-[#AF1B3F]/10 p-4">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="#AF1B3F" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 3v18" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Project Tracking</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track time, expenses, and income by project. Generate detailed reports for clients and tax purposes
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-[#AF1B3F]/10 p-4">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="#AF1B3F" strokeWidth="2">
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Tax Optimization</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Maximize deductions with smart categorization and year-end tax planning recommendations
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-[#AF1B3F]/10 p-4">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="#AF1B3F" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 005 0" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monitor your financial health with live dashboards, profit/loss tracking, and cash flow insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4 text-balance">How It Works</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Get started in minutes with our simple 3-step process
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <div className="rounded-full bg-[#FEB33C]/10 p-4">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="#FEB33C" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Upload Receipts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Snap photos of receipts or upload digital copies
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <div className="rounded-full bg-[#FEB33C]/10 p-4">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="#FEB33C" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">AI Processing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our AI extracts data and categorizes automatically
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <div className="rounded-full bg-[#FEB33C]/10 p-4">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="#FEB33C" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Track & Save</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monitor expenses and maximize tax deductions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#0E2D4C] text-white">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-4xl font-bold md:text-5xl">1,000+</h3>
              <p className="text-sm text-white/80">Active Users</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-4xl font-bold md:text-5xl">10,000+</h3>
              <p className="text-sm text-white/80">Receipts Processed</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-4xl font-bold md:text-5xl">99.9%</h3>
              <p className="text-sm text-white/80">Uptime</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-4xl font-bold md:text-5xl">4.9/5</h3>
              <p className="text-sm text-white/80">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4 text-balance">
              Ready to Transform Your Freelance Business?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Join thousands of freelancers who are saving time and money with TeckStart
            </p>
            <div className="flex flex-col gap-4 items-center">
              <div className="flex w-full max-w-md gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-full border border-border bg-background px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  Start Free Trial
                </Link>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>✓ No credit card required</span>
                <span>✓ 14-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#0E2D4C]/20 bg-[#0E2D4C] py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-xl font-bold text-[#EDEDF4]">
                TeckStart
              </Link>
              <p className="text-sm text-[#EDEDF4]/80 leading-relaxed">
                AI-powered freelance expense and project tracking with smart receipt parsing.
              </p>
              <div className="flex gap-4">
                <span className="text-[#EDEDF4]/80 hover:text-[#EDEDF4] transition-colors cursor-not-allowed">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </span>
                <span className="text-[#EDEDF4]/80 hover:text-[#EDEDF4] transition-colors cursor-not-allowed">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </span>
                <span className="text-[#EDEDF4]/80 hover:text-[#EDEDF4] transition-colors cursor-not-allowed">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-[#EDEDF4]">Product</h3>
              <div className="flex flex-col gap-3 text-sm">
                <Link href="#features" className="text-[#EDEDF4]/80 hover:text-[#EDEDF4] transition-colors">
                  Features
                </Link>
                <Link href="#process" className="text-[#EDEDF4]/80 hover:text-[#EDEDF4] transition-colors">
                  How it Works
                </Link>
                <span className="text-[#EDEDF4]/80 cursor-not-allowed">
                  Pricing
                </span>
                <span className="text-[#EDEDF4]/80 cursor-not-allowed">
                  Integrations
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-[#EDEDF4]">Company</h3>
              <div className="flex flex-col gap-3 text-sm">
                <span className="text-[#EDEDF4]/80 cursor-not-allowed">
                  About
                </span>
                <span className="text-[#EDEDF4]/80 cursor-not-allowed">
                  Blog
                </span>
                <span className="text-[#EDEDF4]/80 cursor-not-allowed">
                  Careers
                </span>
                <span className="text-[#EDEDF4]/80 cursor-not-allowed">
                  Contact
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-[#EDEDF4]">Support</h3>
              <div className="flex flex-col gap-3 text-sm">
                <span className="text-[#EDEDF4]/80 cursor-not-allowed">
                  Help Center
                </span>
                <span className="text-[#EDEDF4]/80 cursor-not-allowed">
                  Privacy Policy
                </span>
                <span className="text-[#EDEDF4]/80 cursor-not-allowed">
                  Terms of Service
                </span>
                <span className="text-[#EDEDF4]/80 cursor-not-allowed">
                  Status
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-[#EDEDF4]/20 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-[#EDEDF4]/80">
              <div className="h-2 w-2 rounded-full bg-[#3A9D3D]" />
              <span>All systems operational</span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-[#EDEDF4]/80">
              <span className="cursor-not-allowed">
                Privacy
              </span>
              <span className="cursor-not-allowed">
                Terms
              </span>
              <span>© 2025 TeckStart. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
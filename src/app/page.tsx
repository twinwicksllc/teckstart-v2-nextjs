import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, DollarSign, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"

// Cache busting - v0 landing page design
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container relative mx-auto px-4 py-12 md:py-20 lg:py-5">
        <div className="mx-auto max-w-7xl">
          {/* Announcement Badge */}
          <div className="mb-8 flex justify-center md:mb-12">
            <Badge
              variant="secondary"
              className="border-primary/20 bg-primary/5 px-4 py-2 text-primary transition-all hover:border-primary/40 hover:bg-primary/10 text-2xl"
            >
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
              AI-Powered Receipt Parsing Now Available
            </Badge>
          </div>

          {/* Hero Content - Asymmetric Grid */}
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Main Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-balance font-bold text-5xl tracking-tight text-foreground md:text-6xl lg:text-7xl">
                  TeckStart
                </h1>
                <p className="max-w-xl text-balance text-muted-foreground text-xl leading-relaxed md:text-2xl">
                  Freelance Expense & Project Tracker with AI-Powered Receipt Parsing
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="group bg-primary text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 bg-transparent transition-all hover:scale-105 hover:border-primary hover:bg-primary/5"
                >
                  View Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>Free 14-day trial</span>
                </div>
              </div>
            </div>

            {/* Right Column - Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-2 border-primary/20 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="font-bold text-4xl text-primary">$50K+</CardTitle>
                  <CardDescription className="text-foreground">Average tax savings per year</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-accent/20 bg-accent/5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="font-bold text-4xl text-accent">98%</CardTitle>
                  <CardDescription className="text-foreground">Receipt parsing accuracy</CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-muted transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="font-bold text-4xl text-foreground">5,000+</CardTitle>
                  <CardDescription className="text-foreground">
                    Freelancers optimizing their business finances
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 md:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Features
            </Badge>
            <h2 className="mb-4 text-balance font-bold text-4xl tracking-tight text-foreground md:text-5xl">
              Everything you need to succeed
            </h2>
            <p className="mx-auto max-w-2xl text-balance text-muted-foreground text-lg leading-relaxed md:text-xl">
              Powerful tools designed specifically for freelancers and independent contractors
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Project Tracking Card */}
            <Card className="group border-2 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between text-center">
                  <div className="rounded-lg bg-[#AF1B3F]/10 p-3 transition-colors group-hover:bg-[#AF1B3F]/20">
                    <FileText className="h-6 w-6 text-[#AF1B3F]" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-foreground text-center">Project Tracking</CardTitle>
                <CardDescription className="text-base leading-relaxed text-center">
                  Manage your freelance projects with ease
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>Track project budgets and timelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>Manage client information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>Monitor project status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>Generate project reports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Expense Management Card */}
            <Card className="group border-2 transition-all duration-300 hover:-translate-y-2 hover:border-[#AF1B3F] hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-lg bg-[#AF1B3F]/10 p-3 transition-colors group-hover:bg-[#AF1B3F]/20">
                    <DollarSign className="h-6 w-6 text-[#AF1B3F]" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-foreground text-center">Expense Management</CardTitle>
                <CardDescription className="text-base leading-relaxed text-center">
                  Never miss a tax-deductible expense
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>Manual expense entry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>Receipt upload and parsing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>IRS Schedule C categorization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>Tax deduction optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI-Powered Card */}
            <Card className="group border-2 transition-all duration-300 hover:-translate-y-2 hover:border-[#FEB33C] hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-lg bg-[#AF1B3F]/10 p-3 transition-colors group-hover:bg-[#AF1B3F]/20">
                    <Sparkles className="h-6 w-6 text-[#AF1B3F]" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-foreground text-center">AI-Powered</CardTitle>
                <CardDescription className="text-base leading-relaxed text-center">
                  Smart automation for your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>AWS Bedrock receipt parsing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>Vendor template caching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>Automated categorization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FEB33C]" />
                    <span>Tax compliance checking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 pb-32 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-3xl">
            {/* Decorative Elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

            <CardHeader className="relative text-center pb-6 pt-12">
              <Badge variant="outline" className="mx-auto mb-6 w-fit border-primary/40 text-primary">
                Start Today
              </Badge>
              <CardTitle className="mb-6 text-balance font-bold text-4xl text-foreground md:text-5xl">
                Ready to optimize your freelance business?
              </CardTitle>
              <CardDescription className="mx-auto max-w-2xl text-balance text-lg leading-relaxed md:text-xl">
                Join thousands of freelancers who are saving time and money with TeckStart.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative flex flex-col items-center gap-6 pb-12">
              <Button
                size="lg"
                className="group bg-primary px-8 text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="text-muted-foreground text-sm">No credit card required • Cancel anytime</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

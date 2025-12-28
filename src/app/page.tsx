import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, DollarSign, Sparkles, ArrowRight, CheckCircle2, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0E2D4C08_1px,transparent_1px),linear-gradient(to_bottom,#0E2D4C08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            {/* Announcement Badge */}
            <div className="mb-12 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Badge
                variant="secondary"
                className="group cursor-pointer border-accent/30 bg-accent/10 px-5 py-2.5 text-accent transition-all hover:border-accent/50 hover:bg-accent/20 hover:shadow-lg"
              >
                <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
                <span className="font-medium text-sm">AI-Powered Receipt Parsing Now Available</span>
                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Badge>
            </div>

            {/* Hero Content - Enhanced Grid */}
            <div className="grid items-center gap-16 lg:grid-cols-[1.2fr,1fr] lg:gap-20">
              {/* Left Column - Main Content */}
              <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="space-y-7">
                  <h1 className="text-balance font-bold text-6xl tracking-tight text-foreground md:text-7xl lg:text-8xl">
                    TeckStart
                  </h1>
                  <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-primary via-accent to-[#FEB33C]" />
                  <p className="max-w-2xl text-pretty text-muted-foreground text-xl leading-relaxed md:text-2xl lg:text-3xl">
                    Freelance Expense & Project Tracker with AI-Powered Receipt Parsing
                  </p>
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="group h-14 bg-primary px-10 text-lg text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/20"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 border-2 bg-transparent px-10 text-lg transition-all hover:scale-[1.02] hover:border-primary hover:bg-primary/5 hover:shadow-lg"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-8 border-l-4 border-accent/30 bg-accent/5 py-4 pl-6 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span className="font-medium">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span className="font-medium">Free 14-day trial</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span className="font-medium">Cancel anytime</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Enhanced Stats Grid */}
              <div className="grid gap-5 sm:grid-cols-2 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                <Card className="group relative overflow-hidden border-2 border-primary/20 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 transition-all group-hover:scale-150" />
                  <CardHeader className="relative pb-3">
                    <div className="mb-2 inline-flex items-center gap-2 text-primary/70">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium text-xs uppercase tracking-wider">Savings</span>
                    </div>
                    <CardTitle className="font-bold text-5xl text-primary">$50K+</CardTitle>
                    <CardDescription className="text-base text-foreground">
                      Average tax savings per year
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group relative overflow-hidden border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/10">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 transition-all group-hover:scale-150" />
                  <CardHeader className="relative pb-3">
                    <div className="mb-2 inline-flex items-center gap-2 text-accent/70">
                      <Zap className="h-4 w-4" />
                      <span className="font-medium text-xs uppercase tracking-wider">Accuracy</span>
                    </div>
                    <CardTitle className="font-bold text-5xl text-accent">98%</CardTitle>
                    <CardDescription className="text-base text-foreground">Receipt parsing accuracy</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group relative overflow-hidden border-2 border-[#FEB33C]/20 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-[#FEB33C]/40 hover:shadow-2xl hover:shadow-[#FEB33C]/10 sm:col-span-2">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FEB33C]/5 transition-all group-hover:scale-150" />
                  <CardHeader className="relative pb-3">
                    <div className="mb-2 inline-flex items-center gap-2 text-[#FEB33C]/70">
                      <Users className="h-4 w-4" />
                      <span className="font-medium text-xs uppercase tracking-wider">Community</span>
                    </div>
                    <CardTitle className="font-bold text-5xl text-foreground">5,000+</CardTitle>
                    <CardDescription className="text-base text-foreground">
                      Freelancers optimizing their business finances
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-20 text-center">
            <Badge variant="outline" className="mb-6 border-primary/30 px-4 py-1.5 text-primary">
              <span className="font-semibold text-sm uppercase tracking-wider">Features</span>
            </Badge>
            <h2 className="mb-6 text-balance font-bold text-5xl tracking-tight text-foreground md:text-6xl">
              Everything you need to succeed
            </h2>
            <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-primary via-accent to-[#FEB33C]" />
            <p className="mx-auto max-w-2xl text-pretty text-muted-foreground text-xl leading-relaxed md:text-2xl">
              Powerful tools designed specifically for freelancers and independent contractors
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid gap-8 md:grid-cols-3 lg:gap-10">
            {/* Project Tracking Card */}
            <Card className="group relative overflow-hidden border-2 bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:border-primary hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute right-0 top-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full bg-primary/5 transition-all duration-500 group-hover:scale-150" />
              <CardHeader className="relative">
                <div className="mb-6 inline-flex">
                  <div className="rounded-2xl bg-[#AF1B3F]/10 p-4 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#AF1B3F]/20 group-hover:shadow-md">
                    <FileText className="h-8 w-8 text-[#AF1B3F]" />
                  </div>
                </div>
                <CardTitle className="mb-3 text-3xl text-foreground">Project Tracking</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Manage your freelance projects with ease
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">Track project budgets and timelines</span>
                  </li>
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">Manage client information</span>
                  </li>
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">Monitor project status</span>
                  </li>
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">Generate project reports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Expense Management Card */}
            <Card className="group relative overflow-hidden border-2 bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:border-[#AF1B3F] hover:shadow-2xl hover:shadow-[#AF1B3F]/10">
              <div className="absolute right-0 top-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full bg-[#AF1B3F]/5 transition-all duration-500 group-hover:scale-150" />
              <CardHeader className="relative">
                <div className="mb-6 inline-flex">
                  <div className="rounded-2xl bg-[#AF1B3F]/10 p-4 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#AF1B3F]/20 group-hover:shadow-md">
                    <DollarSign className="h-8 w-8 text-[#AF1B3F]" />
                  </div>
                </div>
                <CardTitle className="mb-3 text-3xl text-foreground">Expense Management</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Never miss a tax-deductible expense
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">Manual expense entry</span>
                  </li>
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">Receipt upload and parsing</span>
                  </li>
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">IRS Schedule C categorization</span>
                  </li>
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">Tax deduction optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI-Powered Card */}
            <Card className="group relative overflow-hidden border-2 bg-white shadow-lg transition-all duration-500 hover:-translate-y-3 hover:border-[#FEB33C] hover:shadow-2xl hover:shadow-[#FEB33C]/10">
              <div className="absolute right-0 top-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full bg-[#FEB33C]/5 transition-all duration-500 group-hover:scale-150" />
              <CardHeader className="relative">
                <div className="mb-6 inline-flex">
                  <div className="rounded-2xl bg-[#AF1B3F]/10 p-4 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#AF1B3F]/20 group-hover:shadow-md">
                    <Sparkles className="h-8 w-8 text-[#AF1B3F]" />
                  </div>
                </div>
                <CardTitle className="mb-3 text-3xl text-foreground">AI-Powered</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Smart automation for your business
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">AWS Bedrock receipt parsing</span>
                  </li>
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">Vendor template caching</span>
                  </li>
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">Automated categorization</span>
                  </li>
                  <li className="flex items-start gap-3 transition-all hover:translate-x-1">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FEB33C] shadow-sm shadow-[#FEB33C]/50" />
                    <span className="leading-relaxed">Tax compliance checking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 pb-32 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Card className="group relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white via-primary/[0.02] to-accent/[0.02] shadow-2xl transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_70px_-10px_rgba(14,45,76,0.2)]">
            {/* Decorative Elements */}
            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:scale-125" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl transition-all duration-700 group-hover:scale-125" />
            <div className="absolute right-20 top-20 h-40 w-40 rounded-full bg-[#FEB33C]/10 blur-2xl" />

            <CardHeader className="relative text-center pb-8 pt-16 md:pt-20">
              <Badge
                variant="outline"
                className="mx-auto mb-8 w-fit border-primary/40 px-5 py-2 text-primary shadow-sm"
              >
                <span className="font-semibold text-sm uppercase tracking-wider">Start Today</span>
              </Badge>
              <CardTitle className="mb-8 text-balance font-bold text-5xl text-foreground md:text-6xl lg:text-7xl">
                Ready to optimize your freelance business?
              </CardTitle>
              <div className="mx-auto mb-8 h-1.5 w-32 rounded-full bg-gradient-to-r from-primary via-accent to-[#FEB33C]" />
              <CardDescription className="mx-auto max-w-2xl text-pretty text-xl leading-relaxed md:text-2xl">
                Join thousands of freelancers who are saving time and money with TeckStart.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative flex flex-col items-center gap-8 pb-16 md:pb-20">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group h-16 bg-primary px-12 text-lg text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30"
                >
                  Start Free Trial
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>
              <div className="flex flex-col items-center gap-3 text-center text-muted-foreground text-sm">
                <p className="font-medium">No credit card required • Cancel anytime</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    14-day free trial
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Easy setup
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    24/7 support
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

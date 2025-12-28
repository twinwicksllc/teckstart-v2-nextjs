import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FolderKanban, Receipt, Sparkles, ArrowRight, CheckCircle2, Shield, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl transition-all">
        <div className="container mx-auto px-6 flex items-center justify-between py-0.5">
          <div className="flex items-center gap-2">
            <Image
              src="/images/teckstart-v6-transparent.png"
              alt="TeckStart"
              width={180}
              height={54}
              className="block"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-destructive hover:text-destructive/80 transition-colors font-bold text-3xl underline bg-background"
            >
              <Link href="/demo">Demo</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all font-medium text-2xl"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-32 max-w-5xl mx-auto pt-20 pb-8">
          <Badge
            variant="outline"
            className="mb-8 bg-secondary/10 text-foreground backdrop-blur px-8 py-3 inline-flex items-center gap-4 font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 border-secondary text-lg"
          >
            <Sparkles className="h-7 w-7 text-secondary" />
            AI-Powered Expense Tracking
          </Badge>

          <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <Image
              src="/images/teckstart-v6-transparent.png"
              alt="TeckStart"
              width={450}
              height={135}
              className="block"
            />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 text-balance">
            Freelance Expense & Project Tracker
          </h1>

          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 text-pretty">
            Streamline your business finances with intelligent automation and AI-powered receipt parsing. Built for
            freelancers who value their time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 h-14 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-semibold px-10 h-14 text-base border-2 border-secondary text-foreground hover:bg-secondary hover:text-secondary-foreground transition-all hover:scale-105 bg-transparent"
            >
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000">
            <div className="flex items-center gap-2 group text-xl">
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                <Shield className="h-4 w-4 text-destructive" />
              </div>
              <span className="font-medium">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2 group text-xl">
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                <CheckCircle2 className="h-4 w-4 text-destructive" />
              </div>
              <span className="font-medium">IRS Schedule C Ready</span>
            </div>
            <div className="flex items-center gap-2 group text-xl">
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                <TrendingUp className="h-4 w-4 text-destructive" />
              </div>
              <span className="font-medium">1k+ Freelancers</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-32 max-w-7xl mx-auto">
          <Card className="border-2 hover:border-secondary transition-all duration-300 group hover:shadow-xl bg-card animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <CardHeader className="pb-4">
              <div className="h-14 w-14 rounded-xl bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center mb-6 group-hover:bg-destructive/20 group-hover:scale-110 transition-all duration-300">
                <FolderKanban className="h-7 w-7 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mb-2 text-center">Project Tracking</CardTitle>
              <CardDescription className="text-center text-lg text-destructive">
                Manage your freelance projects with ease
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-foreground/80">
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">Track project budgets and timelines</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">Manage client information</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">Monitor project status</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">Generate project reports</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary transition-all duration-300 group hover:shadow-xl bg-card animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <CardHeader className="pb-4">
              <div className="h-14 w-14 rounded-xl bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center mb-6 group-hover:bg-destructive/20 group-hover:scale-110 transition-all duration-300">
                <Receipt className="h-7 w-7 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mb-2 text-center">
                Expense Management
              </CardTitle>
              <CardDescription className="text-center text-lg text-destructive">
                Never miss a tax-deductible expense
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-foreground/80">
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">Manual expense entry</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">Receipt upload and parsing</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">IRS Schedule C categorization</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">Tax deduction optimization</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary transition-all duration-300 group hover:shadow-xl bg-card animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <CardHeader className="pb-4">
              <div className="h-14 w-14 rounded-xl bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center mb-6 group-hover:bg-destructive/20 group-hover:scale-110 transition-all duration-300">
                <Sparkles className="h-7 w-7 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mb-2 text-center">AI-Powered</CardTitle>
              <CardDescription className="text-center text-destructive text-lg">
                Smart automation for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-foreground/80">
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">AWS Bedrock receipt parsing</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">Vendor template caching</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">Automated categorization</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="leading-relaxed">Tax compliance checking</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000">
          <Card className="max-w-4xl mx-auto bg-primary border-0 shadow-2xl overflow-hidden relative">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-destructive/10 pointer-events-none" />

            <CardHeader className="relative pb-4 pt-12">
              <CardTitle className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3 tracking-normal">
                Ready to optimize your freelance business?
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 text-xl">
                Join thousands of freelancers who are saving time and money with TeckStart.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative pb-12">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-12 h-14 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 mb-6"
              >
                <Link href="/login">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-primary-foreground/70 font-medium text-base">
                No credit card required • 14-day free trial
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-0 py-2.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/teckstart-v6-transparent.png"
                alt="TeckStart"
                width={180}
                height={54}
                className="block opacity-80"
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium">© 2025 TeckStart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

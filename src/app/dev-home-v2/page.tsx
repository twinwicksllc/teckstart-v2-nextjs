import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FolderKanban, 
  Receipt, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";

export default function HomePage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="min-h-screen text-zinc-50 bg-slate-200">
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="backdrop-blur-xl sticky top-0 z-50 border-b border-purple-700 bg-slate-100/80">
          <div className="container mx-auto px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/teckstart-logo-v5-trimmed.png" alt="TeckStart" className="block leading-none w-[200px]" />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-[#0E2D4C] hover:text-[#FEB33C]">
                <Link href="/demo">Demo</Link>
              </Button>
              <Button size="sm" asChild className="bg-[hsl(228,94%,33%)] text-[#FEB33C] hover:bg-[#FEB33C] hover:text-[#0E2D4C]">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <Badge 
              variant="outline" 
              className="mb-6 border-zinc-700 bg-zinc-900/50 text-[#FEB33C] backdrop-blur scale-150 inline-flex"
            >
              <Sparkles className="h-3 w-3 mr-1.5 text-indigo-400" />
              AI-Powered Expense Tracking
            </Badge>
            
            <div className="flex justify-center mb-4">
              <img src="/teckstart-logo-v5-trimmed.png" alt="TeckStart" className="block leading-none w-[400px]" />
            </div>
            
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-purple-700">
              Freelance Expense & Project Tracker with AI-Powered Receipt Parsing. 
              Streamline your business finances with intelligent automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium px-8 h-12"
              >
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="font-medium px-8 h-12 bg-[#FEB33C] text-[#0E2D4C] border-[#FEB33C] hover:bg-[#e5a72f]"
              >
                <Link href="/demo">View Demo</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-black">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>IRS Schedule C Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span>10k+ Freelancers</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-24">
            <Card className="backdrop-blur-sm transition-colors group bg-white border-purple-700 border-2">
              <CardHeader className="pb-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                  <FolderKanban className="h-5 w-5 text-indigo-400" />
                </div>
                <CardTitle className="text-xl font-semibold tracking-tight text-zinc-500">
                  Project Tracking
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  Manage your freelance projects with ease
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-zinc-400 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Track project budgets and timelines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Manage client information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Monitor project status</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Generate project reports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm transition-colors group bg-white border-purple-700 border-2">
              <CardHeader className="pb-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <Receipt className="h-5 w-5 text-emerald-400" />
                </div>
                <CardTitle className="text-xl font-semibold tracking-tight text-zinc-500">
                  Expense Management
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  Never miss a tax-deductible expense
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-zinc-400 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Manual expense entry</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Receipt upload and parsing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>IRS Schedule C categorization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Tax deduction optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm transition-colors group bg-white border-purple-700 border-2">
              <CardHeader className="pb-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </div>
                <CardTitle className="text-xl font-semibold tracking-tight text-zinc-500">
                  AI-Powered
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  Smart automation for your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-zinc-400 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>AWS Bedrock receipt parsing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Vendor template caching</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Automated categorization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Tax compliance checking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-b from-zinc-900 to-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden relative">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 pointer-events-none" />
              
              <CardHeader className="relative pb-2">
                <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-50">
                  Ready to optimize your freelance business?
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-white mb-8 text-base">
                  Join thousands of freelancers who are saving time and money with TeckStart.
                </p>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium px-8 h-12"
                >
                  <Link href="/login">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-xs text-white mt-4">
                  No credit card required • 14-day free trial
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-800/50 mt-24">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <img src="/teckstart-logo-v5-trimmed.png" alt="TeckStart" className="block leading-none w-[200px]" />
              </div>
              <p>© 2025 TeckStart. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

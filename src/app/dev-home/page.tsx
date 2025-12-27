import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Layers,
  Receipt,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="min-h-screen text-zinc-50" style={{ background: 'hsl(228, 37%, 89%)' }}>
      <div className="w-full px-6 py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <section className="relative overflow-hidden rounded-3xl p-8 backdrop-blur" style={{ borderColor: 'hsl(283, 89%, 39%)', borderWidth: '2px', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,244,245,0.12),_transparent_55%)]" />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm" style={{ borderColor: 'hsl(283, 89%, 39%)', borderWidth: '1px', color: 'hsl(228, 94%, 33%)' }}>
                  <Sparkles className="h-4 w-4" style={{ color: 'hsl(283, 89%, 39%)' }} />
                  Linear-grade workflow for freelancers
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: 'hsl(228, 94%, 33%)' }}>
                    TeckStart
                  </h1>
                  <p className="max-w-2xl text-lg" style={{ color: 'hsl(228, 94%, 40%)' }}>
                    Freelance Expense &amp; Project Tracker with AI-powered
                    receipt parsing, intelligent categorization, and premium
                    reporting—crafted for operators who demand clarity.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 px-8 font-medium tracking-tight"
                  >
                    <Link href="/login">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-zinc-700 bg-transparent px-8 text-zinc-200 hover:bg-zinc-900"
                  >
                    <Link href="/demo">View Demo</Link>
                  </Button>
                </div>
              </div>
              <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <CardTitle className="tracking-tight text-zinc-100">
                    Weekly Insight
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Snapshot of your freelance operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Billable Hours
                      </p>
                      <p className="text-2xl font-semibold text-zinc-100">
                        42.7h
                      </p>
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-400">
                      +12%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Processed Receipts
                      </p>
                      <p className="text-2xl font-semibold text-zinc-100">
                        118
                      </p>
                    </div>
                    <Badge className="bg-sky-500/15 text-sky-400">AI parsed</Badge>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  Data secured with AWS Cognito + Bedrock
                </CardFooter>
              </Card>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Layers,
                title: "Project Tracking",
                description: "Manage every engagement without spreadsheets.",
                items: [
                  "Budgets & timeline guardrails",
                  "Client intelligence dashboard",
                  "Status pipelines",
                  "Automated reporting",
                ],
              },
              {
                icon: Receipt,
                title: "Expense Management",
                description: "Never miss deductions across clients & gigs.",
                items: [
                  "Manual or bulk entry",
                  "Receipt upload & parsing",
                  "IRS Schedule C tags",
                  "Tax deduction insights",
                ],
              },
              {
                icon: Shield,
                title: "AI-Powered",
                description: "Automation built on trusted AWS primitives.",
                items: [
                  "Bedrock-based OCR",
                  "Vendor template caching",
                  "Smart categorization",
                  "Compliance validation",
                ],
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="border-zinc-800 bg-zinc-900/60 backdrop-blur"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <feature.icon className="h-5 w-5 text-zinc-200" />
                    <CardTitle className="text-xl tracking-tight">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-zinc-200" />
                  <CardTitle className="tracking-tight">
                    Revenue &amp; Runway
                  </CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Monitor pipeline momentum, margins, and burn in real time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                  <p className="text-sm text-muted-foreground">MRR</p>
                  <p className="text-3xl font-semibold">$18.4K</p>
                  <p className="text-xs text-emerald-400">+9% vs last month</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                  <p className="text-sm text-muted-foreground">
                    Expense Efficiency
                  </p>
                  <p className="text-3xl font-semibold">62%</p>
                  <p className="text-xs text-sky-400">Optimized by AI parsing</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-zinc-200" />
                  <CardTitle className="tracking-tight">
                    Workflow Highlights
                  </CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Streamlined experiences that feel handcrafted.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "TeckStart Inbox",
                    description:
                      "Unified approvals for receipts, invoices, and tasks.",
                  },
                  {
                    title: "Proactive Nudges",
                    description:
                      "Detect anomalies and prompt actions before month-end.",
                  },
                  {
                    title: "Collaborative Notes",
                    description:
                      "Share context with clients or accountants instantly.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4"
                  >
                    <p className="text-base font-medium tracking-tight text-zinc-100">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 text-center backdrop-blur">
            <div className="mx-auto max-w-2xl space-y-6">
              <h2 className="text-3xl font-semibold tracking-tight">
                Ready to optimize your freelance business?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of independent operators who close books,
                reconcile receipts, and ship work faster with TeckStart.
              </p>
              <Button asChild size="lg" className="gap-2 px-8">
                <Link href="/login">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

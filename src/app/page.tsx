import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            TeckStart
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Freelance Expense & Project Tracker with AI-Powered Receipt Parsing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Project Tracking</CardTitle>
              <CardDescription>
                Manage your freelance projects with ease
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Track project budgets and timelines</li>
                <li>• Manage client information</li>
                <li>• Monitor project status</li>
                <li>• Generate project reports</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Expense Management</CardTitle>
              <CardDescription>
                Never miss a tax-deductible expense
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Manual expense entry</li>
                <li>• Receipt upload and parsing</li>
                <li>• IRS Schedule C categorization</li>
                <li>• Tax deduction optimization</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">AI-Powered</CardTitle>
              <CardDescription>
                Smart automation for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• AWS Bedrock receipt parsing</li>
                <li>• Vendor template caching</li>
                <li>• Automated categorization</li>
                <li>• Tax compliance checking</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to optimize your freelance business?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Join thousands of freelancers who are saving time and money with TeckStart.
              </p>
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/login">Start Free Trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
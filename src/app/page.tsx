import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Process from '@/components/landing/Process'
import Stats from '@/components/landing/Stats'
import Integrations from '@/components/landing/Integrations'
import EnhancedCTA from '@/components/landing/EnhancedCTA'
import { ErrorBoundary } from '@/components/error-boundary'

export default function LandingPage() {
  return (
    <ErrorBoundary>
      <main className="min-h-screen">
        <Hero />
        <Features />
        <Process />
        <Stats />
        <Integrations />
        <EnhancedCTA />
      </main>
    </ErrorBoundary>
  )
}

import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Benefits from '@/components/landing/Benefits'
import Process from '@/components/landing/Process'
import Stats from '@/components/landing/Stats'
import Integrations from '@/components/landing/Integrations'
import EnhancedCTA from '@/components/landing/EnhancedCTA'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Benefits />
      <Process />
      <Stats />
      <Integrations />
      <EnhancedCTA />
      <Footer />
    </main>
  )
}

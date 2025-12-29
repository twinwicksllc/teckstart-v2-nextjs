import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Benefits from '@/components/landing/Benefits'
import Process from '@/components/landing/Process'
import Stats from '@/components/landing/Stats'
import Testimonials from '@/components/landing/Testimonials'
import Integrations from '@/components/landing/Integrations'
import EnhancedCTA from '@/components/landing/EnhancedCTA'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Benefits />
      <Process />
      <Stats />
      <Testimonials />
      <Integrations />
      <EnhancedCTA />
      <Footer />
    </main>
  )
}

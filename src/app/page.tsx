import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Process from '@/components/landing/Process'
import Stats from '@/components/landing/Stats'
import Integrations from '@/components/landing/Integrations'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Process />
      <Stats />
      <Integrations />
      <Footer />
    </main>
  )
}

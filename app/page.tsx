import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { RazorDifference } from "@/components/razor-difference"
import { About } from "@/components/about"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <Hero />
        <RazorDifference />
        <About />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}

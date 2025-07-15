"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoginForm } from "@/components/login-form"
import { useState, useEffect } from "react"

function CountUp({ end, duration = 3 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = end / (duration * 60)
    const interval = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(interval)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(interval)
  }, [end, duration])
  return <span>{count}+</span>
}

export function Hero() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleScroll = () => {
    const aboutSection = document.getElementById("about-us")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center xl:justify-between px-4 md:px-8 pt-24 md:pt-16 xl:pt-0 pb-20 md:pb-12 xl:pb-20">
      {/* Content Section */}
      <div className="w-full md:w-auto lg:w-auto max-w-2xl text-left md:ml-8 xl:ml-8 mt-0 xl:mt-0 order-2 md:order-1">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-black leading-tight">
          Security You Can Track, Trust, and Rate.
        </h1>
        <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 border-2 border-black flex items-center justify-center bg-transparent">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-black" />
            </div>
            <p className="text-base md:text-lg leading-6 md:leading-8 text-black">
            Body-cam equipped guards, so you see what they see.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 border-2 border-black flex items-center justify-center bg-transparent">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-black" />
            </div>
            <p className="text-base md:text-lg leading-6 md:leading-8 text-black">
              Shift-by-shift guard ratings, because your feedback shapes our standards
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 border-2 border-black flex items-center justify-center bg-transparent">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-black" />
            </div>
            <p className="text-base md:text-lg leading-6 md:leading-8 text-black">
              Affordable rates, without cutting corners
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 border-2 border-black flex items-center justify-center bg-transparent">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-black" />
            </div>
            <p className="text-base md:text-lg leading-6 md:leading-8 text-black">
              High-performance security, not just presence, but real protection
            </p>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-8 md:mt-10">
          <div className="flex flex-row justify-center md:justify-start xl:justify-start gap-4 md:gap-6 lg:gap-8 xl:gap-12">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-6xl lg:text-7xl xl:text-8xl font-black" style={{ color: 'rgba(254,184,82,1)', fontWeight: '900' }}>
                <CountUp end={55} />
              </span>
              <span className="text-black text-lg md:text-xl font-semibold">Clients</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-6xl lg:text-7xl xl:text-8xl font-black" style={{ color: 'rgba(254,184,82,1)', fontWeight: '900' }}>
                <CountUp end={663} />
              </span>
              <span className="text-black text-lg md:text-xl font-semibold">Guards</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-6xl lg:text-7xl xl:text-8xl font-black" style={{ color: 'rgba(254,184,82,1)', fontWeight: '900' }}>
                <CountUp end={132} />
              </span>
              <span className="text-black text-lg md:text-xl font-semibold">Places Secured</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* DS-T Image */}
      <div className="flex-shrink-0 order-1 md:order-2 mb-8 md:mb-0 xl:mt-0 md:transform md:-translate-x-4 lg:-translate-x-8 xl:-translate-x-32"> 
        <img 
          src="/ds-t.png" 
          alt="DS-T" 
          className="w-64 h-auto md:w-80 lg:w-96 xl:w-[30rem] object-contain mx-auto"
        />
      </div>
      
      {/* Get Started Button - Positioned below content */}
      <div
        className="absolute bottom-8 md:bottom-4 lg:bottom-6 xl:bottom-8 left-1/2 -translate-x-1/2 cursor-pointer select-none w-fit"
        onClick={handleScroll}
      >
        <div className="text-xl md:text-2xl font-black text-black mb-1 text-center">
          Get Started
        </div>
        <ChevronDown className="text-black mx-auto animate-bounce" size={28} strokeWidth={3} style={{ animationDuration: '2s' }} />
      </div>
      
      <LoginForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  )
}

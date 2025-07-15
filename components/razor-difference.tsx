"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowUpRight, RotateCcw } from "lucide-react"

const cardData = [
  {
    id: 1,
    question: "Is your current guard basically a walking mannequin?",
    answer: "We hire guards with both muscle and mind. Polite, aware, trained in customer interaction, and not just standing around they observe, report, and react"
  },
  {
    id: 2,
    question: "Tired of security that needs security?",
    answer: "You won't find sleepy or lazy guards here. Our team is alert, well-screened, and held accountable through surprise inspections and live feed checks."
  },
  {
    id: 3,
    question: "Why is your security camera smarter than your guard when your guard could be the camera?",
    answer: "Because you haven't tried our body-cam equipped guards yet. Stream their view in real-time, anytime, from anywhere. Your eyes. Their eyes. Same view. Full control."
  },
  {
    id: 4,
    question: "Does your current guard move less than your lawn chairs?",
    answer: "Our guards are mobile, alert, and trained to patrol, not park. You hire a presence — not a statue."
  },
  {
    id: 5,
    question: "Still paying champagne prices for presence without performance security?",
    answer: "We deliver premium protection without the inflated price tag. Trained, licensed, body-cam equipped and yes, we show up on time. Call us now -we'll surprise you."
  },
  {
    id: 6,
    question: "What if you had the power to improve your security with a single click?",
    answer: "Now you do. After every shift, rate your guard's performance directly on our platform. We take action instantly because your feedback shapes our standards."
  }
]

export function RazorDifference() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleCallNow = () => {
    // For mobile devices, this will open the phone dialer
    window.location.href = "tel:+1-800-SECURITY"
  }

  const handleBookEstimate = () => {
    // Try multiple possible pricing section IDs
    const pricingSection = document.getElementById("pricing-section") || 
                          document.getElementById("pricing") || 
                          document.querySelector("[data-section='pricing']")
    
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      // If no pricing section found, scroll to bottom of page
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    }
  }

  const toggleCard = (cardId: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  return (
    <section 
      ref={containerRef}
      className="rounded-t-[1.5rem] sm:rounded-t-[2rem] md:rounded-t-[3rem] rounded-b-[1.5rem] sm:rounded-b-[2rem] md:rounded-b-[3rem] mx-2 sm:mx-4 md:mx-8 mt-6 sm:mt-8 md:mt-12 mb-12 sm:mb-16 md:mb-20 bg-white"
    >
      <div className="min-h-screen lg:min-h-[120vh] pt-12 sm:pt-16 md:pt-24 pb-6 sm:pb-8 md:pb-16 px-2 sm:px-4 md:px-8">
        <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto">
          
          {/* Left side - Scrolling flip cards */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3 sm:gap-4 md:gap-6 lg:pr-8 mb-6 sm:mb-8 lg:mb-0">
            {cardData.map((card, index) => {
              const cardProgress = useTransform(
                scrollYProgress,
                [index * 0.11, (index + 1) * 0.11, 0.66],
                [0, 1, 1]
              )
              
              const cardTransformX = isLargeScreen 
                ? useTransform(cardProgress, [0, 1], [300, 0])
                : useTransform(cardProgress, [0, 1], [0, 0])
              
              const isFlipped = flippedCards.has(card.id)
              
              return (
                <motion.div
                  key={card.id}
                  style={{ 
                    x: cardTransformX,
                    opacity: cardProgress 
                  }}
                  className="relative w-full h-[140px] xs:h-[150px] sm:h-[160px] md:h-[180px] perspective-1000"
                >
                  <div 
                    className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front of card */}
                    <div 
                      className="absolute inset-0 w-full h-full backface-hidden rounded-xl sm:rounded-2xl border-2 border-black p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col justify-center"
                      style={{background: 'linear-gradient(to right, white 0%, rgba(255,255,255,0.8) 30%, rgba(254,184,82,0.4) 50%, rgba(254,184,82,0.7) 70%, rgba(254,184,82,1) 100%)'}}
                    >
                      <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black text-center leading-relaxed px-2 xs:px-0">
                        {card.question}
                      </p>
                      
                      {/* Our Solution button */}
                      <motion.button
                        onClick={() => toggleCard(card.id)}
                        className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 bg-[#FEB852] text-black px-2 xs:px-3 py-1 rounded-full text-xs xs:text-sm font-semibold border-2 border-black hover:bg-black hover:text-[#FEB852] transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        animate={{ 
                          rotate: [0, -12, 12, -12, 12, -8, 8, 0],
                          scale: [1, 1.05, 1, 1.05, 1],
                          transition: { 
                            duration: 0.8, 
                            repeat: Infinity, 
                            ease: "easeInOut"
                          }
                        }}
                        style={{ 
                          transformOrigin: "center center",
                          willChange: "transform"
                        }}
                      >
                        our solution
                      </motion.button>
                    </div>
                    
                    {/* Back of card */}
                    <div 
                      className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl sm:rounded-2xl border-2 border-black p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col justify-center"
                      style={{background: 'linear-gradient(to right, white 0%, rgba(255,255,255,0.8) 30%, rgba(254,184,82,0.4) 50%, rgba(254,184,82,0.7) 70%, rgba(254,184,82,1) 100%)'}}
                    >
                      <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-medium text-black text-center leading-relaxed px-2 xs:px-0">
                        {card.answer}
                      </p>
                      
                      {/* Back button */}
                      <motion.button
                        onClick={() => toggleCard(card.id)}
                        className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 bg-[#FEB852] text-black px-2 xs:px-3 py-1 rounded-full text-xs xs:text-sm font-semibold border-2 border-black hover:bg-white hover:text-black transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <RotateCcw size={12} className="xs:w-4 xs:h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          {/* Right side - Sticky content */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24 lg:h-fit lg:pl-12 xl:pl-16">
            <div className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-black mb-4 xs:mb-6 md:mb-8 mt-6 xs:mt-8 md:mt-16 leading-tight text-center lg:text-left">
              <div>What truly</div>
              <div>sets us apart?</div>
            </div>
            


            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 justify-center lg:justify-start px-2 xs:px-0">
              <motion.button
                onClick={handleCallNow}
                className="bg-black text-white px-4 xs:px-6 md:px-8 py-3 xs:py-3 md:py-4 text-sm xs:text-base md:text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 xs:gap-3 rounded-full border-2 border-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Call Now
                <ArrowUpRight size={16} className="xs:w-5 xs:h-5" color="#FEB852" />
              </motion.button>
              
              <motion.button
                onClick={handleBookEstimate}
                className="bg-[#FEB852] text-black px-4 xs:px-6 md:px-8 py-3 xs:py-3 md:py-4 text-sm xs:text-base md:text-lg font-semibold hover:bg-black hover:text-[#FEB852] transition-all duration-300 flex items-center justify-center gap-2 xs:gap-3 rounded-full border-2 border-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Free Estimate
                <ArrowUpRight size={16} className="xs:w-5 xs:h-5" color="currentColor" />
              </motion.button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
} 
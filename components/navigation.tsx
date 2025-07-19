"use client"

import { Button } from "@/components/ui/button"
import { Home as HomeIcon, ArrowUpRight, ChevronDown, UserCog, Menu, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState, useRef } from "react"
import { LoginForm } from "@/components/login-form"
import { ContactPopup } from "@/components/contact-popup"
import { ReviewPopup } from "@/components/review-popup"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"

export function Navigation() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [visible, setVisible] = useState<boolean>(false)
  
  const ref = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true) // activate blur + shadow
    } else {
      setVisible(false) // revert to transparent
    }
  })

  // Box size variables for consistency - smaller when scrolled
  const boxWidth = visible ? 60 : 80  // px (reduced when scrolled)
  const boxHeight = visible ? 36 : 48 // px (reduced when scrolled)

  // Set these for the flip box - smaller when scrolled
  const flipBoxWidth = visible ? 120 : 160; // px (reduced when scrolled)
  const flipBoxHeight = visible ? 36 : 48; // px (reduced when scrolled)
  const flipFontSize = visible ? "1rem" : "1.35rem" // smaller text when scrolled

  const handleScroll = () => {
    const aboutSection = document.getElementById("about-us")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handlePricingClick = () => {
    const pricingSection = document.getElementById("pricing-section") || 
                          document.getElementById("pricing") || 
                          document.querySelector("[data-section='pricing']")
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleCareersClick = () => {
    window.open("https://www.instagram.com/dollarrsecurity/", "_blank")
  }

  const handleContactClick = () => {
    const footerSection = document.getElementById("footer") || 
                          document.querySelector("footer") || 
                          document.querySelector("[data-section='footer']")
    if (footerSection) {
      footerSection.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      // If no footer found, scroll to bottom of page
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div 
      ref={ref} 
      className={cn(
        "fixed top-0 z-50 transition-all duration-300",
        visible 
          ? "w-full flex justify-center pt-4" 
          : "w-full inset-x-0"
      )}
    >
      <motion.nav
        className={cn(
          "flex items-center transition-all duration-300",
          visible 
            ? "rounded-2xl px-2 py-2 w-auto" 
            : "absolute left-2 lg:left-8 top-8 w-[calc(100vw-1rem)] lg:w-[calc(100vw-4rem)]"
        )}
        animate={{
          backgroundColor: visible ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0)",
          backdropFilter: visible ? "blur(10px)" : "blur(0px)",
          boxShadow: visible
            ? "0 0 24px rgba(34, 42, 53, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            : "0 0 0px rgba(34, 42, 53, 0), 0 0px 0px rgba(0, 0, 0, 0), 0 0px 0px rgba(0, 0, 0, 0)",
          borderWidth: visible ? "1px" : "0px",
          borderColor: visible ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0)",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{
          width: visible ? "auto" : undefined,
          borderStyle: "solid",
        }}
      >
        <div className="flex items-center px-2 py-2">
          {/* Home Icon Box */}
          <div
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="flex items-center justify-center transition-all duration-300 cursor-pointer"
            style={{
              width: boxWidth,
              height: boxHeight,
              background: "black",
              color: "#FEB852",
              borderRadius: 12,
            }}
          >
            <img 
              src="/Logo.png" 
              alt="Logo" 
              className="object-contain"
              style={{
                width: visible ? 24 : 32,
                height: visible ? 24 : 32,
              }}
            />
          </div>
          
          {/* Desktop Menu - Hidden on mobile and tablet */}
          <nav className={cn(
            "hidden lg:flex items-center transition-all duration-300",
            visible ? "ml-2 gap-4" : "ml-4 gap-10"
          )}>
            <button
              onClick={handleScroll}
              className={cn(
                "font-semibold text-black hover:text-[#FEB852] transition-colors duration-200 bg-transparent border-none cursor-pointer",
                visible ? "text-lg" : "text-3xl"
              )}
            >
              About
            </button>
            <button
              onClick={handlePricingClick}
              className={cn(
                "font-semibold text-black hover:text-[#FEB852] transition-colors duration-200 bg-transparent border-none cursor-pointer",
                visible ? "text-lg" : "text-3xl"
              )}
            >
              Pricing
            </button>
            <button
              onClick={handleCareersClick}
              className={cn(
                "font-semibold text-black hover:text-[#FEB852] transition-colors duration-200 bg-transparent border-none cursor-pointer",
                visible ? "text-lg" : "text-3xl"
              )}
            >
              Careers
            </button>
            <button
              onClick={handleContactClick}
              className={cn(
                "font-semibold text-black hover:text-[#FEB852] transition-colors duration-200 bg-transparent border-none cursor-pointer",
                visible ? "text-lg" : "text-3xl"
              )}
            >
              Contact
            </button>
          </nav>
        </div>
        
        {/* Spacer to push the right buttons */}
        <div className="flex-1" />
        
        {/* Right side buttons */}
        <div className={cn(
          "flex items-center transition-all duration-300",
          visible ? "gap-1" : "gap-2"
        )}>
          {/* Desktop buttons - Hidden on mobile and tablet */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Review Button */}
            <div
              className="flex items-center justify-center text-black font-semibold backdrop-blur-xl bg-white/90 border-2 border-black shadow-2xl rounded-2xl cursor-pointer transition-all duration-300"
              style={{
                width: flipBoxWidth,
                height: flipBoxHeight,
                fontSize: flipFontSize,
                gap: visible ? 2 : 4,
                padding: visible ? "0 8px" : "0 16px",
              }}
              onClick={() => setIsReviewOpen(true)}
            >
              <span>Feedback</span><ArrowUpRight size={visible ? 16 : 24} color="#FEB852" />
            </div>

            {/* Let's Talk Button */}
            <div
              className="flex items-center justify-center text-black font-semibold backdrop-blur-xl bg-white/90 border-2 border-black shadow-2xl rounded-2xl cursor-pointer transition-all duration-300"
              style={{
                width: flipBoxWidth,
                height: flipBoxHeight,
                fontSize: flipFontSize,
                gap: visible ? 2 : 4,
                padding: visible ? "0 8px" : "0 16px",
              }}
              onClick={() => setIsContactOpen(true)}
            >
              <span>Let's talk</span><ArrowUpRight size={visible ? 16 : 24} color="#FEB852" />
            </div>
          </div>

          {/* Mobile Menu Button - Visible on mobile and tablet */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center bg-[#FEB852] backdrop-blur-xl border-2 border-black shadow-2xl rounded-2xl transition-all duration-300"
            style={{
              width: flipBoxHeight,
              height: flipBoxHeight,
            }}
          >
            {isMobileMenuOpen ? (
              <X size={visible ? 16 : 24} color="black" />
            ) : (
              <Menu size={visible ? 16 : 24} color="black" />
            )}
          </button>

          {/* Admin Button */}
          <div
            className="flex items-center justify-center backdrop-blur-xl bg-[#FEB852] border-2 border-black shadow-2xl rounded-2xl cursor-pointer transition-all duration-300"
            style={{
              width: flipBoxHeight, // Square shape using height for both dimensions
              height: flipBoxHeight,
            }}
            onClick={() => {
              console.log("Admin button clicked - opening login")
              setIsLoginOpen(true)
            }}
          >
            <UserCog size={visible ? 16 : 24} color="black" />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay - Full screen dropdown */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden fixed inset-0 bg-white/95 backdrop-blur-xl z-40 pt-24"
        >
          {/* Close Button */}
          <button
            onClick={closeMobileMenu}
            className="absolute top-8 right-8 flex items-center justify-center bg-[#FEB852] border-2 border-black shadow-2xl rounded-2xl transition-all duration-300 w-12 h-12"
          >
            <X size={24} color="black" />
          </button>
          
          <nav className="flex flex-col items-center space-y-8 pt-12">
            <button
              onClick={() => {
                handleScroll()
                closeMobileMenu()
              }}
              className="font-semibold text-black hover:text-[#FEB852] transition-colors duration-200 bg-transparent border-none cursor-pointer text-3xl"
            >
              About
            </button>
            <button
              onClick={() => {
                handlePricingClick()
                closeMobileMenu()
              }}
              className="font-semibold text-black hover:text-[#FEB852] transition-colors duration-200 bg-transparent border-none cursor-pointer text-3xl"
            >
              Pricing
            </button>
            <button
              onClick={() => {
                handleCareersClick()
                closeMobileMenu()
              }}
              className="font-semibold text-black hover:text-[#FEB852] transition-colors duration-200 bg-transparent border-none cursor-pointer text-3xl"
            >
              Careers
            </button>
            <button
              onClick={() => {
                handleContactClick()
                closeMobileMenu()
              }}
              className="font-semibold text-black hover:text-[#FEB852] transition-colors duration-200 bg-transparent border-none cursor-pointer text-3xl"
            >
              Contact
            </button>
            
            {/* Mobile action buttons */}
            <div className="flex flex-col items-center space-y-4 pt-8">
              <button
                onClick={() => {
                  setIsReviewOpen(true)
                  closeMobileMenu()
                }}
                className="flex items-center justify-center text-black font-semibold bg-white/90 border-2 border-black shadow-2xl rounded-2xl px-8 py-3 gap-2"
              >
                <span>Feedback</span><ArrowUpRight size={20} color="#FEB852" />
              </button>
              <button
                onClick={() => {
                  setIsContactOpen(true)
                  closeMobileMenu()
                }}
                className="flex items-center justify-center text-black font-semibold bg-white/90 border-2 border-black shadow-2xl rounded-2xl px-8 py-3 gap-2"
              >
                <span>Let's talk</span><ArrowUpRight size={20} color="#FEB852" />
              </button>
            </div>
          </nav>
        </motion.div>
      )}
      
      {/* LoginForm popup */}
      <LoginForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      {/* Add ContactPopup */}
      <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      {/* Add ReviewPopup */}
      <ReviewPopup isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
    </div>
  )
}

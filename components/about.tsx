"use client"

import { ChevronDown, X, ArrowUpRight, Home, HeartHandshake, Users, HardHat, ShoppingCart, Building, Truck, Cross, ShieldCheck, Music } from "lucide-react"
import { useState, useEffect } from "react"

const cardData = [
  {
    title: "Residential",
    desc: "Safe homes, day and night. Our trained guards patrol, report, and deter giving families peace of mind with visible protection and body-cam accountability.",
    image: "/Residential.png",
    icon: Home,
  },
  {
    title: "Cresecent / Home Care",
    desc: "Security guards are trained to respond quickly to security breaches and emergencies, ensuring that any potential threats are dealt with swiftly and effectively.",
    image: "/Homecare.png",
    icon: HeartHandshake,
  },
  {
    title: "Corporate Events",
    desc: "Secure your brand, your team, and your assets. We provide professional, uniformed guards for high-rise buildings, headquarters, and private offices with elite presentation",
    image: "/Corporate.jpg",
    icon: Users,
  },
  {
    title: "Construction Site",
    desc: "Guarding high-value sites from theft, vandalism, and unauthorized access. We secure your equipment, materials, and boundaries with 24/7 coverage and site-specific patrol strategies.",
    image: "/Construction.png",
    icon: HardHat,
  },
  {
    title: "Commercial & Retail",
    desc: "We secure Canadian businesses and retail spaces with licensed guards trained in theft prevention, access control, and reporting delivering safety, professionalism, and loss reduction daily.",
    image: "/Commercial.png",
    icon: ShoppingCart,
  },
  {
    title: "Hospitality & Hotel",
    desc: "We provide discreet, professional security for hotels and hospitality venues managing guest safety, access control, and emergencies while maintaining a calm, welcoming presence 24/7.",
    image: "/Hospitality.png",
    icon: Building,
  },
  {
    title: "Logistics & Warehouse",
    desc: "Security guard companies can provide customized security solutions that are tailored to meet the specific needs of their clients.",
    image: "/Warehouse.png",
    icon: Truck,
  },
  {
    title: "Healthcare",
    desc: "We secure hospitals, clinics, and care facilities with trained guards skilled in de-escalation, patient safety, access control, and compassionate response — day or night.",
    image: "/Healthcare.png",
    icon: Cross,
  },
  {
    title: "Specilized Security",
    desc: "From VIP protection to high-risk sites, we provide tailored security solutions using trained personnel, advanced tech, and strategic planning built to meet unique needs.",
    image: "/Residential.png",
    icon: ShieldCheck,
  },
  {
    title: "Event Security (Pub/Bar/Club)",
    desc: "From weddings to corporate galas we manage access, crowd flow, and guest safety. Our guards are alert, discreet, and trained for high-pressure environments.",
    image:"/Pub.png",
    icon: Music,
  },
];

export function About() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const handlePricingScroll = () => {
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

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section id="about-us" className="rounded-t-[2rem] md:rounded-t-[3rem] rounded-b-[2rem] md:rounded-b-[3rem] mx-4 md:mx-8 -mt-24 md:-mt-32 mb-16 md:mb-20" style={{background: 'linear-gradient(to top, rgba(254,184,82,1) 0%, rgba(254,184,82,1) 30%, rgba(254,184,82,0.6) 50%, rgba(255,244,239,1) 65%, white 80%, white 100%)'}}>
      <div className="min-h-screen lg:min-h-[120vh] pt-16 md:pt-24 pb-8 md:pb-16 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto">
          {/* Left side - Sticky content */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24 lg:h-fit mb-8 lg:mb-0">
            <div className="text-4xl md:text-6xl lg:text-8xl font-bold text-black mb-6 md:mb-8 mt-8 md:mt-16 leading-tight text-center lg:text-left">
              <div>Services</div>
              <div className="flex flex-col lg:flex-row lg:gap-4 justify-center lg:justify-start">
                <span>We</span>
                <span>Provide</span>
              </div>
            </div>
            
            {/* Descriptive text about security business */}
            <div className="text-black text-base md:text-lg leading-relaxed max-w-none lg:max-w-md text-center lg:text-left">
              <p className="mb-4 text-justify">
                At Dollar Security, we're rewriting the rules. We offer licensed, body-cam equipped guards with real-time performance feedback giving you full visibility, accountability, and peace of mind.
              </p>
              <p className="mb-4 text-justify">
                But what truly sets us apart?
              </p>
              <p className="mb-4 text-justify">
                We operate on a dollar-margin pricing model, cutting out inflated markups to offer premium security at unbeatable value. Our clients save thousands of dollars each year without compromising quality.
              </p>
            </div>
          </div>
          
          {/* Right side - Scrolling cards */}
          <div className="w-full lg:w-1/2 flex flex-col gap-2 md:gap-3 lg:px-4 lg:pt-32">
            {cardData.map((card, i) => (
              <div
                key={i}
                data-card-index={i}
                className={`backdrop-blur-2xl bg-transparent border-2 border-black shadow-sm text-black font-semibold flex items-center relative transition-all duration-300 ease-in-out rounded-2xl hover:scale-105 ${
                  expandedCard === i ? 'flex-col items-start p-4 md:p-8 w-full' : 'flex-row px-6 md:px-12 py-4 md:py-8 w-full'
                }`}
                style={{
                  minHeight: expandedCard === i ? "400px" : "100px",
                  transition: "all 0.5s ease-in-out"
                }}
              >
                {expandedCard !== i ? (
                  <>
                    <div className="flex-shrink-0 mr-3 md:mr-6 flex items-center justify-center">
                      <card.icon 
                        size={48} 
                        className="md:w-[72px] md:h-[72px]"
                        color="black" 
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-xl md:text-3xl lg:text-4xl font-bold text-black">{card.title}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4 md:mb-6 flex justify-start w-full">
                      <card.icon 
                        size={64}
                        className="md:w-[96px] md:h-[96px]"
                        color="black" 
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 text-black text-left w-full">{card.title}</div>
                    <div className="text-base md:text-xl font-normal text-black text-left w-full">{card.desc}</div>
                  </>
                )}
                
                {expandedCard === i && (
                  <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mt-4 md:mt-6 w-full">
                    {/* Image Placeholder - Top on mobile, left on desktop */}
                    <div 
                      className="w-full lg:w-[400px] h-[200px] lg:h-[250px] bg-gray-800 border-2 border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden"
                      style={{ borderRadius: 0 }}
                    >
                      {card.image ? (
                        <img 
                          src={card.image} 
                          alt={card.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <div className="text-base md:text-lg font-bold mb-1">Image Placeholder</div>
                          <div className="text-sm">400 × 250</div>
                          <div className="text-xs mt-1">Ready for your image</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Guards Count and Buttons - Bottom on mobile, right on desktop */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <div
                          className={`font-extrabold text-4xl md:text-6xl lg:text-[5rem] leading-none ${
                            i <= 4 ? 'text-black' : 'text-white'
                          }`}
                        >
                          {[156, 172, 148, 165, 179, 143, 158, 167, 151, 174][i]}
                        </div>
                        <div className="text-black text-base md:text-lg font-semibold mt-1 mb-3 md:mb-4">
                          Guards
                        </div>
                        
                        {/* Action Buttons - Below the number */}
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => window.open("https://www.instagram.com/dollarrsecurity/", "_blank")}
                            className="bg-black text-white px-3 md:px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 rounded-full"
                          >
                            Apply here
                            <ArrowUpRight size={16} color="#FEB852" />
                          </button>
                          <button 
                            onClick={handlePricingScroll}
                            className="bg-black text-white px-3 md:px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 rounded-full"
                          >
                            Book now
                            <ArrowUpRight size={16} color="#FEB852" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Small Circular Arrow Button */}
                <button
                  onClick={() => toggleCard(i)}
                  className={`absolute bg-transparent border-2 border-black text-black w-6 h-6 md:w-8 md:h-8 flex items-center justify-center transition-colors rounded-full bottom-2 right-2 md:bottom-4 md:right-4`}
                >
                  {expandedCard === i ? (
                    <X size={12} className="md:w-4 md:h-4" color="black" />
                  ) : (
                    <ChevronDown size={12} className="md:w-4 md:h-4" color="black" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pricing scroll block, centered under the grid */}
        <div className="mt-12 md:mt-20 text-center cursor-pointer" onClick={handlePricingScroll}>
          <div className="text-xl md:text-2xl font-bold text-white mb-2 text-center">
            Pricing
          </div>
          <ChevronDown className="text-white mx-auto animate-bounce" size={24} strokeWidth={2} style={{ animationDuration: '2s' }} />
        </div>
      </div>
    </section>
  );
} 
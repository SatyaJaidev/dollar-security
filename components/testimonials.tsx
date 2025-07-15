"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Quote, Star, User } from "lucide-react"
import { useRef } from "react"

const testimonials = [
  // First row - rolling right
  {
    text: "I’ve dealt with many agencies, but these guys were different. Quick communication, clean uniforms, and guards who actually cared about our safety.",
    name: "Moses",
    title: "Property Manager",
    avatar: "/placeholder-user.jpg"
  },
  {
    text: "The guards are trained not just in security, but in empathy which matters in health care. Their communication is smooth, respectful, and discreet.",
    name: "Rachel Grant", 
    title: "Administrator, Crescent Home Care",
    avatar: "/placeholder-user.jpg"
  },
  {
    text: "The moment we switched to Dollar Security, our shift reports became clearer and issues were resolved faster. Their tech-first approach is impressive",
    name: "Dr.Shaun McAllister",
    title: "Private clinic owner", 
    avatar: "/placeholder-user.jpg"
  },
  // Second row - rolling left  
  {
    text: "Finally a company that gets industrial site safety. Their tech lets us monitor the guards without babysitting. Zero hassle, high results.",
    name: "Zain Qureshi",
    title: "Site Supervisor",
    avatar: "/placeholder-user.jpg"
  },
  {
    text: "The body-cam access gave us real peace of mind. We could literally see what the guard was seeing in real time. Super professional and responsive team!",
    name: "Karen Desai",
    title: "Homeowner in Brampton",
    avatar: "/placeholder-user.jpg"
  },
  {
    text: "One of the professional security services company",
    name: "Siva",
    title: "Homeowner",
    avatar: "/placeholder-user.jpg"
  },
  {
    text: "Their real-time guard performance dashboard was a game changer. It kept our managers in the loop without the usual back-and-forth. Highly tech-driven and proactive service",
    name: "Jasmine Patel",
    title: "Franchise Owner",
    avatar: "/placeholder-user.jpg"
  }
]

const TestimonialCard = ({ testimonial, index }: { testimonial: any, index: number }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[280px] md:min-w-[350px] max-w-[320px] md:max-w-[380px] mx-2 md:mx-3">
      {/* Orange quotation mark */}
      <div className="mb-3 md:mb-4">
        <Quote 
          size={24} 
          className="md:w-8 md:h-8"
          color="rgba(254,184,82,1)" 
          fill="rgba(254,184,82,1)"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>
      
      {/* Testimonial text */}
      <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-4 md:mb-6 font-medium">
        {testimonial.text}
      </p>
      
      {/* Person info */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-transparent border-2 border-black flex items-center justify-center flex-shrink-0">
          <User size={20} className="md:w-6 md:h-6" color="black" />
        </div>
        <div>
          <div className="font-bold text-gray-900 text-xs md:text-sm">
            {testimonial.name}
          </div>
          <div className="text-gray-500 text-xs">
            {testimonial.title}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  // First row testimonials (rolling right)
  const firstRowTestimonials = testimonials.slice(0, 3)
  // Second row testimonials (rolling left) 
  const secondRowTestimonials = testimonials.slice(3, 6)

  // Ref for the testimonials section
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // Track scroll progress through testimonials section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Text animation - appears as space is created
  const textOpacity = useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 1, 1])
  const textScale = useTransform(scrollYProgress, [0.6, 0.8, 1], [0.8, 1, 1])
  const textY = useTransform(scrollYProgress, [0.6, 0.8, 1], [50, 0, 0])

  return (
    <>
      <section ref={sectionRef} className="py-12 md:py-16 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            {/* Rating Badge - Made smaller for mobile */}
            <div className="inline-flex items-center bg-black rounded-full px-2 md:px-4 py-1.5 md:py-2 mb-4 md:mb-6">
              <div className="flex items-center justify-center w-5 h-5 md:w-8 md:h-8 rounded-full mr-1.5 md:mr-3" style={{ backgroundColor: 'rgba(254,184,82,1)' }}>
                <Star size={10} className="md:w-4 md:h-4" fill="white" color="white" />
              </div>
              <span className="text-white font-medium text-xs md:text-sm">
                Rated <span className="text-base md:text-lg font-bold">5/5</span> by over <span className="text-base md:text-lg font-bold">30</span> clients
              </span>
            </div>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight px-4">
              Words of praise from others<br />
              about our presence.
            </h2>
          </div>

          {/* First row - rolling right */}
          <div className="mb-6 md:mb-8 overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: [0, -100 * firstRowTestimonials.length],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 8,
                  ease: "linear",
                },
              }}
              style={{ width: 'fit-content' }}
            >
              {/* Duplicate testimonials for seamless loop */}
              {[...firstRowTestimonials, ...firstRowTestimonials, ...firstRowTestimonials].map((testimonial, index) => (
                <TestimonialCard key={`first-row-${index}`} testimonial={testimonial} index={index} />
              ))}
            </motion.div>
          </div>

          {/* Second row - rolling left */}
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: [-100 * secondRowTestimonials.length, 0],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop", 
                  duration: 8,
                  ease: "linear",
                },
              }}
              style={{ width: 'fit-content' }}
            >
              {/* Duplicate testimonials for seamless loop */}
              {[...secondRowTestimonials, ...secondRowTestimonials, ...secondRowTestimonials].map((testimonial, index) => (
                <TestimonialCard key={`second-row-${index}`} testimonial={testimonial} index={index} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Increased space-creating section for better spacing */}
      <motion.section 
        className="bg-white relative"
        style={{
          height: useTransform(scrollYProgress, [0.6, 0.9, 1], [0, 80, 80])
        }}
      >
        {/* Call to Action Text - Appears in the created space with better spacing */}
        <motion.div 
          className="text-center absolute inset-0 flex items-center justify-center px-4 pt-8 md:pt-12"
          style={{ 
            opacity: textOpacity,
            scale: textScale,
            y: textY
          }}
        >
          <h3 className="text-xl md:text-4xl lg:text-6xl font-bold tracking-tight text-black uppercase">
            YOU <span style={{ color: 'rgba(254,184,82,1)' }}>CALL </span> WE <span style={{ color: 'rgba(254,184,82,1)' }}>GUARD</span>
          </h3>
        </motion.div>
      </motion.section>
    </>
  )
} 
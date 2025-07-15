"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import axios from "axios";
import { ArrowRight } from "lucide-react";

export function Pricing() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    company: "",
    serviceType: "",
    jobTitle: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Ref for scroll animation
  const pricingRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress for slide-down effect
  const { scrollYProgress } = useScroll({
    target: pricingRef,
    offset: ["start end", "start start"]
  });

  // Slide down animation to create space for the text
  const slideY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 25, 25]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/quotation-queries", formData);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        pincode: "",
        company: "",
        serviceType: "",
        jobTitle: "",
        message: "",
      });
    } catch (err) {
      console.error("Failed to submit query:", err);
    }
  };

  return (
    <motion.section 
      ref={pricingRef}
      id="pricing-section" 
      className="py-16 md:py-24 px-4 md:px-8 bg-black text-white rounded-t-[2rem] md:rounded-t-[3rem] rounded-b-[2rem] md:rounded-b-[3rem] mx-4 md:mx-8 mt-6 md:mt-8 mb-12 md:mb-16 relative z-20"
      style={{ y: slideY }}
    >
      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto gap-8 lg:gap-0">
        {/* Right side - Large text - Shows first on mobile */}
        <div className="w-full lg:w-[45%] lg:pl-16 order-1 lg:order-2">
          <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 mt-0 lg:mt-20 leading-tight text-center lg:text-left">
            <div>The First Step To Safer</div>
            <div>Day Starts <span style={{ color: '#FEB852' }}>Here</span></div>
          </div>
          <div className="text-base md:text-lg text-white leading-relaxed text-center lg:text-left">
            Let us know your needs. Our team will be in touch within hours to take it forward
          </div>
          
          {/* Promotional curved box */}
          <div className="mt-4 md:mt-6 flex justify-center lg:justify-start">
            <div 
              className="px-3 md:px-4 py-2 md:py-3 rounded-2xl text-center max-w-sm"
              style={{
                border: '2px dashed #FEB852',
                color: '#FEB852',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              <span style={{ fontWeight: 'bold' }}>40%</span> flat off on your first week of service
            </div>
          </div>
        </div>

        {/* Left side - Form - Shows second on mobile */}
        <div className="w-full lg:w-[55%] lg:pr-8 order-2 lg:order-1">
          {submitted && <p className="text-green-400 text-center lg:text-left mb-4">✔️ Submitted successfully!</p>}
          <form className="w-full grid gap-4 md:gap-5" onSubmit={handleSubmit}>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Name" 
              className="w-full border-2 border-gray-400 bg-transparent text-white placeholder:text-gray-300 focus:border-[#FEB852] px-2 py-2 md:py-3 text-sm outline-none rounded-lg transition-colors" 
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Email" 
                className="w-full border-2 border-gray-400 bg-transparent text-white placeholder:text-gray-300 focus:border-[#FEB852] px-2 py-2 md:py-3 text-sm outline-none rounded-lg transition-colors" 
              />
              <input 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Phone" 
                className="w-full border-2 border-gray-400 bg-transparent text-white placeholder:text-gray-300 focus:border-[#FEB852] px-2 py-2 md:py-3 text-sm outline-none rounded-lg transition-colors" 
              />
              <input 
                name="pincode" 
                value={formData.pincode} 
                onChange={handleChange} 
                placeholder="Pin" 
                className="w-full border-2 border-gray-400 bg-transparent text-white placeholder:text-gray-300 focus:border-[#FEB852] px-2 py-2 md:py-3 text-sm outline-none rounded-lg transition-colors" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input 
                name="company" 
                value={formData.company} 
                onChange={handleChange} 
                placeholder="Company" 
                className="w-full border-2 border-gray-400 bg-transparent text-white placeholder:text-gray-300 focus:border-[#FEB852] px-2 py-2 md:py-3 text-sm outline-none rounded-lg transition-colors" 
              />
              <input 
                name="serviceType" 
                value={formData.serviceType} 
                onChange={handleChange} 
                placeholder="Service" 
                className="w-full border-2 border-gray-400 bg-transparent text-white placeholder:text-gray-300 focus:border-[#FEB852] px-2 py-2 md:py-3 text-sm outline-none rounded-lg transition-colors" 
              />
            </div>
            <input 
              name="jobTitle" 
              value={formData.jobTitle} 
              onChange={handleChange} 
              placeholder="Job Title" 
              className="w-full border-2 border-gray-400 bg-transparent text-white placeholder:text-gray-300 focus:border-[#FEB852] px-2 py-2 md:py-3 text-sm outline-none rounded-lg transition-colors" 
            />
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              placeholder="Message" 
              rows={4} 
              className="w-full border-2 border-gray-400 bg-transparent text-white placeholder:text-gray-300 focus:border-[#FEB852] px-2 py-2 md:py-3 text-sm outline-none resize-none rounded-lg transition-colors" 
            />
            <button 
              type="submit" 
              className="w-full bg-[#FEB852] text-black font-semibold py-2 md:py-3 text-sm transition-colors flex items-center justify-center gap-2 hover:bg-[#FEB852]/90 rounded-lg"
            >
              Get a Quotation <ArrowRight className="ml-1" size={18} />
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

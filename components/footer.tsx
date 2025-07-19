import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4">Dollar Security</h3>
            <p className="text-black mb-4 md:mb-6 max-w-md text-sm md:text-base">
              Your trusted partner in comprehensive security solutions. We provide professional security services 
              tailored to meet your specific needs, ensuring peace of mind for homes and businesses.
            </p>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-start gap-2 md:gap-3 text-black">
                <MapPin size={16} className="md:w-[18px] md:h-[18px] flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm">3888 Duke of York blvrd , Mississauga, Ontario , Canada , L5B4P5</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-black">
                <Phone size={16} className="md:w-[18px] md:h-[18px] flex-shrink-0" />
                <span className="text-xs md:text-sm">+1 6478858115</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-black">
                <Mail size={16} className="md:w-[18px] md:h-[18px] flex-shrink-0" />
                <span className="text-xs md:text-sm">Dollarsecurite@gmail.com</span>
              </div>
            </div>
          </div>

          {/* US Team */}
          <div className="col-span-1">
            <h4 className="text-base md:text-lg font-semibold text-black mb-3 md:mb-4">US Team</h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <span className="text-black text-xs md:text-sm">
                  1. Vinay Peddineni
                </span>
              </li>
              <li>
                <span className="text-black text-xs md:text-sm">
                  2. Sahitya Peddineni
                </span>
              </li>
            </ul>
            
            {/* Canada Team - Directly under US Team */}
            <div className="mt-4">
              <h4 className="text-base md:text-lg font-semibold text-black mb-3 md:mb-4">Canada Team</h4>
              <ul className="space-y-1.5 md:space-y-2">
                <li>
                  <span className="text-black text-xs md:text-sm">
                    1. Sai Tarun Chowdary Peddineni - Founder
                  </span>
                </li>
                <li>
                  <span className="text-black text-xs md:text-sm">
                    2. Yogitha Akkineni
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="text-base md:text-lg font-semibold text-black mb-3 md:mb-4">Company</h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <Link href="/privacy" className="text-black hover:text-[#FEB852] text-xs md:text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-black hover:text-[#FEB852] text-xs md:text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>



        {/* Bottom section */}
        <div className="border-t border-black/20 mt-6 md:mt-8 pt-4 md:pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-black text-xs md:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Dollar Security. All rights reserved. Founded by{" "}
              <a 
                href="mailto:Saitarun1998@gmail.com"
                className="text-black hover:text-[#FEB852] underline decoration-1 underline-offset-2 transition-colors"
              >
                Tarun Peddineni
              </a>
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              <Link href="/sitemap" className="text-black hover:text-[#FEB852] text-xs md:text-sm transition-colors">
                Sitemap
              </Link>
              <Link href="/support" className="text-black hover:text-[#FEB852] text-xs md:text-sm transition-colors">
                Support
              </Link>
              <Link href="/feedback" className="text-black hover:text-[#FEB852] text-xs md:text-sm transition-colors">
                Feedback
              </Link>
            </div>
          </div>
          
          {/* Developer Credit */}
          <div className="mt-4 pt-4 border-t border-black/10">
            <div className="flex justify-center">
              <div className="border-2 border-black/20 rounded-lg px-4 py-2 bg-gray-50/50">
                <p className="text-black text-xs md:text-sm text-center">
                  Site Designed and Developed by{" "}
                  <Link 
                    href="http://www.linkedin.com/in/satyajaidev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-black hover:text-[#FEB852] underline decoration-1 underline-offset-2 transition-colors"
                  >
                    Satya Jaidev N
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

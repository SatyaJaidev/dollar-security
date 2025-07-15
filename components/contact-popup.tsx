"use client"

import { Instagram, Twitter, Mail, Phone, MessageCircle, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

interface ContactPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  const contactLinks = {
    instagram: "https://www.instagram.com/dollarrsecurity?igsh=eWN2ZndsbWljdmti&utm_source=qr",
    twitter: "https://twitter.com/yourcompany",
    whatsapp: "https://wa.me/1234567890",
    email: "mailto:Dollarsecurite@gmail.com",
    phone: "tel:+1234567890"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-2 border-black [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4 text-black">
            Contact Us
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4 text-black" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <a 
            href={contactLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border-2 border-black text-black hover:bg-gray-100 transition-colors"
          >
            <Instagram size={24} />
            <span className="font-semibold">Follow us on Instagram</span>
          </a>

          <a 
            href={contactLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border-2 border-black text-black hover:bg-gray-100 transition-colors"
          >
            <Twitter size={24} />
            <span className="font-semibold">Follow us on Twitter</span>
          </a>

          <a 
            href={contactLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border-2 border-black text-black hover:bg-gray-100 transition-colors"
          >
            <MessageCircle size={24} />
            <span className="font-semibold">Chat on WhatsApp</span>
          </a>

          <a 
            href={contactLinks.email}
            className="flex items-center gap-3 p-3 border-2 border-black text-black hover:bg-gray-100 transition-colors"
          >
            <Mail size={24} />
            <span className="font-semibold">Send us an email</span>
          </a>

          <a 
            href={contactLinks.phone}
            className="flex items-center gap-3 p-3 border-2 border-black text-black hover:bg-gray-100 transition-colors"
          >
            <Phone size={24} />
            <span className="font-semibold">Call us</span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
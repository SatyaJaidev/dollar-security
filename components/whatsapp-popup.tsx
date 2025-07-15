"use client"

import { MessageCircle, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

interface WhatsAppPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function WhatsAppPopup({ isOpen, onClose }: WhatsAppPopupProps) {
  const whatsappLink = "https://wa.me/1234567890" // Replace with your actual WhatsApp number

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-2 border-black [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4 text-black">
            Apply Here
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4 text-black" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4">
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 border-2 border-black text-black hover:bg-gray-100 transition-colors"
          >
            <MessageCircle size={24} />
            <span className="font-semibold">Chat on WhatsApp</span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
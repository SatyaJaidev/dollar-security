"use client"

import { Star, X } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { getApiUrl } from "@/lib/config"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ReviewPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function ReviewPopup({ isOpen, onClose }: ReviewPopupProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [date, setDate] = useState("")
  const [guardNameError, setGuardNameError] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    guardName: "",
    site: "",
    reviewerName: "",
    message: ""
  })

  useEffect(() => {
    if (!isOpen) {
      handleReset()
    }
  }, [isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.trimStart(),
    }))

    if (field === "guardName" && guardNameError) {
      setGuardNameError(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.guardName) {
      toast.error("Please enter the guard's name.")
      return
    }

    if (!date) {
      toast.error("Please select a date.")
      return
    }

    try {
      const url = getApiUrl("/guards/submit-feedback")
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          guardName: formData.guardName.trim(),
          rating,
          date,
        }),
      })

      if (res.ok) {
        toast.success("Review submitted!")
        window.location.reload()
        onClose()
        handleReset()
      } else {
        if (res.status === 404) {
          setGuardNameError(true)
          toast.error("Guard not found. Please check the guard name.")
        } else {
          toast.error("Failed to submit review.")
        }
      }
    } catch (err) {
      console.error("Feedback submit error:", err)
      toast.error("Server error.")
    }
  }

  const handleReset = () => {
    setFormData({
      customerName: "",
      guardName: "",
      site: "",
      reviewerName: "",
      message: ""
    })
    setRating(0)
    setHoveredRating(0)
    setDate("")
    setGuardNameError(false)
  }

  const handleClose = () => {
    setGuardNameError(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-2 border-black [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4 text-black">
            Submit Review
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4 text-black" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Client Name"
              value={formData.customerName}
              onChange={(e) => handleInputChange("customerName", e.target.value)}
              className="border-2 border-black bg-transparent text-black placeholder:text-black focus:ring-2 focus:ring-[#FEB852] focus:border-[#FEB852]"
            />

            <div className="relative">
              {guardNameError && (
                <div className="text-red-500 text-sm font-medium mb-1">
                  Wrong guard name
                </div>
              )}
              <Input
                type="text"
                placeholder="Guard Name"
                value={formData.guardName}
                onChange={(e) => handleInputChange("guardName", e.target.value)}
                className={`border-2 bg-transparent text-black placeholder:text-black focus:ring-2 ${
                  guardNameError 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-black focus:ring-[#FEB852] focus:border-[#FEB852]"
                }`}
              />
            </div>

            <Input
              type="text"
              placeholder="Site"
              value={formData.site}
              onChange={(e) => handleInputChange("site", e.target.value)}
              className="border-2 border-black bg-transparent text-black placeholder:text-black focus:ring-2 focus:ring-[#FEB852] focus:border-[#FEB852]"
            />

            <Input
              type="text"
              placeholder="Reviewer Name"
              value={formData.reviewerName}
              onChange={(e) => handleInputChange("reviewerName", e.target.value)}
              className="border-2 border-black bg-transparent text-black placeholder:text-black focus:ring-2 focus:ring-[#FEB852] focus:border-[#FEB852]"
            />

            {/* Date Input */}
            <Input
              type="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-2 border-black bg-transparent text-black placeholder:text-black focus:ring-2 focus:ring-[#FEB852] focus:border-[#FEB852]"
            />

            {/* Star Rating */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-black">Rating (out of 5)</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-colors"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-[#FEB852] text-[#FEB852]"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-black font-medium">
                  {rating > 0 ? `${rating}/5` : "No rating"}
                </span>
              </div>
            </div>

            <Textarea
              placeholder="Message/Complaints"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="border-2 border-black bg-transparent text-black placeholder:text-black focus:ring-2 focus:ring-[#FEB852] focus:border-[#FEB852] min-h-[100px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 justify-between">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-2 border-black text-white bg-black hover:bg-gray-800 font-semibold px-6"
            >
              Reset
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#FEB852] hover:bg-[#E85E30] text-black font-semibold border-2 border-black px-6"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

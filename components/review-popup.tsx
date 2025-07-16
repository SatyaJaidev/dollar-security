/*19-06-25 (19:07PM)
"use client"

import { Star, X, CalendarIcon } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { toast } from "react-hot-toast";

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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ReviewPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function ReviewPopup({ isOpen, onClose }: ReviewPopupProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    customerName: "",
    guardName: "",
    site: "",
    reviewerName: "",
    message: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.trimStart(), // prevent accidental leading spaces
    }));
  };

  const handleSubmit = async () => {
    if (!formData.guardName) {
      toast.error("Please enter the guard's name.");
      return;
    }
  
    try {
      const res = await fetch("http://18.188.242.116:5000/api/guards/submit-feedback"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          guardName: formData.guardName.trim(), // ✅ force trim here too
          rating,
          date,
        }),
  
      if (res.ok) {
        toast.success("Review submitted!");
  
        // 👇 Add this line to refresh GuardsTable after review submission
        window.location.reload();
  
        onClose();
        handleReset();
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (err) {
      console.error("Feedback submit error:", err);
      toast.error("Server error.");
    }
  };
  
  

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
    setDate(undefined)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={(e) => handleInputChange("customerName", e.target.value)}
              className="border-2 border-black bg-transparent text-black placeholder:text-black focus:ring-2 focus:ring-[#FEB852] focus:border-[#FEB852]"
            />
            
            <Input
              type="text"
              placeholder="Guard Name"
              value={formData.guardName}
              onChange={(e) => handleInputChange("guardName", e.target.value)}
              className="border-2 border-black bg-transparent text-black placeholder:text-black focus:ring-2 focus:ring-[#FEB852] focus:border-[#FEB852]"
            />
            
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


            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-2 border-black bg-transparent text-black hover:bg-gray-100 focus:ring-2 focus:ring-[#FEB852] focus:border-[#FEB852]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span className="text-black">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-2 border-black">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>


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

*/

"use client"

import { Star, X, CalendarIcon } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { toast } from "react-hot-toast"

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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ReviewPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function ReviewPopup({ isOpen, onClose }: ReviewPopupProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [date, setDate] = useState<Date>()
  const [guardNameError, setGuardNameError] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    guardName: "",
    site: "",
    reviewerName: "",
    message: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.trimStart(), // prevent accidental leading spaces
    }))
    
    // Clear guard name error when user types
    if (field === "guardName" && guardNameError) {
      setGuardNameError(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.guardName) {
      toast.error("Please enter the guard's name.")
      return
    }

    try {
      const res = await fetch("http://18.188.242.116:5000/api/guards/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          guardName: formData.guardName.trim(), // ✅ force trim here too
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
        // Check if it's a guard not found error
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
    setDate(undefined)
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
              placeholder="Customer Name"
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

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-2 border-black bg-transparent text-black hover:bg-gray-100 focus:ring-2 focus:ring-[#FEB852] focus:border-[#FEB852]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span className="text-black">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-2 border-black">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

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

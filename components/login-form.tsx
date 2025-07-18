"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface LoginFormProps {
  isOpen: boolean
  onClose: () => void
}

const HARDCODED_EMAIL = "Dollarsecurite@gmail.com"
const HARDCODED_PASSWORD = "Dufrunen@1998"

export function LoginForm({ isOpen, onClose }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (!isOpen) {
      setEmail("")
      setPassword("")
      setError("")
      setShowPassword(false)
    }
  }, [isOpen])

  const handleLogin = () => {
    setError("")

    if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      // Simulate a token for session use
      const dummyToken = "admin-token-123"
      const user = { role: "admin", email }

      localStorage.setItem("token", dummyToken)
      localStorage.setItem("user", JSON.stringify(user))

      router.push("/dashboard/admin/clients")
      onClose()
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-2 border-black [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4 text-black">
            Admin Login
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4 text-black" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-black font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-black bg-transparent text-black placeholder:text-black focus:ring-2 focus:ring-[#FEB852] focus:border-[#FEB852]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-black font-semibold">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-black bg-transparent text-black placeholder:text-black focus:ring-2 focus:ring-[#FEB852] focus:border-[#FEB852]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-black hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button className="w-full bg-[#FEB852] hover:bg-[#E85E30] text-black font-semibold border-2 border-black" onClick={handleLogin}>
            Login as Admin
          </Button>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

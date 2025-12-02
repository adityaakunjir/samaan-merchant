"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { authAPI } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Clock, Package, Shield } from "lucide-react"

export default function MerchantSignupPage() {
  const [shopName, setShopName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await authAPI.register({
        email,
        password,
        name: shopName,
        phone,
        role: "Merchant",
      })

      if (response.success) {
        router.push("/merchant")
        router.refresh()
      } else {
        setError(response.message || "Registration failed")
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:hidden bg-[#FF7F32] px-4 py-6 safe-top">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="/images/samaan-logo.png"
              alt="Samaan"
              width={100}
              height={28}
              className="h-7 w-auto object-contain brightness-0 invert"
            />
            <span className="text-white font-semibold">Merchant</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      {/* Left Panel - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FF7F32] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="crosses" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 0v40M0 20h40" stroke="white" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#crosses)" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Image
            src="/images/samaan-logo.png"
            alt="Samaan"
            width={140}
            height={40}
            className="h-10 w-auto object-contain brightness-0 invert"
          />
          <span className="text-white text-xl font-semibold">Merchant</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Start Your Journey,
            <br />
            Grow Your Business.
          </h1>
          <p className="text-white/90 text-lg">Register your shop and reach thousands of customers</p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span>Quick setup in minutes</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span>Easy product management</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span>Zero commission fees</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-white">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span>Trusted by 1000+ merchants</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 bg-[#FDF8F3] flex flex-col min-h-0">
        <div className="hidden lg:block p-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="flex-1 flex items-start lg:items-center justify-center px-5 py-6 lg:px-6 lg:pb-12 overflow-y-auto">
          <div className="w-full max-w-md space-y-6 lg:space-y-8">
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Create Account</h2>
              <p className="mt-2 text-sm lg:text-base text-gray-600">Register your shop on Samaan</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            <form onSubmit={handleSignup} className="space-y-4 lg:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="shopName" className="text-gray-700 text-sm">
                  Shop Name
                </Label>
                <Input
                  id="shopName"
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Your shop name"
                  className="rounded-xl border-gray-200 h-11 lg:h-12 text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 text-sm">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="rounded-xl border-gray-200 h-11 lg:h-12 text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 text-sm">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="rounded-xl border-gray-200 h-11 lg:h-12 text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="rounded-xl border-gray-200 h-11 lg:h-12 text-base"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 lg:h-12 bg-[#FF7F32] hover:bg-[#e66a20] text-white rounded-xl text-base font-medium disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm lg:text-base text-gray-600 pb-4 lg:pb-0">
              Already have an account?{" "}
              <Link href="/merchant/login" className="text-[#FF7F32] hover:underline font-medium py-2 inline-block">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

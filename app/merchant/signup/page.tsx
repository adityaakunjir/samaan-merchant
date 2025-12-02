"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone, Mail, ArrowLeft, Loader2, Clock, Package, Shield, User } from "lucide-react"

export default function MerchantSignupPage() {
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("email")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      return
    }
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/merchant`,
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/merchant/signup-success")
    }
  }

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      return
    }
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(`/merchant/verify-otp?phone=${phone}`)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Orange with pattern */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FF7F32] relative overflow-hidden flex-col justify-between p-12">
        {/* Cross pattern overlay */}
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

        {/* Logo */}
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

        {/* Hero Text */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Join the Samaan
            <br />
            family today.
          </h1>
          <p className="text-white/90 text-lg">
            Sign up now and reach thousands of customers. Start selling from your local store.
          </p>

          {/* Features */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span>Delivery in 10-15 minutes</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span>1000+ products from local stores</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span>Safe & secure payments</span>
            </div>
          </div>
        </div>

        {/* Trust badge */}
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
      <div className="flex-1 bg-[#FDF8F3] flex flex-col">
        {/* Back button */}
        <div className="p-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
              <p className="mt-2 text-gray-600">Sign up to start managing your shop</p>
            </div>

            {/* Auth method toggle */}
            <div className="bg-gray-100 p-1 rounded-full flex">
              <button
                type="button"
                onClick={() => setAuthMethod("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-all ${
                  authMethod === "phone" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Phone className="w-4 h-4" />
                Phone
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-all ${
                  authMethod === "email" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            <form onSubmit={authMethod === "email" ? handleEmailSignup : handlePhoneSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-12 rounded-xl border-gray-200 h-12"
                    required
                  />
                </div>
              </div>

              {authMethod === "phone" ? (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">
                    Phone Number
                  </Label>
                  <div className="flex">
                    <div className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="rounded-l-none rounded-r-xl border-gray-200 h-12"
                      required
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="rounded-xl border-gray-200 h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="rounded-xl border-gray-200 h-12"
                      required
                      minLength={6}
                    />
                  </div>
                </>
              )}

              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 font-normal leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#FF7F32] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#FF7F32] hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading || !agreed}
                className="w-full h-12 bg-[#FF7F32] hover:bg-[#e66a20] text-white rounded-xl text-base font-medium"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : authMethod === "phone" ? (
                  "Get OTP"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#FDF8F3] text-gray-500">OR CONTINUE WITH</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
              onClick={() =>
                supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo: `${window.location.origin}/merchant` },
                })
              }
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/merchant/login" className="text-[#FF7F32] hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

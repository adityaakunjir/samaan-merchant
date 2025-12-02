"use client"

import type React from "react"
import { authAPI } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Mail, Phone, Clock, Package, Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState<"phone" | "email">("email")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await authAPI.login(email, password)
      if (!response.success) {
        throw new Error(response.message || "Login failed")
      }
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Orange with cross pattern */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F97316] cross-pattern relative overflow-hidden">
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <img src="/images/samaan-logo.png" alt="Samaan" className="h-8 w-8 object-contain" />
            </div>
            <span className="text-2xl font-bold text-white">Samaan</span>
          </Link>

          {/* Hero Text */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Manage Your Shop,
              <br />
              Grow Your Business.
            </h1>
            <p className="text-white/90 text-lg mb-8">Login to manage orders and inventory in minutes</p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span>Real-time order updates</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span>Easy inventory management</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span>Secure & reliable platform</span>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-white/90 ml-2">Trusted by 5,000+ merchants</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-[#FDF8F3]">
        {/* Back Button */}
        <div className="p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:text-[#F97316] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Login to manage your shop</p>
            </div>

            {/* Auth Mode Toggle */}
            <div className="bg-white rounded-full p-1 flex mb-8 shadow-sm">
              <button
                type="button"
                onClick={() => setAuthMode("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-colors ${
                  authMode === "phone" ? "bg-[#FDF8F3] text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <Phone className="h-4 w-4" />
                Phone
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-colors ${
                  authMode === "email" ? "bg-[#FDF8F3] text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <form onSubmit={handleLogin} className="space-y-5">
                {authMode === "phone" ? (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Enter 10-digit number
                    </Label>
                    <div className="flex border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F97316] focus-within:border-[#F97316]">
                      <div className="px-4 py-3 bg-muted/50 border-r text-muted-foreground font-medium">+91</div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit number"
                        className="border-0 h-12 focus-visible:ring-0"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="shop@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </>
                )}

                {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{error}</p>}

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#F97316] hover:bg-[#EA580C] rounded-xl text-base font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : authMode === "phone" ? "Get OTP" : "Sign in"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-muted-foreground">OR CONTINUE WITH</span>
                </div>
              </div>

              {/* Google Button */}
              <Button variant="outline" className="w-full h-12 rounded-xl bg-white">
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
            </div>

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="text-[#F97316] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

function VerifyOTPContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get("phone") || ""

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits entered
    if (newOtp.every((d) => d) && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (otpCode: string) => {
    setLoading(true)
    setError("")

    try {
      // For now, this is a placeholder
      // const response = await authAPI.verifyOtp(phone, otpCode)
      setError("OTP verification not yet implemented in .NET API")
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError("")

    try {
      setError("OTP resend not yet implemented in .NET API")
      setCountdown(30)
      setOtp(["", "", "", "", "", ""])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP")
    }

    setResending(false)
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col">
      {/* Back button */}
      <div className="p-6">
        <Link
          href="/merchant/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Verify OTP</h1>
            <p className="mt-2 text-gray-600">Enter the 6-digit code sent to +91 {phone}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#FF7F32] focus:ring-2 focus:ring-[#FF7F32]/20 outline-none transition-all"
                maxLength={1}
                disabled={loading}
              />
            ))}
          </div>

          <Button
            onClick={() => handleVerify(otp.join(""))}
            disabled={loading || otp.some((d) => !d)}
            className="w-full h-12 bg-[#FF7F32] hover:bg-[#e66a20] text-white rounded-xl text-base font-medium"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
          </Button>

          <div className="text-gray-600">
            {countdown > 0 ? (
              <p>Resend code in {countdown}s</p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-[#FF7F32] hover:underline font-medium"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF7F32]" />
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  )
}

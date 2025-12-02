import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowLeft, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground hover:text-[#F97316] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-[#22C55E]" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">Check your email</h1>
          <p className="text-muted-foreground mb-8">
            We&apos;ve sent you a confirmation link. Please check your email and click the link to activate your
            merchant account.
          </p>

          {/* Email Icon Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <div className="w-14 h-14 bg-[#F97316]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-7 w-7 text-[#F97316]" />
            </div>
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button className="text-[#F97316] font-medium hover:underline">resend confirmation</button>
            </p>
          </div>

          <Link href="/auth/login">
            <Button className="bg-[#F97316] hover:bg-[#EA580C] h-12 px-8 rounded-xl">Back to Login</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

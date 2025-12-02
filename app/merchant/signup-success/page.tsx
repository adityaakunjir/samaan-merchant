import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>

        <p className="text-gray-600">
          We&apos;ve sent you a confirmation link. Please check your email and click the link to activate your merchant
          account.
        </p>

        <div className="pt-4 space-y-4">
          <Button asChild className="w-full h-12 bg-[#FF7F32] hover:bg-[#e66a20] text-white rounded-xl">
            <Link href="/merchant/login">
              Go to Login
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>

          <p className="text-sm text-gray-500">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <Link href="/merchant/signup" className="text-[#FF7F32] hover:underline">
              try again
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

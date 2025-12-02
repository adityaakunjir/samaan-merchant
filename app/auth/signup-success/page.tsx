import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/samaan-logo.png" alt="Samaan" className="h-12 w-auto" />
            <span className="text-xl font-bold">Merchant</span>
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-[#F97316]" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>We&apos;ve sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground text-sm mb-6">
              Please check your email and click the confirmation link to activate your merchant account. Once confirmed,
              you can set up your shop profile.
            </p>
            <Link href="/auth/login" className="text-[#F97316] hover:underline font-medium text-sm">
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Suspense } from "react"
import AuthErrorContent from "./AuthErrorContent"
import { Loader2 } from "lucide-react"

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthErrorContent />
    </Suspense>
  )
}

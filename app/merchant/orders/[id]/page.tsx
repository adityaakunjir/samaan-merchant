import { Suspense } from "react"
import OrderDetailClient from "./OrderDetailClient"
import { Loader2 } from "lucide-react"

// Required for static export - real IDs handled client-side
export function generateStaticParams() {
  return [{ id: '_fallback' }]
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
    </div>
  )
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderDetailClient />
    </Suspense>
  )
}

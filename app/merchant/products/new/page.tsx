"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api/client"
import { ProductForm } from "@/components/merchant/product-form"
import { Plus, Loader2 } from "lucide-react"

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [merchantId, setMerchantId] = useState("")

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push("/merchant/login")
      return
    }

    const user = authAPI.getCurrentUser()
    if (!user) {
      router.push("/merchant/login")
      return
    }

    setMerchantId(user.id)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto pb-24 lg:pb-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF7F32] to-[#ea580c] rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Product</h1>
        </div>
        <p className="text-gray-500">Add a new product to your inventory</p>
      </div>

      <ProductForm merchantId={merchantId} />
    </div>
  )
}

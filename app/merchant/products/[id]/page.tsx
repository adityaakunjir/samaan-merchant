"use client"

import { useEffect, useState, use } from "react"
import { useRouter, notFound } from "next/navigation"
import { authAPI, productsAPI } from "@/lib/api/client"
import { ProductForm } from "@/components/merchant/product-form"
import { Loader2 } from "lucide-react"
import type { Product } from "@/lib/types"

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [merchantId, setMerchantId] = useState("")

  useEffect(() => {
    const loadData = async () => {
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

      try {
        const productData = await productsAPI.getById(id)
        if (!productData) {
          notFound()
          return
        }
        setProduct(productData)
      } catch (error) {
        console.error("Error loading product:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    )
  }

  if (!product) {
    return notFound()
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-1">Update product details</p>
      </div>

      <ProductForm merchantId={merchantId} product={product} />
    </div>
  )
}

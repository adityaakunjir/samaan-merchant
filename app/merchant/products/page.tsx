"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api, getToken, getUser } from "@/lib/api/client"
import { ProductsList } from "@/components/merchant/products-list"
import { Loader2 } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      const token = getToken()
      const user = getUser()

      if (!token || !user) {
        router.push("/merchant/login")
        return
      }

      try {
        const merchantId = user.merchantId || user.id

        // Fetch products for this merchant
        const data = await api.merchants.getProducts(merchantId)

        // Map .NET camelCase to snake_case for component compatibility
        const mappedProducts = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          category: p.category || p.subCategory,
          sub_category: p.subCategory,
          image_url: p.imageUrl,
          is_active: p.isActive ?? p.isAvailable ?? true,
          merchant_id: p.merchantId,
          created_at: p.createdAt,
          updated_at: p.updatedAt,
        }))

        setProducts(mappedProducts)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF7F32]" />
      </div>
    )
  }

  return (
    <div className="pb-20 lg:pb-0">
      <ProductsList products={products} />
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI, productsAPI } from "@/lib/api/client"
import { InventoryContent } from "@/components/dashboard/inventory-content"
import { Loader2 } from "lucide-react"
import type { Product } from "@/lib/types"

export default function InventoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const loadData = async () => {
      // Check authentication
      if (!authAPI.isAuthenticated()) {
        router.push("/auth/login")
        return
      }

      const user = authAPI.getCurrentUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserId(user.id)

      try {
        const productsData = await productsAPI.getByMerchant(user.id)
        setProducts(productsData || [])
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    )
  }

  return <InventoryContent products={products} userId={userId} />
}

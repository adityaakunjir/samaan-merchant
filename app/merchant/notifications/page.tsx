"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI, ordersAPI, productsAPI } from "@/lib/api/client"
import { NotificationsList } from "@/components/merchant/notifications-list"
import { Loader2 } from "lucide-react"
import type { Order, Product } from "@/lib/types"

export default function NotificationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])

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

      try {
        // Load orders
        const orders = await ordersAPI.getMerchantOrders()
        setRecentOrders((orders || []).slice(0, 20))

        // Load products and filter low stock
        const products = await productsAPI.getByMerchant(user.id)
        const lowStock = (products || []).filter((product: Product) => product.stock <= 10 && product.is_active)
        setLowStockProducts(lowStock)
      } catch (error) {
        console.error("Error loading notifications:", error)
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

  return (
    <div className="max-w-2xl mx-auto pb-24 lg:pb-6">
      <NotificationsList orders={recentOrders} lowStockProducts={lowStockProducts} />
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI, merchantsAPI, ordersAPI, productsAPI } from "@/lib/api/client"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { Loader2 } from "lucide-react"
import type { Merchant, Order, Product } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [todayOrders, setTodayOrders] = useState<Order[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
  const [userEmail, setUserEmail] = useState("")

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

      setUserEmail(user.email || "")

      try {
        // Load merchant data
        const merchantData = await merchantsAPI.getById(user.id)
        setMerchant(merchantData)

        // Load orders
        const orders = await ordersAPI.getMerchantOrders()

        // Filter today's orders
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayOrdersFiltered = (orders || []).filter((order: Order) => new Date(order.created_at) >= today)
        setTodayOrders(todayOrdersFiltered)

        // Count pending orders
        const pending = (orders || []).filter((order: Order) => ["new", "confirmed"].includes(order.status))
        setPendingOrdersCount(pending.length)

        // Load products and filter low stock
        const products = await productsAPI.getByMerchant(user.id)
        const lowStock = (products || []).filter((product: Product) => product.stock <= 10 && product.is_active)
        setLowStockProducts(lowStock)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
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
    <DashboardContent
      merchant={merchant}
      todayOrders={todayOrders}
      lowStockProducts={lowStockProducts}
      pendingOrdersCount={pendingOrdersCount}
      userEmail={userEmail}
    />
  )
}

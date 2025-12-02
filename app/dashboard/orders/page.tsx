"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI, ordersAPI } from "@/lib/api/client"
import { OrdersContent } from "@/components/dashboard/orders-content"
import { Loader2 } from "lucide-react"
import type { Order } from "@/lib/types"

export default function OrdersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

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

      try {
        const ordersData = await ordersAPI.getMerchantOrders()
        setOrders(ordersData || [])
      } catch (error) {
        console.error("Error loading orders:", error)
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

  return <OrdersContent orders={orders} />
}

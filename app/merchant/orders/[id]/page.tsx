"use client"

import { useEffect, useState, use } from "react"
import { useRouter, notFound } from "next/navigation"
import { authAPI, ordersAPI } from "@/lib/api/client"
import { OrderDetail } from "@/components/merchant/order-detail"
import { Loader2 } from "lucide-react"
import type { Order } from "@/lib/types"

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (!authAPI.isAuthenticated()) {
        router.push("/merchant/login")
        return
      }

      try {
        const orderData = await ordersAPI.getById(id)
        if (!orderData) {
          notFound()
          return
        }
        setOrder(orderData)
      } catch (error) {
        console.error("Error loading order:", error)
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

  if (!order) {
    return notFound()
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      <OrderDetail order={order} />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api, getToken, getUser } from "@/lib/api/client"
import { OrdersList } from "@/components/merchant/orders-list"
import { Loader2 } from "lucide-react"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getToken()
      const user = getUser()

      if (!token || !user) {
        router.push("/merchant/login")
        return
      }

      try {
        // Fetch orders for this merchant
        const data = await api.orders.getMerchantOrders()

        // Map .NET camelCase to snake_case for component compatibility
        const mappedOrders = (data || []).map((o: any) => ({
          id: o.id,
          merchant_id: o.merchantId,
          customer_name: o.customer?.fullName || o.customerName || o.userName || "Customer",
          customer_phone: o.customer?.phone || o.customerPhone || o.userPhone,
          customer_address: o.deliveryAddress || o.customer?.address || o.customerAddress,
          status: o.status?.toLowerCase() || "new",
          total_amount: o.grandTotal || o.totalAmount || o.total,
          items:
            o.items ||
            o.orderItems?.map((item: any) => ({
              name: item.productName || item.name,
              quantity: item.quantity,
              price: item.unitPrice || item.price,
            })) ||
            [],
          notes: o.deliveryInstructions || o.notes || o.specialInstructions,
          created_at: o.createdAt || o.orderDate,
          updated_at: o.updatedAt,
        }))

        setOrders(mappedOrders)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
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
      <OrdersList orders={orders} />
    </div>
  )
}

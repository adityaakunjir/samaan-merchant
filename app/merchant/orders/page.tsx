"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api, getToken, getUser } from "@/lib/api/client"
import { OrdersList } from "@/components/merchant/orders-list"
import { Loader2 } from "lucide-react"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getToken()
      const user = getUser()

      console.log("[Orders Page] Token exists:", !!token)
      console.log("[Orders Page] User:", user)

      if (!token || !user) {
        console.warn("[Orders Page] No token or user, redirecting to login")
        router.push("/merchant/login")
        return
      }

      try {
        // Fetch orders for this merchant
        console.log("[Orders Page] Fetching merchant orders...")
        const data = await api.orders.getMerchantOrders()
        console.log("[Orders Page] Received orders:", data)

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
        setError(null)
      } catch (error: any) {
        console.error("[Orders Page] Failed to fetch orders:", error)

        // Check if it's an authentication error
        if (error.status === 401 || error.message?.includes("Unauthorized")) {
          console.error("[Orders Page] Authentication failed - token may be expired or invalid")
          setError("Authentication failed. Please log in again.")
          // Only redirect after a delay to show the error message
          setTimeout(() => {
            router.push("/merchant/login")
          }, 2000)
        } else {
          setError(error.message || "Failed to load orders. Please try again.")
        }
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

  if (error) {
    return (
      <div className="pb-20 lg:pb-0">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium mb-2">Error Loading Orders</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20 lg:pb-0">
      <OrdersList orders={orders} />
    </div>
  )
}

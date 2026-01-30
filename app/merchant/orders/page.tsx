"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api, getToken, getUser, ordersAPI } from "@/lib/api/client"
import { OrdersList } from "@/components/merchant/orders-list"
import { OrderDetail } from "@/components/merchant/order-detail"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

function OrdersContent() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken()
      const user = getUser()

      console.log("[Orders Page] ========== AUTH DEBUG ==========")
      console.log("[Orders Page] Token exists:", !!token)
      console.log("[Orders Page] User:", user)
      console.log("[Orders Page] Order ID from query:", orderId)
      console.log("[Orders Page] =========================================")

      if (!token || !user) {
        console.warn("[Orders Page] No token or user, redirecting to login")
        router.push("/merchant/login")
        return
      }

      try {
        // If we have an order ID, fetch that specific order
        if (orderId) {
          console.log("[Orders Page] Fetching specific order:", orderId)
          const orderData = await ordersAPI.getById(orderId)
          console.log("[Orders Page] Received order:", orderData)

          if (orderData) {
            // Map to component format
            const mappedOrder = {
              id: orderData.id,
              orderNumber: orderData.orderNumber,
              status: orderData.status?.toLowerCase() || "new",
              customer: orderData.customer,
              customerName: orderData.customer?.fullName || orderData.customerName || "Customer",
              customerPhone: orderData.customer?.phone || "",
              deliveryAddress: orderData.deliveryAddress || "",
              deliveryInstructions: orderData.deliveryInstructions || "",
              items: orderData.items || orderData.orderItems || [],
              itemsTotal: orderData.itemsTotal || 0,
              deliveryFee: orderData.deliveryFee || 25,
              discount: orderData.discount || 0,
              grandTotal: orderData.grandTotal || orderData.totalAmount || 0,
              paymentMethod: orderData.paymentMethod || "COD",
              paymentStatus: orderData.paymentStatus || "Pending",
              createdAt: orderData.createdAt,
              updatedAt: orderData.updatedAt,
              estimatedDelivery: orderData.estimatedDelivery || "15-20 mins",
            }
            setSelectedOrder(mappedOrder)
          }
        }

        // Also fetch all orders for the list
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

    fetchData()
  }, [router, orderId])

  const handleBack = () => {
    router.push("/merchant/orders")
  }

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

  // If we have a selected order (from query param), show order detail
  if (orderId && selectedOrder) {
    return (
      <div className="pb-20 lg:pb-0">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
        <div className="max-w-2xl mx-auto">
          <OrderDetail order={selectedOrder} />
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

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-[#FF7F32]" />
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrdersContent />
    </Suspense>
  )
}

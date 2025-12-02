"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MerchantDashboard } from "@/components/merchant/dashboard"
import { getUser, ordersAPI, productsAPI, merchantsAPI } from "@/lib/api/client"
import { Loader2 } from "lucide-react"

export default function MerchantDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [merchant, setMerchant] = useState(null)
  const [todayOrders, setTodayOrders] = useState([])
  const [weekOrders, setWeekOrders] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [pendingOrders, setPendingOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = getUser()
        console.log("[v0] User data from localStorage:", user)

        if (!user) {
          router.push("/merchant/login")
          return
        }

        setUserEmail(user.email || "")

        const merchantId = user.merchantId || user.merchant_id || user.id
        console.log("[v0] Using merchantId:", merchantId)

        // Fetch merchant data
        try {
          const merchantData = await merchantsAPI.getById(merchantId)
          console.log("[v0] Merchant data:", merchantData)
          setMerchant(merchantData)
        } catch (e) {
          console.log("[v0] Could not fetch merchant data:", e)
        }

        // Fetch orders
        try {
          const orders = await ordersAPI.getMerchantOrders()
          console.log("[v0] Orders:", orders)

          // Filter today's orders
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const todayOrdersFiltered = (orders || []).filter(
            (order: any) => new Date(order.createdAt || order.created_at) >= today,
          )
          setTodayOrders(todayOrdersFiltered)

          // Filter last 7 days for sparkline
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
          const weekOrdersFiltered = (orders || [])
            .filter((order: any) => new Date(order.createdAt || order.created_at) >= sevenDaysAgo)
            .map((order: any) => ({
              created_at: order.createdAt || order.created_at,
              total_amount: order.totalAmount || order.total_amount,
            }))
          setWeekOrders(weekOrdersFiltered)

          // Filter pending orders
          const pendingStatuses = ["new", "confirmed", "packed", "New", "Confirmed", "Packed"]
          const pendingOrdersFiltered = (orders || [])
            .filter((order: any) => pendingStatuses.includes(order.status))
            .slice(0, 5)
            .map((order: any) => ({
              ...order,
              id: order.id,
              status: order.status?.toLowerCase(),
              customer_name: order.customerName || order.customer_name,
              total_amount: order.totalAmount || order.total_amount,
              created_at: order.createdAt || order.created_at,
              items: order.items || order.orderItems,
            }))
          setPendingOrders(pendingOrdersFiltered)

          // All orders for top products
          setAllOrders(
            (orders || []).map((order: any) => ({
              items: order.items || order.orderItems,
            })),
          )
        } catch (e) {
          console.log("[v0] Could not fetch orders:", e)
        }

        // Fetch products for low stock
        try {
          const products = await productsAPI.getByMerchant(merchantId)
          console.log("[v0] Products:", products)
          const lowStock = (products || [])
            .filter((product: any) => product.stock <= 10 && (product.isActive || product.is_active))
            .map((product: any) => ({
              ...product,
              image_url: product.imageUrl || product.image_url,
              is_active: product.isActive || product.is_active,
            }))
          setLowStockProducts(lowStock)
        } catch (e) {
          console.log("[v0] Could not fetch products:", e)
        }
      } catch (error) {
        console.error("[v0] Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF7F32] mx-auto" />
          <p className="mt-2 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <MerchantDashboard
      merchant={merchant}
      todayOrders={todayOrders}
      weekOrders={weekOrders}
      lowStockProducts={lowStockProducts}
      pendingOrders={pendingOrders}
      allOrders={allOrders}
      userEmail={userEmail}
    />
  )
}

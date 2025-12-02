"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authAPI, ordersAPI, getUser } from "@/lib/api/client"
import { MerchantSidebar } from "@/components/merchant/sidebar"
import { MerchantMobileNav } from "@/components/merchant/mobile-nav"
import { Loader2 } from "lucide-react"

const AUTH_PAGES = ["/merchant/login", "/merchant/signup", "/merchant/verify-otp", "/merchant/signup-success"]

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [merchant, setMerchant] = useState<any>(null)
  const [userEmail, setUserEmail] = useState("")
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  const isAuthPage = AUTH_PAGES.some((page) => pathname?.startsWith(page))

  useEffect(() => {
    if (isAuthPage) {
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      // Check if user is authenticated
      if (!authAPI.isAuthenticated()) {
        router.push("/merchant/login")
        return
      }

      // Get user data from localStorage
      const user = getUser()
      if (!user) {
        router.push("/merchant/login")
        return
      }

      // Set user data
      setUserEmail(user.email || "")
      setMerchant({
        id: user.merchantId,
        shop_name: user.shopName || "My Shop",
        is_open: true,
        eta_minutes: 30,
      })

      // Try to fetch pending orders count
      try {
        const orders = await ordersAPI.getMerchantOrders()
        const pending = orders.filter((o: any) => ["Placed", "Confirmed", "Packed"].includes(o.status)).length
        setPendingOrdersCount(pending)
      } catch (error) {
        console.log("Could not fetch orders:", error)
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, isAuthPage, pathname])

  if (isAuthPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF7F32] mx-auto" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Desktop Sidebar */}
      <MerchantSidebar merchant={merchant} userEmail={userEmail} pendingOrdersCount={pendingOrdersCount} />

      {/* Mobile Navigation */}
      <MerchantMobileNav merchant={merchant} userEmail={userEmail} pendingOrdersCount={pendingOrdersCount} />

      <main className="lg:pl-72 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}

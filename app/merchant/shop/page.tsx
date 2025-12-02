"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api, getToken, getUser } from "@/lib/api/client"
import { ShopProfileForm } from "@/components/merchant/shop-profile-form"
import { Store, Loader2 } from "lucide-react"

export default function ShopProfilePage() {
  const [merchant, setMerchant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchMerchant = async () => {
      const token = getToken()
      const user = getUser()

      if (!token || !user) {
        router.push("/merchant/login")
        return
      }

      try {
        const merchantId = user.merchantId || user.id

        // Fetch merchant details
        const data = await api.merchants.getById(merchantId)

        // Map .NET camelCase to snake_case for component compatibility
        const mappedMerchant = {
          id: data.id,
          shop_name: data.shopName || data.businessName || data.name,
          address: data.address || data.shopAddress,
          phone: data.phone || data.contactNumber,
          eta_minutes: data.etaMinutes || data.deliveryTime || 30,
          is_open: data.isOpen ?? data.isActive ?? true,
          logo_url: data.logoUrl || data.imageUrl,
          email: data.email,
          created_at: data.createdAt,
          updated_at: data.updatedAt,
        }

        setMerchant(mappedMerchant)
      } catch (error) {
        console.error("Failed to fetch merchant:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMerchant()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF7F32]" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto pb-24 lg:pb-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF7F32] to-[#ea580c] rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
            <Store className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop Profile</h1>
        </div>
        <p className="text-gray-500">Manage your shop details and visibility settings</p>
      </div>

      <ShopProfileForm merchant={merchant} />
    </div>
  )
}

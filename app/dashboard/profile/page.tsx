"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI, merchantsAPI } from "@/lib/api/client"
import { ShopProfileForm } from "@/components/dashboard/shop-profile-form"
import { Loader2 } from "lucide-react"
import type { Merchant } from "@/lib/types"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [userId, setUserId] = useState("")

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

      setUserId(user.id)

      try {
        const merchantData = await merchantsAPI.getById(user.id)
        setMerchant(merchantData)
      } catch (error) {
        console.error("Error loading merchant:", error)
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Shop Profile</h1>
        <p className="text-muted-foreground">Manage your shop details and settings</p>
      </div>
      <ShopProfileForm merchant={merchant} userId={userId} />
    </div>
  )
}

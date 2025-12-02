import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ShopProfileForm } from "@/components/merchant/shop-profile-form"
import { Store } from "lucide-react"

export default async function ShopProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/merchant/login")
  }

  const { data: merchant } = await supabase.from("merchants").select("*").eq("id", user.id).single()

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

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ShopProfileForm } from "@/components/dashboard/shop-profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  // Get merchant profile
  const { data: merchant } = await supabase.from("merchants").select("*").eq("id", user.id).single()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Shop Profile</h1>
        <p className="text-muted-foreground">Manage your shop details and settings</p>
      </div>
      <ShopProfileForm merchant={merchant} userId={user.id} />
    </div>
  )
}

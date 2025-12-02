import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: merchant } = await supabase.from("merchants").select("*").eq("id", user.id).maybeSingle()

  // If no merchant profile exists, create one with defaults
  let merchantData = merchant
  if (!merchant) {
    const { data: newMerchant } = await supabase
      .from("merchants")
      .insert({
        id: user.id,
        shop_name: "My Shop",
        address: "",
        phone: "",
        is_open: false,
        eta_minutes: 30,
      })
      .select()
      .single()
    merchantData = newMerchant
  }

  // Get today's orders
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("merchant_id", user.id)
    .gte("created_at", today.toISOString())

  // Get low stock products
  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("*")
    .eq("merchant_id", user.id)
    .lte("stock", 10)
    .eq("is_active", true)

  // Get pending orders count
  const { data: pendingOrders } = await supabase
    .from("orders")
    .select("id")
    .eq("merchant_id", user.id)
    .in("status", ["new", "confirmed"])

  return (
    <DashboardContent
      merchant={merchantData}
      todayOrders={todayOrders || []}
      lowStockProducts={lowStockProducts || []}
      pendingOrdersCount={pendingOrders?.length || 0}
      userEmail={user.email || ""}
    />
  )
}

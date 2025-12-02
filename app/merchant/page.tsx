import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MerchantDashboard } from "@/components/merchant/dashboard"

export default async function MerchantDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/merchant/login")
  }

  const { data: merchant } = await supabase.from("merchants").select("*").eq("id", user.id).maybeSingle()

  // Get today's orders
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("merchant_id", user.id)
    .gte("created_at", today.toISOString())

  // Get last 7 days orders for sparkline
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: weekOrders } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .eq("merchant_id", user.id)
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  // Get low stock products
  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("*")
    .eq("merchant_id", user.id)
    .lte("stock", 10)
    .eq("is_active", true)

  // Get pending orders
  const { data: pendingOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("merchant_id", user.id)
    .in("status", ["new", "confirmed", "packed"])
    .order("created_at", { ascending: false })
    .limit(5)

  // Get top selling products (from all orders)
  const { data: allOrders } = await supabase.from("orders").select("items").eq("merchant_id", user.id)

  return (
    <MerchantDashboard
      merchant={merchant}
      todayOrders={todayOrders || []}
      weekOrders={weekOrders || []}
      lowStockProducts={lowStockProducts || []}
      pendingOrders={pendingOrders || []}
      allOrders={allOrders || []}
      userEmail={user.email || ""}
    />
  )
}

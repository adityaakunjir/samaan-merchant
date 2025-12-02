import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NotificationsList } from "@/components/merchant/notifications-list"

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/merchant/login")
  }

  // Get recent orders as notifications
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  // Get low stock products
  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("*")
    .eq("merchant_id", user.id)
    .lte("stock", 10)
    .eq("is_active", true)

  return (
    <div className="max-w-2xl mx-auto pb-24 lg:pb-6">
      <NotificationsList orders={recentOrders || []} lowStockProducts={lowStockProducts || []} />
    </div>
  )
}

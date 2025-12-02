import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OrdersList } from "@/components/merchant/orders-list"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/merchant/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="pb-20 lg:pb-0">
      <OrdersList orders={orders || []} />
    </div>
  )
}

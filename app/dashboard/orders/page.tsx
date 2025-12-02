import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OrdersContent } from "@/components/dashboard/orders-content"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  // Check if merchant profile exists
  const { data: merchant } = await supabase.from("merchants").select("id").eq("id", user.id).single()

  if (!merchant) {
    redirect("/dashboard/profile")
  }

  // Get all orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false })

  return <OrdersContent orders={orders || []} />
}

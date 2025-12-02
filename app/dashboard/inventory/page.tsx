import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { InventoryContent } from "@/components/dashboard/inventory-content"

export default async function InventoryPage() {
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

  // Get all products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false })

  return <InventoryContent products={products || []} userId={user.id} />
}

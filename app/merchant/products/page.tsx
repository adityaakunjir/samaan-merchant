import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductsList } from "@/components/merchant/products-list"

export default async function ProductsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/merchant/login")
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="pb-20 lg:pb-0">
      <ProductsList products={products || []} />
    </div>
  )
}

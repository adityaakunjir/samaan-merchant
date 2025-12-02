import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OrderDetail } from "@/components/merchant/order-detail"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/merchant/login")
  }

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).eq("merchant_id", user.id).single()

  if (!order) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      <OrderDetail order={order} />
    </div>
  )
}

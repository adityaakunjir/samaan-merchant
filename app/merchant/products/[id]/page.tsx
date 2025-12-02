import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/merchant/product-form"

export default async function EditProductPage({
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

  const { data: product } = await supabase.from("products").select("*").eq("id", id).eq("merchant_id", user.id).single()

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-1">Update product details</p>
      </div>

      <ProductForm merchantId={user.id} product={product} />
    </div>
  )
}

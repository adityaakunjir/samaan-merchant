import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/merchant/product-form"
import { Plus } from "lucide-react"

export default async function NewProductPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/merchant/login")
  }

  return (
    <div className="max-w-2xl mx-auto pb-24 lg:pb-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF7F32] to-[#ea580c] rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Product</h1>
        </div>
        <p className="text-gray-500">Add a new product to your inventory</p>
      </div>

      <ProductForm merchantId={user.id} />
    </div>
  )
}

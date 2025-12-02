import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MerchantSidebar } from "@/components/merchant/sidebar"
import { MerchantMobileNav } from "@/components/merchant/mobile-nav"

export default async function MerchantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/merchant/login")
  }

  // Get or create merchant profile
  let { data: merchant } = await supabase.from("merchants").select("*").eq("id", user.id).maybeSingle()

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
    merchant = newMerchant
  }

  const { count: pendingOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("merchant_id", user.id)
    .in("status", ["new", "confirmed", "packed"])

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Desktop Sidebar */}
      <MerchantSidebar merchant={merchant} userEmail={user.email || ""} pendingOrdersCount={pendingOrdersCount || 0} />

      {/* Mobile Navigation */}
      <MerchantMobileNav
        merchant={merchant}
        userEmail={user.email || ""}
        pendingOrdersCount={pendingOrdersCount || 0}
      />

      <main className="lg:pl-72 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}

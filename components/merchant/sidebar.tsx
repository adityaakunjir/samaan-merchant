"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  LogOut,
  ChevronDown,
  Bell,
  Settings,
  HelpCircle,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Merchant } from "@/lib/types"

const navItems = [
  { href: "/merchant", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/merchant/products", icon: Package, label: "Products" },
  { href: "/merchant/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/merchant/shop", icon: Store, label: "Shop Profile" },
]

interface MerchantSidebarProps {
  merchant: Merchant | null
  userEmail: string
  pendingOrdersCount?: number
}

export function MerchantSidebar({ merchant, userEmail, pendingOrdersCount = 0 }: MerchantSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/merchant/login")
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-white border-r border-gray-100">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-50">
        <Image
          src="/images/samaan-logo.png"
          alt="Samaan"
          width={140}
          height={40}
          className="h-9 w-auto object-contain"
        />
        <span className="text-[#FF7F32] font-semibold text-lg">Merchant</span>
      </div>

      <div className="px-4 py-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Shop Status</span>
            <div
              className={cn(
                "relative flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all",
                merchant?.is_open ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
              )}
            >
              <span className={cn("relative w-2 h-2 rounded-full", merchant?.is_open ? "bg-green-500" : "bg-red-500")}>
                {merchant?.is_open && (
                  <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                )}
              </span>
              {merchant?.is_open ? "Open" : "Closed"}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2 truncate font-medium">{merchant?.shop_name || "Set up your shop"}</p>
          {merchant?.eta_minutes && (
            <p className="text-xs text-gray-500 mt-1">Est. delivery: {merchant.eta_minutes} mins</p>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/merchant" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-gradient-to-r from-[#FF7F32] to-[#ea580c] text-white shadow-lg shadow-orange-100"
                  : "text-gray-600 hover:bg-gray-50",
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                  isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200",
                )}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span className="flex-1">{item.label}</span>
              {item.label === "Orders" && pendingOrdersCount > 0 && (
                <span
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-semibold",
                    isActive ? "bg-white/20 text-white" : "bg-red-500 text-white",
                  )}
                >
                  {pendingOrdersCount}
                </span>
              )}
            </Link>
          )
        })}

        <div className="border-t border-gray-100 my-4" />
        <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Analytics</p>

        <Link
          href="/merchant/reports"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors group"
        >
          <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span>Reports</span>
          <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
            Soon
          </span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-all group">
              <div className="w-11 h-11 bg-gradient-to-br from-[#FF7F32] to-[#ea580c] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                {merchant?.shop_name?.charAt(0) || userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{merchant?.shop_name || "Merchant"}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl p-2" sideOffset={8}>
            <DropdownMenuItem asChild className="rounded-lg py-2.5 cursor-pointer">
              <Link href="/merchant/notifications" className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
                {pendingOrdersCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {pendingOrdersCount}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg py-2.5 cursor-pointer">
              <Link href="/merchant/shop" className="flex items-center gap-3">
                <Store className="w-4 h-4" />
                Shop Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg py-2.5 cursor-pointer">
              <Link href="/merchant/settings" className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg py-2.5 cursor-pointer">
              <Link href="/help" className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4" />
                Help & Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-lg py-2.5 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

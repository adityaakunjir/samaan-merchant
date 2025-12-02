"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { authAPI } from "@/lib/api/client"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  Menu,
  LogOut,
  Bell,
  X,
  Settings,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { href: "/merchant", icon: LayoutDashboard, label: "Dashboard", shortLabel: "Home" },
  { href: "/merchant/products", icon: Package, label: "Products", shortLabel: "Products" },
  { href: "/merchant/orders", icon: ShoppingCart, label: "Orders", shortLabel: "Orders" },
  { href: "/merchant/shop", icon: Store, label: "Shop Profile", shortLabel: "Shop" },
]

interface MerchantMobileNavProps {
  merchant: any
  userEmail: string
  pendingOrdersCount?: number
}

export function MerchantMobileNav({ merchant, userEmail, pendingOrdersCount = 0 }: MerchantMobileNavProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    authAPI.logout()
    router.push("/merchant/login")
  }

  return (
    <>
      <header
        className={cn(
          "lg:hidden fixed top-0 left-0 right-0 h-14 z-50 px-4 flex items-center justify-between transition-all duration-300 safe-top",
          scrolled ? "glass shadow-sm" : "bg-white/95",
        )}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/images/samaan-logo.png"
            alt="Samaan"
            width={100}
            height={28}
            className="h-7 w-auto object-contain"
          />
          <span className="text-[#FF7F32] font-semibold text-sm">Merchant</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl touch-active" asChild>
            <Link href="/merchant/notifications">
              <Bell className="w-5 h-5 text-gray-600" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-count">
                  {pendingOrdersCount > 9 ? "9+" : pendingOrdersCount}
                </span>
              )}
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl touch-active">
                <Menu className="w-5 h-5 text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-[320px] p-0 border-0">
              <div className="flex flex-col h-full bg-white">
                <div className="relative bg-gradient-to-br from-[#FF7F32] to-[#ea580c] p-6 pb-8">
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#FF7F32] text-2xl font-bold shadow-lg">
                      {merchant?.shop_name?.charAt(0) || userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-lg truncate">{merchant?.shop_name || "My Shop"}</p>
                      <p className="text-white/80 text-sm truncate">{userEmail}</p>
                    </div>
                  </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {navItems.map((item) => {
                    const isActive =
                      pathname === item.href || (item.href !== "/merchant" && pathname.startsWith(item.href))

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-medium transition-all touch-active",
                          isActive
                            ? "bg-gradient-to-r from-[#FF7F32]/10 to-[#FF7F32]/5 text-[#FF7F32]"
                            : "text-gray-700 hover:bg-gray-50 active:bg-gray-100",
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            isActive ? "bg-[#FF7F32] text-white" : "bg-gray-100 text-gray-600",
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="flex-1">{item.label}</span>
                        {item.label === "Orders" && pendingOrdersCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                            {pendingOrdersCount}
                          </span>
                        )}
                        <ChevronRight
                          className={cn("w-5 h-5 transition-colors", isActive ? "text-[#FF7F32]" : "text-gray-400")}
                        />
                      </Link>
                    )
                  })}

                  <div className="border-t border-gray-100 my-4" />

                  <Link
                    href="/merchant/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 touch-active"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </div>
                    <span>Settings</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </Link>
                </nav>

                <div className="p-4 border-t border-gray-100 safe-bottom">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-4 w-full rounded-2xl text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 transition-colors touch-active"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 z-50 safe-bottom">
        <div className="flex items-center justify-around px-2 h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/merchant" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl min-w-[64px] transition-all duration-200 touch-active bottom-nav-item",
                  isActive && "active",
                )}
              >
                <div
                  className={cn(
                    "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-br from-[#FF7F32] to-[#ea580c] shadow-lg shadow-orange-200"
                      : "bg-transparent",
                  )}
                >
                  <item.icon
                    className={cn("w-5 h-5 transition-colors duration-200", isActive ? "text-white" : "text-gray-400")}
                  />
                  {item.label === "Orders" && pendingOrdersCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {pendingOrdersCount > 9 ? "9+" : pendingOrdersCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    isActive ? "text-[#FF7F32]" : "text-gray-400",
                  )}
                >
                  {item.shortLabel}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

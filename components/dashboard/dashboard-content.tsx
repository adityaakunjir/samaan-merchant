"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, AlertTriangle, TrendingUp, ArrowRight, Store } from "lucide-react"
import Link from "next/link"
import type { Merchant, Product, Order } from "@/lib/types"

interface DashboardContentProps {
  merchant: Merchant | null
  todayOrders: Order[]
  lowStockProducts: Product[]
  pendingOrdersCount: number
  userEmail: string
}

export function DashboardContent({
  merchant,
  todayOrders,
  lowStockProducts,
  pendingOrdersCount,
  userEmail,
}: DashboardContentProps) {
  const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
  const newOrdersCount = todayOrders.filter((order) => order.status === "new").length

  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-6">
          <Store className="h-12 w-12 text-[#F97316]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Samaan!</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Let&apos;s set up your shop profile to start receiving orders from customers nearby.
        </p>
        <Link href="/dashboard/profile">
          <Button className="bg-[#F97316] hover:bg-[#EA580C] h-12 px-6 rounded-xl">
            Set Up Your Shop
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {merchant.shop_name}</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your shop today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              merchant.is_open
                ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20"
                : "bg-muted text-muted-foreground border"
            }`}
          >
            {merchant.is_open ? "Open for orders" : "Shop closed"}
          </span>
        </div>
      </div>

      {/* Stats Grid - Updated cards to white with subtle shadows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Orders"
          value={todayOrders.length.toString()}
          subtitle={`${newOrdersCount} new`}
          icon={<ShoppingCart className="h-5 w-5" />}
          iconBg="bg-[#F97316]/10"
          iconColor="text-[#F97316]"
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${todayRevenue.toLocaleString()}`}
          subtitle="Total sales"
          icon={<TrendingUp className="h-5 w-5" />}
          iconBg="bg-[#22C55E]/10"
          iconColor="text-[#22C55E]"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrdersCount.toString()}
          subtitle="Need attention"
          icon={<Package className="h-5 w-5" />}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Low Stock"
          value={lowStockProducts.length.toString()}
          subtitle="Items below 10"
          icon={<AlertTriangle className="h-5 w-5" />}
          iconBg="bg-amber-500/10"
          iconColor="text-amber-500"
          alert={lowStockProducts.length > 0}
        />
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Low Stock Alerts</CardTitle>
              <Link href="/dashboard/inventory">
                <Button variant="ghost" size="sm" className="text-[#F97316] hover:text-[#EA580C] hover:bg-[#F97316]/10">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 text-[#22C55E]" />
                </div>
                <p className="text-muted-foreground text-sm">All products are well stocked!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-[#FDF8F3] rounded-xl">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <span className="font-medium text-sm">{product.name}</span>
                    </div>
                    <span className="text-amber-600 font-semibold text-sm bg-amber-50 px-2 py-1 rounded-lg">
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
              <Link href="/dashboard/orders">
                <Button variant="ghost" size="sm" className="text-[#F97316] hover:text-[#EA580C] hover:bg-[#F97316]/10">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {todayOrders.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-[#F97316]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="h-6 w-6 text-[#F97316]" />
                </div>
                <p className="text-muted-foreground text-sm">No orders yet today.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-[#FDF8F3] rounded-xl">
                    <div>
                      <p className="font-medium text-sm">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} items • ₹{Number(order.total_amount).toLocaleString()}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  alert = false,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  alert?: boolean
}) {
  return (
    <Card className={`border-0 shadow-sm rounded-2xl ${alert ? "ring-1 ring-amber-200" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    confirmed: "bg-[#F97316]/10 text-[#F97316]",
    packed: "bg-purple-100 text-purple-700",
    ready: "bg-[#22C55E]/10 text-[#22C55E]",
    delivered: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  }

  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${styles[status] || styles.new}`}>
      {status}
    </span>
  )
}

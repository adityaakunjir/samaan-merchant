"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ShoppingCart,
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Merchant, Order, Product } from "@/lib/types"

interface MerchantDashboardProps {
  merchant: Merchant | null
  todayOrders: Order[]
  weekOrders: { created_at: string; total_amount: number }[]
  lowStockProducts: Product[]
  pendingOrders: Order[]
  allOrders: { items: any }[]
  userEmail: string
}

export function MerchantDashboard({
  merchant,
  todayOrders,
  weekOrders,
  lowStockProducts,
  pendingOrders,
  allOrders,
  userEmail,
}: MerchantDashboardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate stats
  const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
  const pendingCount = pendingOrders.length
  const lowStockCount = lowStockProducts.length

  // Calculate yesterday's stats for comparison
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]
  const yesterdayOrders = weekOrders.filter((o) => o.created_at.startsWith(yesterdayStr))
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + Number(o.total_amount), 0)
  const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0

  // Calculate top selling products
  const productSales: Record<string, { name: string; count: number }> = {}
  allOrders.forEach((order) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        if (productSales[item.product_id]) {
          productSales[item.product_id].count += item.quantity
        } else {
          productSales[item.product_id] = { name: item.name, count: item.quantity }
        }
      })
    }
  })
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Sparkline data for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split("T")[0]
  })

  const sparklineData = last7Days.map((date) => {
    const dayOrders = weekOrders.filter((o) => o.created_at.startsWith(date))
    return dayOrders.reduce((sum, o) => sum + Number(o.total_amount), 0)
  })
  const maxSparkline = Math.max(...sparklineData, 1)

  const statusColors: Record<string, string> = {
    new: "border-l-blue-500 bg-blue-50/50",
    confirmed: "border-l-amber-500 bg-amber-50/50",
    packed: "border-l-purple-500 bg-purple-50/50",
    ready: "border-l-green-500 bg-green-50/50",
  }

  const statusLabels: Record<string, string> = {
    new: "New",
    confirmed: "Confirmed",
    packed: "Packed",
    ready: "Ready",
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const mins = Math.floor(diff / 60000)

    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
    return d.toLocaleDateString()
  }

  return (
    <div
      className={cn("space-y-6 pb-24 lg:pb-6 transition-opacity duration-500", mounted ? "opacity-100" : "opacity-0")}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back!</h1>
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-gray-500">
              Here&apos;s what&apos;s happening with{" "}
              <span className="font-medium text-gray-700">{merchant?.shop_name || "your shop"}</span> today.
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-[#FF7F32] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d95513] text-white rounded-xl shadow-lg shadow-orange-100 h-11 px-5 touch-active"
          >
            <Link href="/merchant/products/new">
              <Package className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children">
        {/* Today's Orders */}
        <Card className="p-4 sm:p-5 bg-white rounded-2xl border-0 shadow-sm card-hover">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Today</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 animate-count">{todayOrders.length}</p>
            <p className="text-sm text-gray-500 mt-1">Orders</p>
          </div>
        </Card>

        {/* Today's Revenue */}
        <Card className="p-4 sm:p-5 bg-white rounded-2xl border-0 shadow-sm card-hover">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            {revenueChange !== 0 && (
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-0.5",
                  revenueChange > 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50",
                )}
              >
                {revenueChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(revenueChange).toFixed(0)}%
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 animate-count">₹{todayRevenue.toLocaleString("en-IN")}</p>
            <p className="text-sm text-gray-500 mt-1">Revenue</p>
          </div>
        </Card>

        {/* Pending Orders */}
        <Card className="p-4 sm:p-5 bg-white rounded-2xl border-0 shadow-sm card-hover">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-100">
              <Clock className="w-6 h-6 text-white" />
            </div>
            {pendingCount > 0 && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 animate-count">{pendingCount}</p>
            <p className="text-sm text-gray-500 mt-1">Pending</p>
          </div>
        </Card>

        {/* Low Stock Alerts */}
        <Card
          className={cn(
            "p-4 sm:p-5 rounded-2xl border-0 shadow-sm card-hover",
            lowStockCount > 0 ? "bg-gradient-to-br from-red-50 to-white" : "bg-white",
          )}
        >
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                lowStockCount > 0
                  ? "bg-gradient-to-br from-red-500 to-red-600 shadow-red-100"
                  : "bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-100",
              )}
            >
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            {lowStockCount > 0 && (
              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">Alert</span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 animate-count">{lowStockCount}</p>
            <p className="text-sm text-gray-500 mt-1">Low Stock</p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Pending Orders</h2>
              {pendingCount > 0 && (
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {pendingCount} active
                </span>
              )}
            </div>
            <Link
              href="/merchant/orders"
              className="text-[#FF7F32] text-sm font-medium hover:underline flex items-center gap-1 group"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {pendingOrders.length === 0 ? (
            <Card className="p-8 sm:p-12 bg-white rounded-2xl border-0 shadow-sm text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">No pending orders</h3>
              <p className="text-gray-500 mt-1 max-w-xs mx-auto">
                New orders will appear here. Make sure your shop is open!
              </p>
            </Card>
          ) : (
            <div className="space-y-3 stagger-children">
              {pendingOrders.slice(0, 5).map((order) => (
                <Link key={order.id} href={`/merchant/orders/${order.id}`}>
                  <Card
                    className={cn(
                      "p-4 bg-white rounded-xl border-0 shadow-sm border-l-4 card-hover cursor-pointer touch-active",
                      statusColors[order.status],
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                          <span
                            className={cn(
                              "text-xs font-semibold px-2.5 py-1 rounded-full",
                              order.status === "new" && "bg-blue-100 text-blue-700",
                              order.status === "confirmed" && "bg-amber-100 text-amber-700",
                              order.status === "packed" && "bg-purple-100 text-purple-700",
                              order.status === "ready" && "bg-green-100 text-green-700",
                            )}
                          >
                            {statusLabels[order.status]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 font-medium">{order.customer_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatTime(order.created_at)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900 text-lg">
                          ₹{Number(order.total_amount).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* 7-Day Revenue Chart */}
          <Card className="p-5 bg-white rounded-2xl border-0 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {sparklineData.map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-full rounded-t-lg transition-all duration-300",
                      i === sparklineData.length - 1
                        ? "bg-gradient-to-t from-[#FF7F32] to-[#ea580c]"
                        : "bg-gradient-to-t from-orange-200 to-orange-100",
                    )}
                    style={{ height: `${Math.max((value / maxSparkline) * 100, 4)}%` }}
                    title={`₹${value.toFixed(0)}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-gray-400 font-medium">
              {last7Days.map((date, i) => (
                <span key={i}>{new Date(date).toLocaleDateString("en-IN", { weekday: "short" }).charAt(0)}</span>
              ))}
            </div>
          </Card>

          {/* Low Stock Alerts */}
          <Card className="p-5 bg-white rounded-2xl border-0 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Low Stock</h3>
                <p className="text-xs text-gray-500">Items need restocking</p>
              </div>
              <Link
                href="/merchant/products?filter=low-stock"
                className="text-[#FF7F32] text-xs font-medium hover:underline"
              >
                View all
              </Link>
            </div>
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-sm text-gray-500">All products well stocked!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#FF7F32] transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-red-600 font-semibold">{product.stock} left</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Top Selling */}
          <Card className="p-5 bg-white rounded-2xl border-0 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Top Selling</h3>
                <p className="text-xs text-gray-500">Best performers</p>
              </div>
            </div>
            {topProducts.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No sales data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                        i === 0 && "bg-amber-100 text-amber-700",
                        i === 1 && "bg-gray-100 text-gray-600",
                        i === 2 && "bg-orange-100 text-orange-700",
                        i > 2 && "bg-gray-50 text-gray-500",
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.count} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

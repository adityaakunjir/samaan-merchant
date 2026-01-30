"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, ShoppingCart, AlertTriangle, Bell, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Order, Product } from "@/lib/types"

interface NotificationsListProps {
  orders: Order[]
  lowStockProducts: Product[]
}

type Notification = {
  id: string
  type: "order" | "low-stock" | "system"
  title: string
  message: string
  time: string
  read: boolean
  icon: typeof CheckCircle
  color: string
  linkTo?: string
}

type FilterType = "all" | "orders" | "alerts"

export function NotificationsList({ orders, lowStockProducts }: NotificationsListProps) {
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<FilterType>("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate notifications from orders and low stock products
  const orderNotifications: Notification[] = orders.slice(0, 10).map((order) => ({
    id: order.id,
    type: "order",
    title: order.status === "Placed" ? "New Order!" : `Order ${order.status}`,
    message: `Order #${order.id.slice(0, 8).toUpperCase()} - ${order.customer?.fullName || "Customer"} - ₹${Number(order.grandTotal).toFixed(0)}`,
    time: new Date(order.createdAt).toLocaleString(),
    read: order.status !== "Placed",
    icon: order.status === "Placed" ? ShoppingCart : CheckCircle,
    color: order.status === "Placed" ? "from-blue-500" : "from-green-500",
    linkTo: `/merchant/orders?id=${order.id}`,
  }))

  const stockNotifications: Notification[] = lowStockProducts.map((product) => ({
    id: product.id,
    type: "low-stock",
    title: "Low Stock Alert",
    message: `${product.name} has only ${product.stock} items left`,
    time: "Now",
    read: false,
    icon: AlertTriangle,
    color: "from-amber-500",
    linkTo: `/merchant/products?edit=${product.id}`,
  }))

  const [notifications, setNotifications] = useState<Notification[]>(
    [...orderNotifications, ...stockNotifications].sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1)),
  )

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true
    if (filter === "orders") return n.type === "order"
    if (filter === "alerts") return n.type === "low-stock"
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const formatRelativeTime = (dateString: string) => {
    if (dateString === "Now") return dateString
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={cn("space-y-5 transition-opacity duration-500", mounted ? "opacity-100" : "opacity-0")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF7F32] to-[#ea580c] rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 text-sm">{unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={markAllRead}
            className="text-[#FF7F32] hover:text-[#e66a20] hover:bg-orange-50 text-sm font-medium touch-active"
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { value: "all", label: "All", count: notifications.length },
          { value: "orders", label: "Orders", count: orderNotifications.length },
          { value: "alerts", label: "Alerts", count: stockNotifications.length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as FilterType)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all touch-active flex items-center gap-2",
              filter === tab.value
                ? "bg-gradient-to-r from-[#FF7F32] to-[#ea580c] text-white shadow-lg shadow-orange-100"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                filter === tab.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500",
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {filteredNotifications.length === 0 ? (
        <Card className="p-10 sm:p-12 bg-white rounded-2xl border-0 shadow-sm text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
          <p className="text-gray-500 mt-1 text-sm">No notifications to show</p>
        </Card>
      ) : (
        <div className="space-y-3 stagger-children">
          {filteredNotifications.map((notification) => {
            const Icon = notification.icon
            const content = (
              <Card
                className={cn(
                  "p-4 bg-white rounded-2xl border-0 shadow-sm transition-all relative overflow-hidden card-hover group",
                  !notification.read && "ring-2 ring-[#FF7F32]/20",
                )}
              >
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b",
                    notification.color,
                    notification.color === "from-blue-500" && "to-blue-400",
                    notification.color === "from-green-500" && "to-green-400",
                    notification.color === "from-amber-500" && "to-amber-400",
                  )}
                />

                <div className="flex items-start gap-4 pl-2">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                      notification.type === "order" && notification.title.includes("New") && "bg-blue-100",
                      notification.type === "order" && !notification.title.includes("New") && "bg-green-100",
                      notification.type === "low-stock" && "bg-amber-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        notification.type === "order" && notification.title.includes("New") && "text-blue-600",
                        notification.type === "order" && !notification.title.includes("New") && "text-green-600",
                        notification.type === "low-stock" && "text-amber-600",
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{notification.title}</p>
                      {!notification.read && <span className="w-2 h-2 bg-[#FF7F32] rounded-full animate-pulse" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1.5 font-medium">{formatRelativeTime(notification.time)}</p>
                  </div>
                  <button
                    onClick={(e) => dismissNotification(notification.id, e)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 touch-active opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            )

            if (notification.linkTo) {
              return (
                <Link key={notification.id} href={notification.linkTo} className="block touch-active">
                  {content}
                </Link>
              )
            }

            return <div key={notification.id}>{content}</div>
          })}
        </div>
      )}
    </div>
  )
}

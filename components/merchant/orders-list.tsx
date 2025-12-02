"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Package,
  Truck,
  XCircle,
  Bell,
  Volume2,
  VolumeX,
  ArrowRight,
  Phone,
  MapPin,
  FileText,
  RefreshCw,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Order } from "@/lib/types"

interface OrdersListProps {
  orders: Order[]
}

const statusConfig = {
  new: { icon: Bell, color: "bg-blue-50 text-blue-700 border-l-blue-500", bgLight: "bg-blue-500", label: "New Order" },
  confirmed: {
    icon: CheckCircle,
    color: "bg-amber-50 text-amber-700 border-l-amber-500",
    bgLight: "bg-amber-500",
    label: "Confirmed",
  },
  packed: {
    icon: Package,
    color: "bg-purple-50 text-purple-700 border-l-purple-500",
    bgLight: "bg-purple-500",
    label: "Packed",
  },
  ready: {
    icon: Truck,
    color: "bg-green-50 text-green-700 border-l-green-500",
    bgLight: "bg-green-500",
    label: "Ready",
  },
  delivered: {
    icon: CheckCircle,
    color: "bg-gray-50 text-gray-600 border-l-gray-400",
    bgLight: "bg-gray-500",
    label: "Delivered",
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-50 text-red-700 border-l-red-500",
    bgLight: "bg-red-500",
    label: "Cancelled",
  },
}

const statusFlow = ["new", "confirmed", "packed", "ready", "delivered"]

export function OrdersList({ orders: initialOrders }: OrdersListProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [filter, setFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  const refreshOrders = async () => {
    setRefreshing(true)
    const { data: newOrders } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (newOrders) {
      const existingIds = new Set(orders.map((o) => o.id))
      const newOrdersFound = newOrders.filter((o) => !existingIds.has(o.id) && o.status === "new")

      if (newOrdersFound.length > 0 && soundEnabled) {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {})
        }
      }
      setOrders(newOrders)
    }
    setTimeout(() => setRefreshing(false), 500)
  }

  useEffect(() => {
    const interval = setInterval(refreshOrders, 30000)
    return () => clearInterval(interval)
  }, [orders, soundEnabled])

  const filteredOrders = orders.filter((order) => (filter === "all" ? true : order.status === filter))

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)

    await supabase.from("orders").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", orderId)

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o)))

    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as Order["status"] } : null))
    }

    setTimeout(() => setUpdating(null), 300)
    router.refresh()
  }

  const getNextStatus = (currentStatus: string) => {
    const currentIndex = statusFlow.indexOf(currentStatus)
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1]
    }
    return null
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

  const filterCounts = {
    all: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    packed: orders.filter((o) => o.status === "packed").length,
    ready: orders.filter((o) => o.status === "ready").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  return (
    <div
      className={cn("space-y-6 pb-24 lg:pb-6 transition-opacity duration-500", mounted ? "opacity-100" : "opacity-0")}
    >
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshOrders}
            disabled={refreshing}
            className="rounded-xl bg-white border-gray-200 hover:bg-gray-50 h-11 touch-active"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              "rounded-xl h-11 touch-active",
              soundEnabled ? "bg-white border-gray-200" : "bg-gray-100 border-gray-200",
            )}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 mr-2 text-green-600" />
                <span className="hidden sm:inline">Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 mr-2 text-gray-400" />
                <span className="hidden sm:inline">Sound Off</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {(["all", "new", "confirmed", "packed", "ready", "delivered"] as const).map((status) => {
          const count = filterCounts[status]
          const isActive = filter === status

          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all touch-active",
                isActive
                  ? "bg-gradient-to-r from-[#FF7F32] to-[#ea580c] text-white shadow-lg shadow-orange-100"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300",
              )}
            >
              {isActive && <Check className="w-4 h-4" />}
              {status === "all" ? "All" : statusConfig[status as keyof typeof statusConfig]?.label}
              {count > 0 && (
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                    isActive
                      ? "bg-white/20"
                      : status === "new" && count > 0
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="p-8 sm:p-12 bg-white rounded-2xl border-0 shadow-sm text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
          <p className="text-gray-500 mt-1 max-w-xs mx-auto">
            {filter === "all"
              ? "Orders will appear here when customers place them"
              : `No ${statusConfig[filter as keyof typeof statusConfig]?.label.toLowerCase()} orders`}
          </p>
        </Card>
      ) : (
        <div className="space-y-3 stagger-children">
          {filteredOrders.map((order) => {
            const config = statusConfig[order.status]
            const StatusIcon = config.icon
            const nextStatus = getNextStatus(order.status)
            const isUpdating = updating === order.id

            return (
              <Card
                key={order.id}
                className={cn(
                  "p-4 bg-white rounded-xl border-0 shadow-sm border-l-4 card-hover cursor-pointer touch-active",
                  config.color.split(" ").pop(),
                )}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <Badge
                        className={cn(
                          "rounded-full text-xs font-semibold px-2.5 py-1",
                          config.color.split(" ").slice(0, 2).join(" "),
                        )}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                      {order.status === "new" && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1.5 font-medium">{order.customer_name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(order.created_at)}
                      </span>
                      <span>{order.items?.length || 0} items</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900 text-lg">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </p>
                    {nextStatus && order.status !== "cancelled" && (
                      <Button
                        size="sm"
                        className={cn(
                          "mt-2 bg-gradient-to-r from-[#FF7F32] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d95513] text-white rounded-lg text-xs h-8 px-3 shadow-md shadow-orange-100 touch-active",
                          isUpdating && "opacity-70",
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          updateOrderStatus(order.id, nextStatus)
                        }}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            {statusConfig[nextStatus as keyof typeof statusConfig]?.label}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md rounded-2xl mx-4 max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <div className="animate-slide-up">
              <DialogHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">Order #{selectedOrder.id.slice(0, 8).toUpperCase()}</DialogTitle>
                  <Badge
                    className={cn(
                      "rounded-full px-3 py-1",
                      statusConfig[selectedOrder.status].color.split(" ").slice(0, 2).join(" "),
                    )}
                  >
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </DialogHeader>

              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="font-semibold text-gray-900">{selectedOrder.customer_name}</p>
                  {selectedOrder.customer_phone && (
                    <a
                      href={`tel:${selectedOrder.customer_phone}`}
                      className="text-sm text-gray-600 flex items-center gap-2 hover:text-[#FF7F32] transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      {selectedOrder.customer_phone}
                    </a>
                  )}
                  {selectedOrder.customer_address && (
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="pt-1.5">{selectedOrder.customer_address}</span>
                    </p>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-2 bg-gray-50 rounded-xl p-4">
                    {selectedOrder.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">
                          <span className="font-medium text-gray-900">{item.quantity}x</span> {item.name}
                        </span>
                        <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-[#FF7F32]">
                        ₹{Number(selectedOrder.total_amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-sm text-amber-800 flex items-start gap-2">
                      <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="font-medium">Note:</span> {selectedOrder.notes}
                    </p>
                  </div>
                )}

                {/* Status Actions */}
                {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl h-12 text-red-600 hover:bg-red-50 bg-white border-gray-200"
                      onClick={() => updateOrderStatus(selectedOrder.id, "cancelled")}
                      disabled={updating === selectedOrder.id}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    {getNextStatus(selectedOrder.status) && (
                      <Button
                        className="flex-1 bg-gradient-to-r from-[#FF7F32] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d95513] text-white rounded-xl h-12 shadow-lg shadow-orange-100"
                        onClick={() => updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status)!)}
                        disabled={updating === selectedOrder.id}
                      >
                        {updating === selectedOrder.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Mark {statusConfig[getNextStatus(selectedOrder.status) as keyof typeof statusConfig]?.label}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

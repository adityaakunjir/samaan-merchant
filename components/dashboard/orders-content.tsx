"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ordersAPI } from "@/lib/api/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, Phone, MapPin, ChevronRight, Package, CheckCircle2, Truck, Filter } from "lucide-react"
import type { Order } from "@/lib/types"

interface OrdersContentProps {
  orders: Order[]
}

const ORDER_STATUSES = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-700 border-l-blue-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-[#F97316]/10 text-[#F97316] border-l-[#F97316]" },
  { value: "packed", label: "Packed", color: "bg-purple-100 text-purple-700 border-l-purple-500" },
  { value: "ready", label: "Ready", color: "bg-[#22C55E]/10 text-[#22C55E] border-l-[#22C55E]" },
  { value: "delivered", label: "Delivered", color: "bg-muted text-muted-foreground border-l-muted-foreground" },
  { value: "cancelled", label: "Cancelled", color: "bg-destructive/10 text-destructive border-l-destructive" },
]

const STATUS_FLOW = ["new", "confirmed", "packed", "ready"]

export function OrdersContent({ orders }: OrdersContentProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(true)
    try {
      await ordersAPI.updateStatus(orderId, newStatus)
      router.refresh()

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as Order["status"] })
      }
    } catch (err) {
      console.error("Status update error:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const getNextStatus = (currentStatus: string) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus)
    if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) {
      return null
    }
    return STATUS_FLOW[currentIndex + 1]
  }

  const getStatusInfo = (status: string) => {
    return ORDER_STATUSES.find((s) => s.value === status) || ORDER_STATUSES[0]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  const activeOrdersCount = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">{activeOrdersCount} active orders</p>
        </div>
      </div>

      {/* Filters - Updated styling */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by customer or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-white border-0 shadow-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-xl bg-white border-0 shadow-sm">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Orders</SelectItem>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List - Updated with notification-style cards */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="h-10 w-10 text-[#F97316]" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
          <p className="text-muted-foreground max-w-sm">
            {orders.length === 0 ? "Orders from customers will appear here" : "Try adjusting your search or filters"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            const nextStatus = getNextStatus(order.status)

            return (
              <Card
                key={order.id}
                className={`cursor-pointer hover:shadow-md transition-all border-0 shadow-sm rounded-2xl overflow-hidden border-l-4 ${statusInfo.color.split(" ")[2]}`}
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusInfo.color.split(" ").slice(0, 2).join(" ")}`}
                      >
                        {order.status === "new" && <ShoppingCart className="h-5 w-5" />}
                        {order.status === "confirmed" && <CheckCircle2 className="h-5 w-5" />}
                        {order.status === "packed" && <Package className="h-5 w-5" />}
                        {order.status === "ready" && <Truck className="h-5 w-5" />}
                        {order.status === "delivered" && <CheckCircle2 className="h-5 w-5" />}
                        {order.status === "cancelled" && <ShoppingCart className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{order.customer_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} items • ₹{Number(order.total_amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(order.created_at)}</p>
                      </div>
                    </div>

                    {/* Quick Action */}
                    <div className="flex items-center gap-2">
                      {nextStatus && (
                        <Button
                          size="sm"
                          className="bg-[#F97316] hover:bg-[#EA580C] rounded-xl h-9"
                          disabled={isUpdating}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange(order.id, nextStatus)
                          }}
                        >
                          {nextStatus === "confirmed" && "Confirm"}
                          {nextStatus === "packed" && "Mark Packed"}
                          {nextStatus === "ready" && "Mark Ready"}
                        </Button>
                      )}
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetail order={selectedOrder} onStatusChange={handleStatusChange} isUpdating={isUpdating} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OrderDetail({
  order,
  onStatusChange,
  isUpdating,
}: {
  order: Order
  onStatusChange: (orderId: string, status: string) => void
  isUpdating: boolean
}) {
  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]

  return (
    <div className="space-y-6">
      {/* Status Flow */}
      <div className="flex items-center justify-between bg-[#FDF8F3] rounded-xl p-4">
        {STATUS_FLOW.map((status, index) => {
          const isActive = STATUS_FLOW.indexOf(order.status) >= index
          const isCurrent = order.status === status

          return (
            <div key={status} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive ? "bg-[#F97316] text-white" : "bg-white text-muted-foreground border"
                  } ${isCurrent ? "ring-2 ring-[#F97316] ring-offset-2" : ""}`}
                >
                  {status === "new" && <ShoppingCart className="h-4 w-4" />}
                  {status === "confirmed" && <CheckCircle2 className="h-4 w-4" />}
                  {status === "packed" && <Package className="h-4 w-4" />}
                  {status === "ready" && <Truck className="h-4 w-4" />}
                </div>
                <span className="text-xs mt-2 capitalize font-medium">{status}</span>
              </div>
              {index < STATUS_FLOW.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 ${
                    STATUS_FLOW.indexOf(order.status) > index ? "bg-[#F97316]" : "bg-border"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Customer Info */}
      <div className="space-y-3">
        <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Customer Details</h4>
        <div className="bg-[#FDF8F3] rounded-xl p-4 space-y-3">
          <p className="font-medium">{order.customer_name}</p>
          {order.customer_phone && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-[#F97316]" />
              {order.customer_phone}
            </p>
          )}
          {order.customer_address && (
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-[#F97316] mt-0.5" />
              {order.customer_address}
            </p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-3">
        <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Order Items</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#FDF8F3] rounded-xl">
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  ₹{item.price} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold text-[#F97316]">₹{Number(order.total_amount).toLocaleString()}</span>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="space-y-2">
          <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Notes</h4>
          <p className="text-sm bg-[#FDF8F3] p-4 rounded-xl">{order.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {nextStatus && (
          <Button
            className="flex-1 bg-[#F97316] hover:bg-[#EA580C] h-12 rounded-xl"
            disabled={isUpdating}
            onClick={() => onStatusChange(order.id, nextStatus)}
          >
            {isUpdating ? "Updating..." : `Mark as ${nextStatus}`}
          </Button>
        )}
        {order.status !== "cancelled" && order.status !== "delivered" && (
          <Button
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/10 bg-white h-12 rounded-xl"
            disabled={isUpdating}
            onClick={() => onStatusChange(order.id, "cancelled")}
          >
            Cancel
          </Button>
        )}
        {order.status === "ready" && (
          <Button
            className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] h-12 rounded-xl"
            disabled={isUpdating}
            onClick={() => onStatusChange(order.id, "delivered")}
          >
            {isUpdating ? "Updating..." : "Mark Delivered"}
          </Button>
        )}
      </div>
    </div>
  )
}

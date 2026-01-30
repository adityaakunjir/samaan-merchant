"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ordersAPI } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  FileText,
  CheckCircle,
  Package,
  Truck,
  XCircle,
  Bell,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Order, OrderStatus } from "@/lib/types"

interface OrderDetailProps {
  order: Order
}

const statusConfig: Record<OrderStatus, { icon: typeof Bell; color: string; label: string }> = {
  "Placed": { icon: Bell, color: "bg-blue-100 text-blue-700", label: "New Order" },
  "Confirmed": { icon: CheckCircle, color: "bg-yellow-100 text-yellow-700", label: "Confirmed" },
  "Preparing": { icon: Package, color: "bg-purple-100 text-purple-700", label: "Preparing" },
  "Out for Delivery": { icon: Truck, color: "bg-green-100 text-green-700", label: "Out for Delivery" },
  "Delivered": { icon: CheckCircle, color: "bg-gray-100 text-gray-600", label: "Delivered" },
  "Cancelled": { icon: XCircle, color: "bg-red-100 text-red-700", label: "Cancelled" },
}

// Map API status values to OrderStatus values
const statusMap: Record<string, OrderStatus> = {
  "new": "Placed",
  "placed": "Placed",
  "confirmed": "Confirmed",
  "packed": "Preparing",
  "preparing": "Preparing",
  "ready": "Out for Delivery",
  "out for delivery": "Out for Delivery",
  "delivered": "Delivered",
  "cancelled": "Cancelled",
}

const normalizeStatus = (status: string): OrderStatus => {
  const lowerStatus = status?.toLowerCase() || "placed"
  return statusMap[lowerStatus] || (status as OrderStatus) || "Placed"
}

const statusFlow: OrderStatus[] = ["Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered"]

export function OrderDetail({ order: initialOrder }: OrderDetailProps) {
  const [order, setOrder] = useState(initialOrder)
  const [updating, setUpdating] = useState(false)
  const [internalNote, setInternalNote] = useState("")
  const [addingNote, setAddingNote] = useState(false)
  const router = useRouter()

  const normalizedStatus = normalizeStatus(order.status as string)
  const config = statusConfig[normalizedStatus] || statusConfig["Placed"]
  const StatusIcon = config.icon
  const currentIndex = statusFlow.indexOf(normalizedStatus)

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)

    try {
      await ordersAPI.updateStatus(order.id, newStatus)
      setOrder((prev) => ({ ...prev, status: newStatus as OrderStatus }))
      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdating(false)
    }
  }

  const addNote = async () => {
    if (!internalNote.trim()) return
    setAddingNote(true)

    // For now, update locally
    const existingNotes = order.deliveryInstructions || ""
    const newNotes = existingNotes
      ? `${existingNotes}\n[${new Date().toLocaleString()}] ${internalNote}`
      : `[${new Date().toLocaleString()}] ${internalNote}`

    setOrder((prev) => ({ ...prev, deliveryInstructions: newNotes }))
    setInternalNote("")
    setAddingNote(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/merchant/orders" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4" />
            {order.createdAt ? new Date(order.createdAt.endsWith("Z") ? order.createdAt : `${order.createdAt}Z`).toLocaleString() : 'Invalid Date'}
          </p>
        </div>
        <Badge className={cn("rounded-full text-sm px-3 py-1", config.color)}>
          <StatusIcon className="w-4 h-4 mr-1" />
          {config.label}
        </Badge>
      </div>

      {/* Status Timeline */}
      {order.status !== "Cancelled" && (
        <Card className="p-4 bg-white rounded-2xl border-0 shadow-sm">
          <div className="flex items-center justify-between">
            {statusFlow.map((status, index) => {
              const isCompleted = index <= currentIndex
              const isCurrent = index === currentIndex
              const StatusIconItem = statusConfig[status].icon

              return (
                <div key={status} className="flex-1 flex flex-col items-center relative">
                  {index < statusFlow.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-5 left-1/2 w-full h-0.5",
                        index < currentIndex ? "bg-[#FF7F32]" : "bg-gray-200",
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all",
                      isCompleted ? "bg-[#FF7F32] text-white" : "bg-gray-100 text-gray-400",
                      isCurrent && "ring-4 ring-[#FF7F32]/20",
                    )}
                  >
                    <StatusIconItem className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-2 font-medium capitalize",
                      isCompleted ? "text-[#FF7F32]" : "text-gray-400",
                    )}
                  >
                    {status}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Customer Info */}
      <Card className="p-6 bg-white rounded-2xl border-0 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
        <div className="space-y-3">
          <p className="font-medium text-gray-900 text-lg">{order.customer?.fullName || 'Unknown Customer'}</p>
          {order.customer?.phone && (
            <a
              href={`tel:${order.customer.phone}`}
              className="flex items-center gap-3 text-gray-600 hover:text-[#FF7F32]"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              {order.customer.phone}
            </a>
          )}
          {order.deliveryAddress && (
            <div className="flex items-start gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="pt-2">{order.deliveryAddress}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Order Items */}
      <Card className="p-6 bg-white rounded-2xl border-0 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{item.productName || item.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.unitPrice || item.price} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-gray-900">₹{item.total || ((item.unitPrice || item.price) * item.quantity).toFixed(0)}</p>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
            <p className="font-bold text-lg text-gray-900">Total</p>
            <p className="font-bold text-xl text-[#FF7F32]">₹{Number(order.grandTotal || 0).toFixed(0)}</p>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-6 bg-white rounded-2xl border-0 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Notes
        </h3>
        {order.deliveryInstructions && (
          <div className="bg-yellow-50 rounded-xl p-4 mb-4 whitespace-pre-line text-sm text-gray-700">
            {order.deliveryInstructions}
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Add internal note..."
            className="rounded-xl border-gray-200 min-h-[80px]"
          />
        </div>
        <Button
          onClick={addNote}
          disabled={addingNote || !internalNote.trim()}
          className="mt-2 bg-[#FF7F32] hover:bg-[#e66a20] text-white rounded-xl"
        >
          {addingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Note"}
        </Button>
      </Card>

      {/* Actions */}
      {order.status !== "Delivered" && order.status !== "Cancelled" && (
        <Card className="p-6 bg-white rounded-2xl border-0 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-3">
            {currentIndex < statusFlow.length - 1 && (
              <Button
                onClick={() => updateStatus(statusFlow[currentIndex + 1])}
                disabled={updating}
                className="flex-1 h-12 bg-[#FF7F32] hover:bg-[#e66a20] text-white rounded-xl"
              >
                {updating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  `Mark as ${statusConfig[statusFlow[currentIndex + 1]].label}`
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => updateStatus("Cancelled")}
              disabled={updating}
              className="h-12 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Cancel Order
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

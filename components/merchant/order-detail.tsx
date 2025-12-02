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
import type { Order } from "@/lib/types"

interface OrderDetailProps {
  order: Order
}

const statusConfig = {
  new: { icon: Bell, color: "bg-blue-100 text-blue-700", label: "New Order" },
  confirmed: { icon: CheckCircle, color: "bg-yellow-100 text-yellow-700", label: "Confirmed" },
  packed: { icon: Package, color: "bg-purple-100 text-purple-700", label: "Packed" },
  ready: { icon: Truck, color: "bg-green-100 text-green-700", label: "Ready for Pickup" },
  delivered: { icon: CheckCircle, color: "bg-gray-100 text-gray-600", label: "Delivered" },
  cancelled: { icon: XCircle, color: "bg-red-100 text-red-700", label: "Cancelled" },
}

const statusFlow = ["new", "confirmed", "packed", "ready", "delivered"]

export function OrderDetail({ order: initialOrder }: OrderDetailProps) {
  const [order, setOrder] = useState(initialOrder)
  const [updating, setUpdating] = useState(false)
  const [internalNote, setInternalNote] = useState("")
  const [addingNote, setAddingNote] = useState(false)
  const router = useRouter()

  const config = statusConfig[order.status]
  const StatusIcon = config.icon
  const currentIndex = statusFlow.indexOf(order.status)

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)

    try {
      await ordersAPI.updateStatus(order.id, newStatus)
      setOrder((prev) => ({ ...prev, status: newStatus as Order["status"] }))
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
    const existingNotes = order.notes || ""
    const newNotes = existingNotes
      ? `${existingNotes}\n[${new Date().toLocaleString()}] ${internalNote}`
      : `[${new Date().toLocaleString()}] ${internalNote}`

    setOrder((prev) => ({ ...prev, notes: newNotes }))
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
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <Badge className={cn("rounded-full text-sm px-3 py-1", config.color)}>
          <StatusIcon className="w-4 h-4 mr-1" />
          {config.label}
        </Badge>
      </div>

      {/* Status Timeline */}
      {order.status !== "cancelled" && (
        <Card className="p-4 bg-white rounded-2xl border-0 shadow-sm">
          <div className="flex items-center justify-between">
            {statusFlow.map((status, index) => {
              const isCompleted = index <= currentIndex
              const isCurrent = index === currentIndex
              const StatusIconItem = statusConfig[status as keyof typeof statusConfig].icon

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
          <p className="font-medium text-gray-900 text-lg">{order.customer_name}</p>
          {order.customer_phone && (
            <a
              href={`tel:${order.customer_phone}`}
              className="flex items-center gap-3 text-gray-600 hover:text-[#FF7F32]"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              {order.customer_phone}
            </a>
          )}
          {order.customer_address && (
            <div className="flex items-start gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="pt-2">{order.customer_address}</span>
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
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.price} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
            <p className="font-bold text-lg text-gray-900">Total</p>
            <p className="font-bold text-xl text-[#FF7F32]">₹{Number(order.total_amount).toFixed(0)}</p>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-6 bg-white rounded-2xl border-0 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Notes
        </h3>
        {order.notes && (
          <div className="bg-yellow-50 rounded-xl p-4 mb-4 whitespace-pre-line text-sm text-gray-700">
            {order.notes}
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
      {order.status !== "delivered" && order.status !== "cancelled" && (
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
                  `Mark as ${statusConfig[statusFlow[currentIndex + 1] as keyof typeof statusConfig].label}`
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => updateStatus("cancelled")}
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

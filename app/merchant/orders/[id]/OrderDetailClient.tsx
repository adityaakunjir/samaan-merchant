"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ordersAPI } from "@/lib/api/client"
import { OrderDetail } from "@/components/merchant/order-detail"
import { Loader2, Package, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Order } from "@/lib/types"

export default function OrderDetailClient() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState<Order | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [orderId, setOrderId] = useState<string | null>(null)

    useEffect(() => {
        // Extract order ID from the actual URL pathname
        // Azure SWA rewrites /merchant/orders/* to /merchant/orders/_fallback.html
        // but the browser URL still shows the actual order ID
        // useParams() returns '_fallback' because it reads from the served HTML path
        const extractOrderId = () => {
            if (typeof window === 'undefined') return null

            const pathname = window.location.pathname
            // Match pattern: /merchant/orders/{uuid}
            const match = pathname.match(/\/merchant\/orders\/([a-f0-9-]+)/i)
            if (match && match[1] && match[1] !== '_fallback') {
                return match[1]
            }
            return null
        }

        const id = extractOrderId()
        setOrderId(id)

        if (!id) {
            setError("Invalid order ID")
            setLoading(false)
            return
        }

        const loadData = async () => {
            try {
                console.log("[OrderDetail] Fetching order with ID:", id)
                const orderData = await ordersAPI.getById(id)
                if (!orderData) {
                    setError("Order not found")
                    return
                }
                setOrder(orderData)
            } catch (error: any) {
                console.error("Error loading order:", error)
                if (error.status === 401) {
                    // Only redirect if explicitly unauthorized by backend
                    router.push("/merchant/login")
                    return
                }
                setError(error.message || "Failed to load order")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
                    <p className="text-gray-600 mb-8">
                        {error || "This order doesn't exist or may have been removed."}
                    </p>
                    <Button
                        asChild
                        className="bg-gradient-to-r from-[#FF7F32] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d95513] text-white rounded-xl"
                    >
                        <Link href="/merchant/orders">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            View All Orders
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
            <OrderDetail order={order} />
        </div>
    )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter, notFound, useParams } from "next/navigation"
import { authAPI, ordersAPI } from "@/lib/api/client"
import { OrderDetail } from "@/components/merchant/order-detail"
import { Loader2 } from "lucide-react"
import type { Order } from "@/lib/types"

export default function OrderDetailClient() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState<Order | null>(null)

    useEffect(() => {
        return
    }
                    setOrder(orderData)
                } catch (error: any) {
    console.error("Error loading order:", error)
    if (error.status === 401) {
        // Only redirect if explicitly unauthorized by backend
        router.push("/merchant/login")
    } else {
        notFound()
    }
} finally {
    setLoading(false)
}
            }

loadData()
        }, [id, router])

if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
        </div>
    )
}

if (!order) {
    return notFound()
}

return (
    <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
        <OrderDetail order={order} />
    </div>
)
    }

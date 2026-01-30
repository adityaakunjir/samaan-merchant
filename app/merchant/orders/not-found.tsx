"use client"

import Link from "next/link"
import { Package, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderNotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
                <p className="text-gray-600 mb-8">
                    This order doesn't exist or may have been removed. Please check the order ID and try again.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        asChild
                        variant="outline"
                        className="rounded-xl"
                    >
                        <Link href="/merchant/orders">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            View All Orders
                        </Link>
                    </Button>
                    <Button
                        asChild
                        className="bg-gradient-to-r from-[#FF7F32] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d95513] text-white rounded-xl"
                    >
                        <Link href="/merchant">
                            <Search className="w-4 h-4 mr-2" />
                            Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

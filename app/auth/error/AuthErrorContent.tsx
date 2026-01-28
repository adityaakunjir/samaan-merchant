"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"

export default function AuthErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    return (
        <div className="min-h-screen bg-[#FDF8F3] flex flex-col">
            {/* Header */}
            <div className="p-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-foreground hover:text-[#F97316] transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    {/* Error Icon */}
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>

                    <h1 className="text-3xl font-bold text-foreground mb-3">Something went wrong</h1>
                    <p className="text-muted-foreground mb-8">
                        {error || "An unspecified error occurred during authentication."}
                    </p>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <Link href="/auth/login">
                            <Button className="bg-[#F97316] hover:bg-[#EA580C] h-12 px-8 rounded-xl w-full">Try again</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

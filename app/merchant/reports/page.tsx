"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/api/client"
import { TrendingUp, BarChart3, PieChart, Calendar, ArrowUpRight, Loader2, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MerchantReportsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push("/merchant/login")
      return
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF7F32] mx-auto" />
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  const upcomingFeatures = [
    {
      icon: BarChart3,
      title: "Sales Analytics",
      description: "Track daily, weekly, and monthly sales performance with detailed breakdowns",
    },
    {
      icon: PieChart,
      title: "Product Insights",
      description: "Discover your top-selling products and inventory turnover rates",
    },
    {
      icon: TrendingUp,
      title: "Revenue Trends",
      description: "Visualize revenue growth and identify seasonal patterns",
    },
    {
      icon: Calendar,
      title: "Order History",
      description: "Export detailed order reports for accounting and analysis",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 mt-1">Insights and analytics for your business</p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Coming Soon
                </span>
              </div>
              <p className="text-gray-600 max-w-xl">
                We're building powerful analytics tools to help you understand your business better. Get insights into
                sales trends, customer behavior, and product performance.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-100 bg-transparent"
              disabled
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Notify Me
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription className="mt-1">{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Placeholder Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-gray-500">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
              <div className="text-center text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-gray-500">Product Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
              <div className="text-center text-gray-400">
                <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

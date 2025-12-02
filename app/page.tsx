import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Store,
  Package,
  ShoppingCart,
  BarChart3,
  Clock,
  Shield,
  ArrowRight,
  Star,
  Users,
  Zap,
  ChevronRight,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <header className="glass sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/images/samaan-logo.png"
              alt="Samaan"
              width={120}
              height={32}
              className="h-7 sm:h-9 w-auto object-contain"
            />
            <span className="text-[#FF7F32] font-semibold text-base sm:text-lg hidden sm:inline">Merchant</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/merchant/login">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-[#FF7F32] text-sm sm:text-base px-2 sm:px-4 h-9 sm:h-10 rounded-xl"
              >
                Login
              </Button>
            </Link>
            <Link href="/merchant/signup">
              <Button className="bg-gradient-to-r from-[#FF7F32] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d95513] rounded-xl text-xs sm:text-base px-3 sm:px-5 h-9 sm:h-10 shadow-lg shadow-orange-100 whitespace-nowrap">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7F32]/10 to-[#FF7F32]/5 text-[#FF7F32] px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-fade-in">
            <Store className="h-4 w-4" />
            For Kirana Shop Owners
            <span className="bg-[#FF7F32] text-white text-xs px-2 py-0.5 rounded-full ml-1">FREE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance leading-tight animate-slide-up">
            Grow Your Kirana Shop with{" "}
            <span className="bg-gradient-to-r from-[#FF7F32] to-[#ea580c] bg-clip-text text-transparent">Samaan</span>
          </h1>
          <p
            className="text-base sm:text-lg text-gray-600 mb-8 text-pretty max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Join thousands of local merchants reaching more customers. Manage your inventory, track orders, and grow
            your business - all from one simple dashboard.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link href="/merchant/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#FF7F32] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d95513] w-full sm:w-auto h-14 px-8 rounded-xl text-base font-semibold shadow-xl shadow-orange-100 touch-active"
              >
                Start Selling Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/merchant/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 rounded-xl text-base font-medium bg-white border-gray-200 hover:bg-gray-50 touch-active"
              >
                I already have an account
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="ml-2">
              Trusted by <strong className="text-gray-900">5,000+</strong> merchants
            </span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
          <div className="text-center p-4 bg-white rounded-2xl shadow-sm card-hover">
            <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-[#FF7F32] to-[#ea580c] bg-clip-text text-transparent">
              5K+
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Active Merchants</p>
          </div>
          <div className="text-center p-4 bg-white rounded-2xl shadow-sm card-hover">
            <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              50K+
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Daily Orders</p>
          </div>
          <div className="text-center p-4 bg-white rounded-2xl shadow-sm card-hover">
            <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              ₹10Cr
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Monthly Sales</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Everything you need to run your shop
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Simple, powerful tools designed for local Kirana stores
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 stagger-children">
          <FeatureCard
            icon={<Store className="h-6 w-6 sm:h-7 sm:w-7" />}
            title="Shop Profile"
            description="Set up your store with name, address, hours, and logo"
            color="orange"
          />
          <FeatureCard
            icon={<Package className="h-6 w-6 sm:h-7 sm:w-7" />}
            title="Inventory"
            description="Add products, update prices, and manage stock levels"
            color="blue"
          />
          <FeatureCard
            icon={<ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" />}
            title="Orders"
            description="View and manage orders from new to delivered"
            color="green"
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6 sm:h-7 sm:w-7" />}
            title="Analytics"
            description="Track sales, orders, and get low-stock alerts"
            color="purple"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
                <Zap className="h-4 w-4" />
                Why merchants love us
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Grow your business with Samaan</h2>
              <div className="space-y-5">
                <BenefitItem
                  icon={<Clock className="h-5 w-5" />}
                  title="Quick Setup"
                  description="Get your shop online in under 5 minutes"
                  color="orange"
                />
                <BenefitItem
                  icon={<Users className="h-5 w-5" />}
                  title="Reach More Customers"
                  description="Connect with buyers in your neighborhood"
                  color="green"
                />
                <BenefitItem
                  icon={<Shield className="h-5 w-5" />}
                  title="Secure Payments"
                  description="Get paid directly to your bank account"
                  color="blue"
                />
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#FDF8F3] to-orange-50 rounded-2xl p-6 sm:p-8 text-center">
                <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#FF7F32] to-[#ea580c] bg-clip-text text-transparent mb-2">
                  40%
                </div>
                <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Average increase in orders</p>
                <p className="text-gray-600 text-sm">for merchants in their first month</p>
                <div className="flex justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Rated 4.9/5 by merchants</p>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#FF7F32]/20 to-transparent rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Get started in 3 easy steps</h2>
          <p className="text-gray-600 text-sm sm:text-base">Start selling to customers in your area today</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <StepCard step={1} title="Create Account" description="Sign up with your phone or email in seconds" />
          <StepCard step={2} title="Set Up Shop" description="Add your shop details, logo, and delivery time" />
          <StepCard step={3} title="Add Products" description="List your products and start receiving orders" />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="bg-gradient-to-br from-[#FF7F32] to-[#ea580c] rounded-3xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden">
          {/* Cross pattern */}
          <div className="absolute inset-0 cross-pattern opacity-30" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Ready to grow your business?</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Join thousands of local merchants who are already using Samaan to reach more customers.
            </p>
            <Link href="/merchant/signup">
              <Button
                size="lg"
                className="bg-white text-[#FF7F32] hover:bg-white/90 h-14 px-8 rounded-xl text-base font-semibold shadow-xl touch-active"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-white/70 text-sm mt-4">No credit card required • Free forever</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/samaan-logo.png"
                alt="Samaan"
                width={100}
                height={28}
                className="h-7 w-auto object-contain"
              />
              <span className="text-[#FF7F32] font-medium">Merchant</span>
            </div>
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Samaan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color = "orange",
}: {
  icon: React.ReactNode
  title: string
  description: string
  color?: "orange" | "blue" | "green" | "purple"
}) {
  const colors = {
    orange: "bg-gradient-to-br from-[#FF7F32]/10 to-[#FF7F32]/5 text-[#FF7F32]",
    blue: "bg-gradient-to-br from-blue-500/10 to-blue-500/5 text-blue-500",
    green: "bg-gradient-to-br from-green-500/10 to-green-500/5 text-green-500",
    purple: "bg-gradient-to-br from-purple-500/10 to-purple-500/5 text-purple-500",
  }

  return (
    <div className="bg-white rounded-2xl border-0 p-4 sm:p-6 card-hover shadow-sm group">
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 ${colors[color]} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1 sm:mb-2">{title}</h3>
      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function BenefitItem({
  icon,
  title,
  description,
  color = "orange",
}: {
  icon: React.ReactNode
  title: string
  description: string
  color?: "orange" | "blue" | "green"
}) {
  const colors = {
    orange: "bg-[#FF7F32]/10 text-[#FF7F32]",
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
  }

  return (
    <div className="flex gap-4 group">
      <div
        className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  )
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number
  title: string
  description: string
}) {
  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-sm card-hover text-center">
      <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F32] to-[#ea580c] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg shadow-orange-100">
        {step}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      {step < 3 && (
        <ChevronRight className="hidden sm:block absolute top-1/2 -right-3 w-6 h-6 text-gray-300 -translate-y-1/2" />
      )}
    </div>
  )
}

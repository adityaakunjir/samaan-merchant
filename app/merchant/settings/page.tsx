import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Settings, User, Bell, Shield, HelpCircle, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/merchant/login")
  }

  const { data: merchant } = await supabase.from("merchants").select("*").eq("id", user.id).single()

  return (
    <div className="max-w-2xl mx-auto pb-24 lg:pb-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF7F32] to-[#ea580c] rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      <div className="space-y-4">
        {/* Account Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Account</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <SettingsItem
              icon={<User className="w-5 h-5" />}
              title="Profile Information"
              description={user.email || "Manage your account details"}
              href="/merchant/shop"
            />
            <SettingsItem
              icon={<Bell className="w-5 h-5" />}
              title="Notifications"
              description="Order alerts and updates"
              href="/merchant/notifications"
            />
            <SettingsItem
              icon={<Shield className="w-5 h-5" />}
              title="Security"
              description="Password and authentication"
              href="#"
              disabled
              badge="Soon"
            />
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Support</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <SettingsItem
              icon={<HelpCircle className="w-5 h-5" />}
              title="Help Center"
              description="FAQs and support articles"
              href="#"
              external
            />
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="text-center">
            <p className="text-sm text-gray-500">Samaan Merchant</p>
            <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsItem({
  icon,
  title,
  description,
  href,
  external,
  disabled,
  badge,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  external?: boolean
  disabled?: boolean
  badge?: string
}) {
  const content = (
    <div
      className={`flex items-center gap-4 px-5 py-4 transition-colors ${disabled ? "opacity-60" : "hover:bg-gray-50 active:bg-gray-100"}`}
    >
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900">{title}</p>
          {badge && (
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{description}</p>
      </div>
      {external ? (
        <ExternalLink className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </div>
  )

  if (disabled) {
    return <div className="cursor-not-allowed">{content}</div>
  }

  return (
    <Link href={href} className="block touch-active">
      {content}
    </Link>
  )
}

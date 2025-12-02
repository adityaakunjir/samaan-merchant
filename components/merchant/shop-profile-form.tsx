"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Loader2, Store, Clock, Camera, Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Merchant } from "@/lib/types"

interface ShopProfileFormProps {
  merchant: Merchant | null
}

export function ShopProfileForm({ merchant }: ShopProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    shop_name: merchant?.shop_name || "",
    address: merchant?.address || "",
    phone: merchant?.phone || "",
    eta_minutes: merchant?.eta_minutes || 30,
    is_open: merchant?.is_open || false,
    logo_url: merchant?.logo_url || "",
  })
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (merchant) {
      setFormData({
        shop_name: merchant.shop_name || "",
        address: merchant.address || "",
        phone: merchant.phone || "",
        eta_minutes: merchant.eta_minutes || 30,
        is_open: merchant.is_open || false,
        logo_url: merchant.logo_url || "",
      })
    }
  }, [merchant])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setUploading(true)
    try {
      // For now, create a local URL - in production, upload to your server
      const localUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, logo_url: localUrl }))
      // Note: For production, implement file upload to your .NET API
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = {
        shopName: formData.shop_name,
        address: formData.address,
        phone: formData.phone,
        etaMinutes: formData.eta_minutes,
        isOpen: formData.is_open,
        logoUrl: formData.logo_url,
      }

      console.log("[v0] Updating merchant profile:", updateData)

      if (!merchant?.id) {
        throw new Error("Merchant ID not found")
      }

      await api.merchants.update(merchant.id, updateData)

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error: any) {
      alert(`Failed to update profile: ${error.message}`)
      console.error("[v0] Profile update error:", error)
    }

    setLoading(false)
  }

  const etaPresets = [15, 20, 30, 45, 60]

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-6 transition-opacity duration-500", mounted ? "opacity-100" : "opacity-0")}
    >
      <Card className="p-5 sm:p-6 bg-white rounded-2xl border-0 shadow-sm card-hover">
        <Label className="text-base font-semibold text-gray-900 mb-4 block">Shop Logo</Label>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div
              className={cn(
                "w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden flex items-center justify-center transition-all",
                uploading && "animate-pulse",
              )}
            >
              {formData.logo_url ? (
                <img
                  src={formData.logo_url || "/placeholder.svg"}
                  alt="Shop logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store className="w-12 h-12 text-gray-300" />
              )}
            </div>
            <label
              className={cn(
                "absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#FF7F32] to-[#ea580c] rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-orange-100 transition-transform hover:scale-110 touch-active",
                uploading && "pointer-events-none opacity-70",
              )}
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="sr-only"
                disabled={uploading}
              />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-gray-700 font-medium">Upload your shop logo</p>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
            {uploading && (
              <p className="text-[#FF7F32] mt-2 flex items-center gap-2 justify-center sm:justify-start text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6 bg-white rounded-2xl border-0 shadow-sm space-y-5">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Store className="w-5 h-5 text-[#FF7F32]" />
          Shop Details
        </h3>

        <div className="space-y-2">
          <Label htmlFor="shop_name" className="text-gray-700 text-sm font-medium">
            Shop Name *
          </Label>
          <Input
            id="shop_name"
            value={formData.shop_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, shop_name: e.target.value }))}
            placeholder="Enter your shop name"
            className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-gray-700 text-sm font-medium">
            Shop Address
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="Enter your shop address"
            className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">
            Phone Number
          </Label>
          <div className="flex">
            <div className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 font-medium">
              +91
            </div>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))
              }
              placeholder="Enter 10-digit number"
              className="rounded-l-none rounded-r-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
            />
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6 bg-white rounded-2xl border-0 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF7F32]" />
            Delivery Time
          </h3>
          <span className="text-sm text-gray-500">
            Currently: <span className="font-semibold text-gray-900">{formData.eta_minutes} mins</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {etaPresets.map((eta) => (
            <button
              key={eta}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, eta_minutes: eta }))}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium transition-all touch-active",
                formData.eta_minutes === eta
                  ? "bg-gradient-to-r from-[#FF7F32] to-[#ea580c] text-white shadow-lg shadow-orange-100"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {eta} min
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Label htmlFor="eta" className="text-sm text-gray-600 whitespace-nowrap">
            Custom:
          </Label>
          <Input
            id="eta"
            type="number"
            min="5"
            max="120"
            value={formData.eta_minutes}
            onChange={(e) => setFormData((prev) => ({ ...prev, eta_minutes: Number.parseInt(e.target.value) || 30 }))}
            className="rounded-xl border-gray-200 h-10 w-24 text-center text-base"
          />
          <span className="text-sm text-gray-500">minutes</span>
        </div>
      </Card>

      <Card
        className={cn(
          "p-5 sm:p-6 rounded-2xl border-0 shadow-sm transition-all",
          formData.is_open ? "bg-gradient-to-br from-green-50 to-white border border-green-100" : "bg-white",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                formData.is_open ? "bg-green-100" : "bg-gray-100",
              )}
            >
              {formData.is_open ? (
                <Sparkles className="w-6 h-6 text-green-600" />
              ) : (
                <Store className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <Label className="text-base font-semibold text-gray-900 block">Shop Status</Label>
              <p className={cn("text-sm mt-0.5 font-medium", formData.is_open ? "text-green-600" : "text-gray-500")}>
                {formData.is_open ? "Your shop is open and accepting orders" : "Your shop is currently closed"}
              </p>
            </div>
          </div>
          <Switch
            checked={formData.is_open}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_open: checked }))}
            className="data-[state=checked]:bg-green-500 scale-110"
          />
        </div>
      </Card>

      <Button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full h-14 rounded-xl text-base font-semibold shadow-lg transition-all touch-active",
          saved
            ? "bg-green-500 hover:bg-green-600 shadow-green-100"
            : "bg-gradient-to-r from-[#FF7F32] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d95513] shadow-orange-100",
        )}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : saved ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Saved Successfully!
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}

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
    shopName: merchant?.shopName || "",
    shopType: merchant?.shopType || "Kirana",
    description: merchant?.description || "",
    shopAddress: merchant?.shopAddress || "",
    city: merchant?.city || "",
    pincode: merchant?.pincode || "",
    phone: "",
    latitude: merchant?.latitude || 0,
    longitude: merchant?.longitude || 0,
    deliveryRadius: merchant?.deliveryRadius || 5,
    minOrderAmount: merchant?.minOrderAmount || 0,
    deliveryFee: merchant?.deliveryFee || 0,
    isOpen: merchant?.isOpen ?? true,
    openTime: merchant?.openTime || "09:00",
    closeTime: merchant?.closeTime || "21:00",
  })
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (merchant) {
      setFormData({
        shopName: merchant.shopName || "",
        shopType: merchant.shopType || "Kirana",
        description: merchant.description || "",
        shopAddress: merchant.shopAddress || "",
        city: merchant.city || "",
        pincode: merchant.pincode || "",
        phone: "",
        latitude: merchant.latitude || 0,
        longitude: merchant.longitude || 0,
        deliveryRadius: merchant.deliveryRadius || 5,
        minOrderAmount: merchant.minOrderAmount || 0,
        deliveryFee: merchant.deliveryFee || 0,
        isOpen: merchant.isOpen ?? true,
        openTime: merchant.openTime || "09:00",
        closeTime: merchant.closeTime || "21:00",
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
      // TODO: Implement actual file upload to your .NET backend
      alert("Image upload will be available soon")
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
        id: merchant?.id,
        userId: merchant?.userId,
        shopName: formData.shopName,
        shopType: formData.shopType,
        description: formData.description,
        shopAddress: formData.shopAddress,
        city: formData.city,
        pincode: formData.pincode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        deliveryRadius: formData.deliveryRadius,
        minOrderAmount: formData.minOrderAmount,
        deliveryFee: formData.deliveryFee,
        isOpen: formData.isOpen,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        rating: merchant?.rating || 0,
        totalOrders: merchant?.totalOrders || 0,
        isVerified: merchant?.isVerified || false,
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

  const deliveryTimePresets = [15, 20, 30, 45, 60]

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
              <Store className="w-12 h-12 text-gray-300" />
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
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6 bg-white rounded-2xl border-0 shadow-sm space-y-5">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Store className="w-5 h-5 text-[#FF7F32]" />
          Shop Details
        </h3>

        <div className="space-y-2">
          <Label htmlFor="shopName" className="text-gray-700 text-sm font-medium">
            Shop Name *
          </Label>
          <Input
            id="shopName"
            value={formData.shopName}
            onChange={(e) => setFormData((prev) => ({ ...prev, shopName: e.target.value }))}
            placeholder="Enter your shop name"
            className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shopAddress" className="text-gray-700 text-sm font-medium">
            Shop Address
          </Label>
          <Input
            id="shopAddress"
            value={formData.shopAddress}
            onChange={(e) => setFormData((prev) => ({ ...prev, shopAddress: e.target.value }))}
            placeholder="Enter your shop address"
            className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-gray-700 text-sm font-medium">
              City
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
              placeholder="City"
              className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode" className="text-gray-700 text-sm font-medium">
              Pincode
            </Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => setFormData((prev) => ({ ...prev, pincode: e.target.value }))}
              placeholder="Pincode"
              className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-700 text-sm font-medium">
            Description
          </Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of your shop"
            className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
          />
        </div>
      </Card>

      <Card className="p-5 sm:p-6 bg-white rounded-2xl border-0 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#FF7F32]" />
          Delivery Settings
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryRadius" className="text-gray-700 text-sm font-medium">
              Delivery Radius (km)
            </Label>
            <Input
              id="deliveryRadius"
              type="number"
              min="1"
              value={formData.deliveryRadius}
              onChange={(e) => setFormData((prev) => ({ ...prev, deliveryRadius: Number(e.target.value) }))}
              className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryFee" className="text-gray-700 text-sm font-medium">
              Delivery Fee (₹)
            </Label>
            <Input
              id="deliveryFee"
              type="number"
              min="0"
              value={formData.deliveryFee}
              onChange={(e) => setFormData((prev) => ({ ...prev, deliveryFee: Number(e.target.value) }))}
              className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minOrderAmount" className="text-gray-700 text-sm font-medium">
            Minimum Order Amount (₹)
          </Label>
          <Input
            id="minOrderAmount"
            type="number"
            min="0"
            value={formData.minOrderAmount}
            onChange={(e) => setFormData((prev) => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
            className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="openTime" className="text-gray-700 text-sm font-medium">
              Opening Time
            </Label>
            <Input
              id="openTime"
              type="time"
              value={formData.openTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, openTime: e.target.value }))}
              className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="closeTime" className="text-gray-700 text-sm font-medium">
              Closing Time
            </Label>
            <Input
              id="closeTime"
              type="time"
              value={formData.closeTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, closeTime: e.target.value }))}
              className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
            />
          </div>
        </div>
      </Card>

      <Card
        className={cn(
          "p-5 sm:p-6 rounded-2xl border-0 shadow-sm transition-all",
          formData.isOpen ? "bg-gradient-to-br from-green-50 to-white border border-green-100" : "bg-white",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                formData.isOpen ? "bg-green-100" : "bg-gray-100",
              )}
            >
              {formData.isOpen ? (
                <Sparkles className="w-6 h-6 text-green-600" />
              ) : (
                <Store className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <Label className="text-base font-semibold text-gray-900 block">Shop Status</Label>
              <p className={cn("text-sm mt-0.5 font-medium", formData.isOpen ? "text-green-600" : "text-gray-500")}>
                {formData.isOpen ? "Your shop is open and accepting orders" : "Your shop is currently closed"}
              </p>
            </div>
          </div>
          <Switch
            checked={formData.isOpen}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isOpen: checked }))}
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

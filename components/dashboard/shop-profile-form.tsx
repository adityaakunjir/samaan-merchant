"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Loader2, Store } from "lucide-react"
import type { Merchant } from "@/lib/types"

interface ShopProfileFormProps {
  merchant: Merchant | null
  userId: string
}

export function ShopProfileForm({ merchant, userId }: ShopProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    shop_name: merchant?.shop_name || "",
    address: merchant?.address || "",
    phone: merchant?.phone || "",
    eta_minutes: merchant?.eta_minutes || 30,
    is_open: merchant?.is_open ?? true,
    logo_url: merchant?.logo_url || "",
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(merchant?.logo_url || null)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setUploadingLogo(true)
    setError(null)

    try {
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}/logo.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("merchant-assets")
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("merchant-assets").getPublicUrl(fileName)

      setLogoPreview(urlData.publicUrl)
      setFormData((prev) => ({ ...prev, logo_url: urlData.publicUrl }))
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload logo. Please try again.")
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()

      if (merchant) {
        const { error } = await supabase
          .from("merchants")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (error) throw error
      } else {
        const { error } = await supabase.from("merchants").insert({
          id: userId,
          ...formData,
        })

        if (error) throw error
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      console.error("Save error:", err)
      setError("Failed to save profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-[#F97316]" />
            Shop Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="flex flex-col items-center gap-4 p-6 bg-[#FDF8F3] rounded-xl">
            <div className="relative">
              {logoPreview ? (
                <img
                  src={logoPreview || "/placeholder.svg"}
                  alt="Shop logo"
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-white flex items-center justify-center border-2 border-dashed border-[#F97316]/30">
                  <Camera className="h-10 w-10 text-[#F97316]/50" />
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 p-2.5 bg-[#F97316] text-white rounded-xl cursor-pointer hover:bg-[#EA580C] transition-colors shadow-md">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
                {uploadingLogo ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
              </label>
            </div>
            <p className="text-sm text-muted-foreground">Upload your shop logo (max 5MB)</p>
          </div>

          {/* Shop Name */}
          <div className="space-y-2">
            <Label htmlFor="shop_name" className="text-sm font-medium">
              Shop Name *
            </Label>
            <Input
              id="shop_name"
              value={formData.shop_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, shop_name: e.target.value }))}
              placeholder="My Kirana Store"
              required
              className="h-12 rounded-xl"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Shop address"
              rows={3}
              className="rounded-xl resize-none"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <div className="flex border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F97316] focus-within:border-[#F97316]">
              <div className="px-4 py-3 bg-muted/50 border-r text-muted-foreground font-medium">+91</div>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="98765 43210"
                className="border-0 h-12 focus-visible:ring-0"
              />
            </div>
          </div>

          {/* ETA */}
          <div className="space-y-2">
            <Label htmlFor="eta_minutes" className="text-sm font-medium">
              Estimated Delivery Time (minutes)
            </Label>
            <Input
              id="eta_minutes"
              type="number"
              min={5}
              max={120}
              value={formData.eta_minutes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  eta_minutes: Number.parseInt(e.target.value) || 30,
                }))
              }
              className="h-12 rounded-xl"
            />
          </div>

          {/* Open/Close Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#FDF8F3] rounded-xl">
            <div>
              <Label htmlFor="is_open" className="font-medium">
                Shop Status
              </Label>
              <p className="text-sm text-muted-foreground">
                {formData.is_open ? "Your shop is accepting orders" : "Your shop is closed"}
              </p>
            </div>
            <Switch
              id="is_open"
              checked={formData.is_open}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_open: checked }))}
              className="data-[state=checked]:bg-[#22C55E]"
            />
          </div>

          {/* Messages */}
          {error && <p className="text-sm text-destructive bg-destructive/10 p-4 rounded-xl">{error}</p>}
          {success && (
            <p className="text-sm text-[#22C55E] bg-[#22C55E]/10 p-4 rounded-xl">Profile saved successfully!</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#F97316] hover:bg-[#EA580C] rounded-xl text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : merchant ? (
              "Save Changes"
            ) : (
              "Create Shop Profile"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

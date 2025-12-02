"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { productsAPI } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Loader2, Upload, Package, X, ImageIcon, ArrowLeft, Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  merchantId: string
  product?: Product
}

const CATEGORIES = [
  "Dairy",
  "Vegetables",
  "Fruits",
  "Snacks",
  "Beverages",
  "Bakery",
  "Groceries",
  "Personal Care",
  "Household",
  "Other",
]

export function ProductForm({ merchantId, product }: ProductFormProps) {
  const isEditing = !!product
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    stock: product?.stock?.toString() || "",
    category: product?.category || "",
    image_url: product?.image_url || "",
    is_active: product?.is_active ?? true,
  })
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleImageUpload = async (file: File) => {
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
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image_url: reader.result as string }))
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageUpload(file)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const productData = {
      merchantId: merchantId,
      name: formData.name,
      description: formData.description || null,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      category: formData.category || null,
      imageUrl: formData.image_url || null,
      isActive: formData.is_active,
    }

    console.log("[v0] Submitting product:", productData)

    try {
      if (isEditing && product) {
        await productsAPI.update(product.id, productData)
      } else {
        await productsAPI.create(productData)
      }
      router.push("/merchant/products")
      router.refresh()
    } catch (error: any) {
      alert(`Failed to save product: ${error.message}`)
      console.error("[v0] Product save error:", error)
      setLoading(false)
    }
  }

  return (
    <div className={cn("transition-opacity duration-500", mounted ? "opacity-100" : "opacity-0")}>
      <Link
        href="/merchant/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium touch-active"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-5 sm:p-6 bg-white rounded-2xl border-0 shadow-sm">
          <Label className="text-base font-semibold text-gray-900 mb-4 block">Product Image</Label>

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-2xl transition-all",
              dragOver ? "border-[#FF7F32] bg-orange-50" : "border-gray-200 hover:border-gray-300",
              formData.image_url ? "p-4" : "p-6 sm:p-8",
            )}
          >
            {formData.image_url ? (
              <div className="relative inline-block mx-auto">
                <img
                  src={formData.image_url || "/placeholder.svg"}
                  alt="Product"
                  className="max-w-full max-h-48 sm:max-h-64 rounded-xl object-cover mx-auto"
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg touch-active"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-600 mb-3">Drag and drop an image here, or</p>
                <label>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl bg-white border-gray-200 hover:bg-gray-50 touch-active"
                    asChild
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Browse Files
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="sr-only"
                    disabled={uploading}
                  />
                </label>
                <p className="text-xs text-gray-400 mt-3">JPG, PNG up to 5MB</p>
              </div>
            )}
            {uploading && (
              <div className="flex items-center justify-center gap-2 mt-4 text-[#FF7F32]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Uploading...</span>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5 sm:p-6 bg-white rounded-2xl border-0 shadow-sm space-y-5">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#FF7F32]" />
            Product Details
          </h3>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 text-sm font-medium">
              Product Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
              className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter product description"
              className="rounded-xl border-gray-200 min-h-[100px] text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700 text-sm font-medium">
                Price *
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="rounded-xl border-gray-200 h-12 pl-8 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-gray-700 text-sm font-medium">
                Stock Qty *
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                placeholder="0"
                className="rounded-xl border-gray-200 h-12 text-base focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700 text-sm font-medium">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all touch-active",
                    formData.category === cat
                      ? "bg-gradient-to-r from-[#FF7F32] to-[#ea580c] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="Or type custom category"
              className="rounded-xl border-gray-200 h-11 text-sm focus:border-[#FF7F32] focus:ring-[#FF7F32]/20"
            />
          </div>
        </Card>

        <Card
          className={cn(
            "p-5 sm:p-6 rounded-2xl border-0 shadow-sm transition-all",
            formData.is_active ? "bg-gradient-to-br from-green-50 to-white border border-green-100" : "bg-white",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  formData.is_active ? "bg-green-100" : "bg-gray-100",
                )}
              >
                {formData.is_active ? (
                  <Sparkles className="w-6 h-6 text-green-600" />
                ) : (
                  <Package className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <Label className="text-base font-semibold text-gray-900 block">Product Status</Label>
                <p
                  className={cn("text-sm mt-0.5 font-medium", formData.is_active ? "text-green-600" : "text-gray-500")}
                >
                  {formData.is_active ? "Visible to customers" : "Hidden from customers"}
                </p>
              </div>
            </div>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
              className="data-[state=checked]:bg-green-500 scale-110"
            />
          </div>
        </Card>

        <div className="flex gap-3 sticky bottom-20 lg:bottom-0 bg-[#FDF8F3] py-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:relative sm:bg-transparent">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-14 rounded-xl bg-white border-gray-200 text-gray-700 font-semibold touch-active"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 h-14 bg-gradient-to-r from-[#FF7F32] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d95513] text-white rounded-xl font-semibold shadow-lg shadow-orange-100 touch-active"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                {isEditing ? "Save Changes" : "Add Product"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

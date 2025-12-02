"use client"

import type React from "react"

import { useState } from "react"
import { productsAPI } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Camera, Loader2, Package } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  userId: string
  product?: Product
  onSuccess: () => void
}

export function ProductForm({ userId, product, onSuccess }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    stock: product?.stock?.toString() || "0",
    category: product?.category || "",
    is_active: product?.is_active ?? true,
    image_url: product?.image_url || "",
  })

  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingImage(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData((prev) => ({ ...prev, image_url: reader.result as string }))
        setUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload image. Please try again.")
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.name.trim()) {
      setError("Product name is required")
      setIsLoading(false)
      return
    }

    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price")
      setIsLoading(false)
      return
    }

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock) || 0,
        category: formData.category.trim() || null,
        is_active: formData.is_active,
        image_url: formData.image_url || null,
        merchant_id: userId,
      }

      if (product) {
        await productsAPI.update(product.id, productData)
      } else {
        await productsAPI.create(productData)
      }

      onSuccess()
    } catch (err) {
      console.error("Save error:", err)
      setError("Failed to save product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {imagePreview ? (
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Product"
              className="w-32 h-32 rounded-xl object-cover border-2 border-muted"
            />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <label className="absolute -bottom-2 -right-2 p-2 bg-[#F97316] text-white rounded-full cursor-pointer hover:bg-[#EA580C] transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
            {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </label>
        </div>
        <p className="text-sm text-muted-foreground">Upload product image (max 5MB)</p>
      </div>

      {/* Product Name */}
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Basmati Rice 1kg"
          required
          className="h-11"
        />
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Product description..."
          rows={3}
        />
      </div>

      {/* Price and Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="0.00"
            required
            className="h-11"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
            placeholder="0"
            className="h-11"
          />
        </div>
      </div>

      {/* Category */}
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
          placeholder="e.g., Groceries, Dairy, Snacks"
          className="h-11"
        />
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div>
          <Label htmlFor="is_active" className="font-medium">
            Product Status
          </Label>
          <p className="text-sm text-muted-foreground">
            {formData.is_active ? "Product is visible to customers" : "Product is hidden"}
          </p>
        </div>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}

      {/* Submit Button */}
      <Button type="submit" className="w-full h-11 bg-[#F97316] hover:bg-[#EA580C]" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : product ? (
          "Update Product"
        ) : (
          "Add Product"
        )}
      </Button>
    </form>
  )
}

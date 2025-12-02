"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Package, Plus, Search, Edit, Trash2, AlertTriangle, Upload, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductsListProps {
  products: Product[]
}

export function ProductsList({ products }: ProductsListProps) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "low-stock" | "inactive">((searchParams.get("filter") as any) || "all")
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "low-stock"
          ? product.stock <= 10
          : filter === "inactive"
            ? !product.is_active
            : true
    return matchesSearch && matchesFilter
  })

  const handleDelete = async () => {
    if (!deleteProduct) return
    setDeleting(true)

    await supabase.from("products").delete().eq("id", deleteProduct.id)

    setDeleting(false)
    setDeleteProduct(null)
    router.refresh()
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out", color: "bg-red-500 text-white" }
    if (stock <= 5) return { label: `${stock} left`, color: "bg-red-100 text-red-700" }
    if (stock <= 10) return { label: `${stock} left`, color: "bg-amber-100 text-amber-700" }
    return { label: "In Stock", color: "bg-green-100 text-green-700" }
  }

  const filterCounts = {
    all: products.length,
    "low-stock": products.filter((p) => p.stock <= 10).length,
    inactive: products.filter((p) => !p.is_active).length,
  }

  return (
    <div
      className={cn("space-y-6 pb-24 lg:pb-6 transition-opacity duration-500", mounted ? "opacity-100" : "opacity-0")}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">{products.length} products in your inventory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl bg-white border-gray-200 hover:bg-gray-50 h-11" asChild>
              <Link href="/merchant/products/import">
                <Upload className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Import</span> CSV
              </Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-[#FF7F32] to-[#ea580c] hover:from-[#ea580c] hover:to-[#d95513] text-white rounded-xl shadow-lg shadow-orange-100 h-11 px-5"
            >
              <Link href="/merchant/products/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-12 pr-12 rounded-xl border-gray-200 h-12 bg-white shadow-sm focus:shadow-md transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {(["all", "low-stock", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all touch-active",
                filter === f
                  ? "bg-gradient-to-r from-[#FF7F32] to-[#ea580c] text-white shadow-lg shadow-orange-100"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300",
              )}
            >
              {filter === f && <Check className="w-4 h-4" />}
              {f === "all" ? "All" : f === "low-stock" ? "Low Stock" : "Inactive"}
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full", filter === f ? "bg-white/20" : "bg-gray-100")}>
                {filterCounts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="p-8 sm:p-12 bg-white rounded-2xl border-0 shadow-sm text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {searchQuery ? "No products found" : "No products yet"}
          </h3>
          <p className="text-gray-500 mt-1 max-w-xs mx-auto">
            {searchQuery ? "Try a different search term or filter" : "Add your first product to start selling"}
          </p>
          {!searchQuery && (
            <Button
              asChild
              className="mt-6 bg-gradient-to-r from-[#FF7F32] to-[#ea580c] text-white rounded-xl shadow-lg shadow-orange-100"
            >
              <Link href="/merchant/products/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 stagger-children">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock)
            const isLowStock = product.stock <= 10

            return (
              <Card
                key={product.id}
                className="bg-white rounded-2xl border-0 shadow-sm overflow-hidden card-hover group"
              >
                <div className="relative aspect-square bg-gray-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                  )}

                  {/* Stock Badge */}
                  <div
                    className={cn(
                      "absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1",
                      stockStatus.color,
                    )}
                  >
                    {isLowStock && product.stock > 0 && <AlertTriangle className="w-3 h-3" />}
                    {stockStatus.label}
                  </div>

                  {/* Inactive Badge */}
                  {!product.is_active && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
                      Inactive
                    </div>
                  )}

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Link
                      href={`/merchant/products/${product.id}`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Edit className="w-4 h-4 text-gray-700" />
                    </Link>
                    <button
                      onClick={() => setDeleteProduct(product)}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{product.category || "Uncategorized"}</p>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>
                    <p className={cn("text-xs sm:text-sm font-medium", isLowStock ? "text-red-600" : "text-gray-500")}>
                      {product.stock} qty
                    </p>
                  </div>

                  {/* Mobile Actions - Show on smaller screens */}
                  <div className="flex gap-2 mt-3 sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg h-9 text-xs bg-transparent"
                      asChild
                    >
                      <Link href={`/merchant/products/${product.id}`}>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg h-9 text-red-600 hover:bg-red-50 bg-transparent px-3"
                      onClick={() => setDeleteProduct(product)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent className="rounded-2xl max-w-sm mx-4">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center">Delete Product</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to delete &quot;{deleteProduct?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
            <AlertDialogCancel className="rounded-xl h-11 w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 rounded-xl h-11 w-full sm:w-auto"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

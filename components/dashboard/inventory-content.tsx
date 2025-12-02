"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { Plus, Search, Package, Edit2, Trash2, AlertTriangle } from "lucide-react"
import type { Product } from "@/lib/types"
import { ProductForm } from "./product-form"

interface InventoryContentProps {
  products: Product[]
  userId: string
}

export function InventoryContent({ products, userId }: InventoryContentProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async () => {
    if (!deletingProduct) return
    setIsDeleting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("products").delete().eq("id", deletingProduct.id)

      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error("Delete error:", err)
    } finally {
      setIsDeleting(false)
      setDeletingProduct(null)
    }
  }

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false)
    setEditingProduct(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">{products.length} products in your store</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#F97316] hover:bg-[#EA580C] h-11 rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm userId={userId} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search - Updated styling */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 rounded-xl bg-white border-0 shadow-sm"
        />
      </div>

      {/* Products Grid - Updated empty state */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-[#F97316]/10 rounded-full flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-[#F97316]" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No products yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">Add your first product to start selling to customers</p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#F97316] hover:bg-[#EA580C] h-11 rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => setEditingProduct(product)}
              onDelete={() => setDeletingProduct(product)}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && <ProductForm userId={userId} product={editingProduct} onSuccess={handleFormSuccess} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingProduct?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-xl"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product
  onEdit: () => void
  onDelete: () => void
}) {
  const isLowStock = product.stock <= 10

  return (
    <Card className="overflow-hidden border-0 shadow-sm rounded-2xl bg-white">
      <div className="aspect-square relative bg-[#FDF8F3]">
        {product.image_url ? (
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        {!product.is_active && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-lg">Inactive</span>
          </div>
        )}
        {isLowStock && product.is_active && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Low Stock
          </div>
        )}
        {/* Stock badge like customer panel */}
        <div className="absolute top-3 left-3 bg-[#22C55E]/90 text-white px-2 py-1 rounded-lg text-xs font-medium">
          {Math.min(Math.round((product.stock / 100) * 100), 100)}%
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          {product.category && <p className="text-xs text-muted-foreground">{product.category}</p>}
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-foreground">₹{Number(product.price).toLocaleString()}</span>
          <span className={`text-sm ${isLowStock ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
            {product.stock} in stock
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl bg-transparent border-[#F97316]/20 text-[#F97316] hover:bg-[#F97316]/10 hover:text-[#F97316]"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

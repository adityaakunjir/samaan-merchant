"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authAPI, productsAPI } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download, X } from "lucide-react"

interface ProductRow {
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  isValid: boolean
  error?: string
}

export default function ImportProductsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<ProductRow[]>([])
  const [importing, setImporting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null)
  const [merchantId, setMerchantId] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      router.push("/merchant/login")
      return
    }

    const user = authAPI.getCurrentUser()
    if (!user) {
      router.push("/merchant/login")
      return
    }

    setMerchantId(user.id)
  }, [router])

  const parseCSV = (text: string): ProductRow[] => {
    const lines = text.trim().split("\n")
    const headers = lines[0]
      .toLowerCase()
      .split(",")
      .map((h) => h.trim())

    const nameIndex = headers.indexOf("name")
    const descIndex = headers.indexOf("description")
    const priceIndex = headers.indexOf("price")
    const stockIndex = headers.indexOf("stock")
    const categoryIndex = headers.indexOf("category")

    if (nameIndex === -1 || priceIndex === -1 || stockIndex === -1) {
      return []
    }

    return lines
      .slice(1)
      .map((line) => {
        const values = line.split(",").map((v) => v.trim())
        const name = values[nameIndex] || ""
        const price = Number.parseFloat(values[priceIndex]) || 0
        const stock = Number.parseInt(values[stockIndex]) || 0

        const errors: string[] = []
        if (!name) errors.push("Name required")
        if (price <= 0) errors.push("Invalid price")
        if (stock < 0) errors.push("Invalid stock")

        return {
          name,
          description: descIndex >= 0 ? values[descIndex] : undefined,
          price,
          stock,
          category: categoryIndex >= 0 ? values[categoryIndex] : undefined,
          isValid: errors.length === 0,
          error: errors.join(", "),
        }
      })
      .filter((row) => row.name || row.price || row.stock)
  }

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file")
      return
    }

    setFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)
      setPreview(parsed)
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleImport = async () => {
    const validProducts = preview.filter((p) => p.isValid)
    if (validProducts.length === 0) return

    setImporting(true)

    let success = 0
    let failed = 0

    for (const product of validProducts) {
      try {
        await productsAPI.create({
          merchant_id: merchantId,
          name: product.name,
          description: product.description || null,
          price: product.price,
          stock: product.stock,
          category: product.category || null,
          is_active: true,
        })
        success++
      } catch (error) {
        failed++
      }
    }

    setResult({ success, failed })
    setImporting(false)
  }

  const downloadTemplate = () => {
    const template =
      "name,description,price,stock,category\nAmul Milk 1L,Fresh milk,55,100,Dairy\nBrown Bread 400g,Whole wheat bread,45,50,Bakery"
    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "products_template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const validCount = preview.filter((p) => p.isValid).length
  const invalidCount = preview.filter((p) => !p.isValid).length

  return (
    <div className="max-w-3xl mx-auto pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/merchant/products" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import Products</h1>
          <p className="text-gray-500 mt-1">Bulk import products from a CSV file</p>
        </div>
      </div>

      {result ? (
        <Card className="p-8 bg-white rounded-2xl border-0 shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Import Complete</h2>
          <p className="text-gray-600 mb-6">
            Successfully imported {result.success} products
            {result.failed > 0 && `, ${result.failed} failed`}
          </p>
          <Button asChild className="bg-[#FF7F32] hover:bg-[#e66a20] text-white rounded-xl">
            <Link href="/merchant/products">View Products</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Template Download */}
          <Card className="p-4 bg-blue-50 rounded-xl border-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-800">Need a template? Download our CSV template</span>
            </div>
            <Button variant="outline" size="sm" onClick={downloadTemplate} className="rounded-lg bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Template
            </Button>
          </Card>

          {/* File Upload */}
          <Card
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`p-8 bg-white rounded-2xl border-2 border-dashed transition-colors ${
              dragOver ? "border-[#FF7F32] bg-orange-50" : "border-gray-200"
            }`}
          >
            {file ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-[#FF7F32]" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{preview.length} products found</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFile(null)
                    setPreview([])
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop your CSV file here, or</p>
                <label>
                  <Button variant="outline" className="rounded-xl bg-transparent" asChild>
                    <span>Browse Files</span>
                  </Button>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="sr-only"
                  />
                </label>
                <p className="text-xs text-gray-400 mt-4">
                  CSV must have columns: name, price, stock (required), description, category (optional)
                </p>
              </div>
            )}
          </Card>

          {/* Preview */}
          {preview.length > 0 && (
            <Card className="bg-white rounded-2xl border-0 shadow-sm overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Preview</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {validCount} valid
                  </span>
                  {invalidCount > 0 && (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {invalidCount} invalid
                    </span>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-600">Name</th>
                      <th className="text-left p-3 font-medium text-gray-600">Price</th>
                      <th className="text-left p-3 font-medium text-gray-600">Stock</th>
                      <th className="text-left p-3 font-medium text-gray-600">Category</th>
                      <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className={row.isValid ? "" : "bg-red-50"}>
                        <td className="p-3 text-gray-900">{row.name || "-"}</td>
                        <td className="p-3 text-gray-900">₹{row.price}</td>
                        <td className="p-3 text-gray-900">{row.stock}</td>
                        <td className="p-3 text-gray-600">{row.category || "-"}</td>
                        <td className="p-3">
                          {row.isValid ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <span className="text-red-600 text-xs">{row.error}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Actions */}
          {preview.length > 0 && (
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl bg-transparent"
                onClick={() => {
                  setFile(null)
                  setPreview([])
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 bg-[#FF7F32] hover:bg-[#e66a20] text-white rounded-xl"
                onClick={handleImport}
                disabled={importing || validCount === 0}
              >
                {importing ? <Loader2 className="w-5 h-5 animate-spin" /> : `Import ${validCount} Products`}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

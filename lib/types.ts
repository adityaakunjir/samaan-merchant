// =================================================
// TYPES MATCHING SQL SERVER DATABASE SCHEMA
// =================================================

// User table
export interface User {
  id: string
  email: string
  fullName: string
  role: "Customer" | "Merchant"
  phone: string | null
  address: string | null
  city: string | null
  pincode: string | null
  createdAt: string
  isActive: boolean
}

// Merchants table
export interface Merchant {
  id: string
  userId: string
  shopName: string
  shopType: string
  description: string | null
  shopAddress: string | null
  city: string | null
  pincode: string | null
  latitude: number | null
  longitude: number | null
  deliveryRadius: number
  minOrderAmount: number
  deliveryFee: number
  isOpen: boolean
  openTime: string
  closeTime: string
  rating: number
  totalOrders: number
  isVerified: boolean
  createdAt: string
}

// Products table
export interface Product {
  id: string
  merchantId: string
  name: string
  description: string | null
  brand: string | null
  price: number
  mrp: number
  unit: string | null
  category: string | null
  subCategory: string | null
  imageUrl: string | null
  stock: number
  isAvailable: boolean
  createdAt: string
}

// Orders table
export interface Order {
  id: string
  orderNumber: string
  customerId: string
  merchantId: string
  itemsTotal: number
  deliveryFee: number
  discount: number
  grandTotal: number
  status: OrderStatus
  paymentMethod: "COD" | "Online"
  paymentStatus: "Pending" | "Paid" | "Failed"
  deliveryAddress: string | null
  deliveryInstructions: string | null
  estimatedDelivery: string | null
  createdAt: string
  updatedAt: string
  // Joined data
  items?: OrderItem[]
  customer?: User
  merchant?: Merchant
}

// OrderItems table
export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  // Joined data
  product?: Product
}

// Order status enum matching database
export type OrderStatus = "Placed" | "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled"

// Auth response from .NET backend
export interface AuthResponse {
  success: boolean
  message?: string
  token?: string
  user?: User
  merchant?: Merchant
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

// Dashboard stats
export interface DashboardStats {
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
  totalProducts: number
  lowStockProducts: number
  pendingOrders: number
  rating: number
}

// Product form data for create/update
export interface ProductFormData {
  name: string
  description?: string
  brand?: string
  price: number
  mrp: number
  unit?: string
  category?: string
  subCategory?: string
  imageUrl?: string
  stock: number
  isAvailable: boolean
}

// Merchant profile form data
export interface MerchantFormData {
  shopName: string
  shopType?: string
  description?: string
  shopAddress?: string
  city?: string
  pincode?: string
  deliveryRadius?: number
  minOrderAmount?: number
  deliveryFee?: number
  openTime?: string
  closeTime?: string
}

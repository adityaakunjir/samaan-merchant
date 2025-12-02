export interface Merchant {
  id: string
  shop_name: string
  address: string | null
  is_open: boolean
  eta_minutes: number
  logo_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  merchant_id: string
  name: string
  description: string | null
  price: number
  stock: number
  category: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  merchant_id: string
  customer_name: string
  customer_phone: string | null
  customer_address: string | null
  status: "new" | "confirmed" | "packed" | "ready" | "delivered" | "cancelled"
  total_amount: number
  items: OrderItem[]
  notes: string | null
  created_at: string
  updated_at: string
}

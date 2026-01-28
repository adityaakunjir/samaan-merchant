// API Client for .NET Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://samaan-api.azurewebsites.net/api"

// Token management
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
  }
}

export const getUser = () => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export const setUser = (user: any): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

// API fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    ; (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
  }

  const url = `${API_BASE_URL}${endpoint}`

  // Debug logging
  console.log("[v0] API Request:", {
    url,
    method: options.method || "GET",
    body: options.body ? JSON.parse(options.body as string) : undefined,
  })

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    console.log("[v0] API Response Status:", response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] API Error Response:", errorText)

      let errorMessage = "Request failed"
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorJson.title || errorJson.error || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }

      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log("[v0] API Response Data:", data)
    return data
  } catch (error) {
    console.error("[v0] API Error:", error)
    throw error
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetchAPI("/Auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (response.success && response.token) {
      setToken(response.token)
      setUser(response.user)
    }

    return response
  },

  register: async (data: {
    email: string
    password: string
    fullName: string
    phone?: string
    role: string
    shopName?: string
    shopAddress?: string
    city?: string
    pincode?: string
  }) => {
    const response = await fetchAPI("/Auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (response.success && response.token) {
      setToken(response.token)
      setUser(response.user)
    }

    return response
  },

  logout: () => {
    removeToken()
  },

  isAuthenticated: () => {
    return !!getToken()
  },

  getCurrentUser: () => {
    return getUser()
  },
}

// Products API
export const productsAPI = {
  getAll: () => fetchAPI("/Products"),
  getById: (id: string) => fetchAPI(`/Products/${id}`),
  getByMerchant: (merchantId: string) => fetchAPI(`/Products/merchant/${merchantId}`),
  search: (query: string) => fetchAPI(`/Products/search?q=${encodeURIComponent(query)}`),
  getByCategory: (category: string) => fetchAPI(`/Products/category/${encodeURIComponent(category)}`),
  create: (product: any) =>
    fetchAPI("/Products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  update: (id: string, product: any) =>
    fetchAPI(`/Products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),
  delete: (id: string) =>
    fetchAPI(`/Products/${id}`, {
      method: "DELETE",
    }),
}

// Merchants API
export const merchantsAPI = {
  getAll: () => fetchAPI("/Merchants"),
  getById: (id: string) => fetchAPI(`/Merchants/${id}`),
  getProducts: (id: string) => fetchAPI(`/Merchants/${id}/products`),
  getNearby: (city: string) => fetchAPI(`/Merchants/nearby?city=${encodeURIComponent(city)}`),
  update: (id: string, data: any) =>
    fetchAPI(`/Merchants/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  toggleStatus: (id: string) =>
    fetchAPI(`/Merchants/${id}/toggle-status`, {
      method: "PUT",
    }),
}

// Orders API
export const ordersAPI = {
  getMyOrders: () => fetchAPI("/Orders"),
  getMerchantOrders: () => fetchAPI("/Orders/merchant"),
  getById: (id: string) => fetchAPI(`/Orders/${id}`),
  create: (order: any) =>
    fetchAPI("/Orders", {
      method: "POST",
      body: JSON.stringify(order),
    }),
  updateStatus: (id: string, status: string) =>
    fetchAPI(`/Orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
}

export const api = {
  auth: authAPI,
  products: productsAPI,
  merchants: merchantsAPI,
  orders: ordersAPI,
}

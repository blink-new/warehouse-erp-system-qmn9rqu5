export interface Product {
  id: string
  name: string
  category: string
  brand: string
  model: string
  sku: string
  description?: string
  specifications?: string
  unitPrice: number
  costPrice: number
  stockQuantity: number
  minStockLevel: number
  maxStockLevel: number
  location?: string
  status: 'active' | 'discontinued' | 'out_of_stock'
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress?: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  shippedDate?: string
  deliveredDate?: string
  totalAmount: number
  notes?: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  createdAt: string
  userId: string
  product?: Product
}

export interface InventoryMovement {
  id: string
  productId: string
  movementType: 'in' | 'out' | 'adjustment'
  quantity: number
  referenceType?: string
  referenceId?: string
  notes?: string
  createdAt: string
  userId: string
  product?: Product
}

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  lowStockItems: number
  totalRevenue: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
}
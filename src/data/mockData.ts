import { Product, Order, OrderItem, DashboardStats } from '@/types'

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'MacBook Pro 14"',
    category: 'Laptops',
    brand: 'Apple',
    model: 'MacBook Pro',
    sku: 'MBP-14-M3-512',
    description: 'Latest MacBook Pro with M3 chip',
    specifications: JSON.stringify({
      processor: 'M3',
      ram: '16GB',
      storage: '512GB SSD',
      display: '14-inch Liquid Retina XDR'
    }),
    unitPrice: 1999.00,
    costPrice: 1600.00,
    stockQuantity: 25,
    minStockLevel: 5,
    maxStockLevel: 50,
    location: 'A1-B2',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    userId: 'system'
  },
  {
    id: 'prod_2',
    name: 'Dell XPS 13',
    category: 'Laptops',
    brand: 'Dell',
    model: 'XPS 13',
    sku: 'DELL-XPS13-I7',
    description: 'Ultra-portable business laptop',
    specifications: JSON.stringify({
      processor: 'Intel i7-13700H',
      ram: '16GB',
      storage: '1TB SSD',
      display: '13.4-inch FHD+'
    }),
    unitPrice: 1299.00,
    costPrice: 1000.00,
    stockQuantity: 18,
    minStockLevel: 5,
    maxStockLevel: 40,
    location: 'A1-B3',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    userId: 'system'
  },
  {
    id: 'prod_3',
    name: 'ThinkPad X1 Carbon',
    category: 'Laptops',
    brand: 'Lenovo',
    model: 'ThinkPad X1',
    sku: 'TP-X1C-G11',
    description: 'Business ultrabook with excellent keyboard',
    specifications: JSON.stringify({
      processor: 'Intel i7-1365U',
      ram: '32GB',
      storage: '1TB SSD',
      display: '14-inch WUXGA'
    }),
    unitPrice: 1599.00,
    costPrice: 1200.00,
    stockQuantity: 12,
    minStockLevel: 3,
    maxStockLevel: 30,
    location: 'A2-B1',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    userId: 'system'
  },
  {
    id: 'prod_4',
    name: 'iPad Pro 12.9"',
    category: 'Tablets',
    brand: 'Apple',
    model: 'iPad Pro',
    sku: 'IPAD-PRO-129-1TB',
    description: 'Professional tablet with M2 chip',
    specifications: JSON.stringify({
      processor: 'M2',
      ram: '16GB',
      storage: '1TB',
      display: '12.9-inch Liquid Retina XDR'
    }),
    unitPrice: 1399.00,
    costPrice: 1100.00,
    stockQuantity: 8,
    minStockLevel: 3,
    maxStockLevel: 25,
    location: 'B1-A1',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    userId: 'system'
  },
  {
    id: 'prod_5',
    name: 'Surface Pro 9',
    category: 'Tablets',
    brand: 'Microsoft',
    model: 'Surface Pro',
    sku: 'SURF-PRO9-I7',
    description: '2-in-1 tablet with keyboard',
    specifications: JSON.stringify({
      processor: 'Intel i7-1255U',
      ram: '16GB',
      storage: '512GB SSD',
      display: '13-inch PixelSense'
    }),
    unitPrice: 1199.00,
    costPrice: 950.00,
    stockQuantity: 15,
    minStockLevel: 5,
    maxStockLevel: 30,
    location: 'B1-A2',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    userId: 'system'
  },
  {
    id: 'prod_6',
    name: 'Gaming Mouse Pro',
    category: 'Accessories',
    brand: 'Logitech',
    model: 'G Pro X',
    sku: 'LOG-GPRO-X',
    description: 'Professional gaming mouse',
    specifications: JSON.stringify({
      sensor: 'HERO 25K',
      dpi: '25,600',
      buttons: '8',
      weight: '63g'
    }),
    unitPrice: 149.00,
    costPrice: 100.00,
    stockQuantity: 2,
    minStockLevel: 10,
    maxStockLevel: 50,
    location: 'C1-A1',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    userId: 'system'
  }
]

export const mockOrders: Order[] = [
  {
    id: 'order_1',
    orderNumber: 'ORD-2024-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1-555-0123',
    customerAddress: '123 Main St, New York, NY 10001',
    status: 'processing',
    orderDate: '2024-01-16T09:30:00Z',
    totalAmount: 3598.00,
    assignedTo: 'Sarah Johnson',
    notes: 'Customer requested expedited shipping',
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T09:30:00Z',
    userId: 'system'
  },
  {
    id: 'order_2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Emily Davis',
    customerEmail: 'emily.davis@company.com',
    customerPhone: '+1-555-0124',
    customerAddress: '456 Business Ave, San Francisco, CA 94105',
    status: 'shipped',
    orderDate: '2024-01-15T14:20:00Z',
    shippedDate: '2024-01-16T10:00:00Z',
    totalAmount: 1299.00,
    assignedTo: 'Mike Wilson',
    createdAt: '2024-01-15T14:20:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    userId: 'system'
  },
  {
    id: 'order_3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Robert Brown',
    customerEmail: 'robert.brown@email.com',
    customerPhone: '+1-555-0125',
    customerAddress: '789 Tech Blvd, Austin, TX 78701',
    status: 'pending',
    orderDate: '2024-01-17T11:15:00Z',
    totalAmount: 2798.00,
    assignedTo: 'Sarah Johnson',
    notes: 'Bulk order for startup company',
    createdAt: '2024-01-17T11:15:00Z',
    updatedAt: '2024-01-17T11:15:00Z',
    userId: 'system'
  },
  {
    id: 'order_4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Lisa Wilson',
    customerEmail: 'lisa.wilson@email.com',
    customerPhone: '+1-555-0126',
    customerAddress: '321 Creative St, Portland, OR 97201',
    status: 'delivered',
    orderDate: '2024-01-14T16:45:00Z',
    shippedDate: '2024-01-15T09:00:00Z',
    deliveredDate: '2024-01-16T14:30:00Z',
    totalAmount: 1199.00,
    assignedTo: 'Mike Wilson',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    userId: 'system'
  },
  {
    id: 'order_5',
    orderNumber: 'ORD-2024-005',
    customerName: 'David Chen',
    customerEmail: 'david.chen@tech.com',
    customerPhone: '+1-555-0127',
    status: 'cancelled',
    orderDate: '2024-01-13T13:20:00Z',
    totalAmount: 1999.00,
    notes: 'Customer cancelled due to budget constraints',
    createdAt: '2024-01-13T13:20:00Z',
    updatedAt: '2024-01-13T15:00:00Z',
    userId: 'system'
  }
]

export const mockOrderItems: OrderItem[] = [
  {
    id: 'item_1',
    orderId: 'order_1',
    productId: 'prod_1',
    quantity: 1,
    unitPrice: 1999.00,
    totalPrice: 1999.00,
    createdAt: '2024-01-16T09:30:00Z',
    userId: 'system'
  },
  {
    id: 'item_2',
    orderId: 'order_1',
    productId: 'prod_3',
    quantity: 1,
    unitPrice: 1599.00,
    totalPrice: 1599.00,
    createdAt: '2024-01-16T09:30:00Z',
    userId: 'system'
  },
  {
    id: 'item_3',
    orderId: 'order_2',
    productId: 'prod_2',
    quantity: 1,
    unitPrice: 1299.00,
    totalPrice: 1299.00,
    createdAt: '2024-01-15T14:20:00Z',
    userId: 'system'
  },
  {
    id: 'item_4',
    orderId: 'order_3',
    productId: 'prod_1',
    quantity: 1,
    unitPrice: 1999.00,
    totalPrice: 1999.00,
    createdAt: '2024-01-17T11:15:00Z',
    userId: 'system'
  },
  {
    id: 'item_5',
    orderId: 'order_3',
    productId: 'prod_5',
    quantity: 1,
    unitPrice: 1199.00,
    totalPrice: 1199.00,
    createdAt: '2024-01-17T11:15:00Z',
    userId: 'system'
  },
  {
    id: 'item_6',
    orderId: 'order_4',
    productId: 'prod_5',
    quantity: 1,
    unitPrice: 1199.00,
    totalPrice: 1199.00,
    createdAt: '2024-01-14T16:45:00Z',
    userId: 'system'
  }
]

export const mockDashboardStats: DashboardStats = {
  totalProducts: mockProducts.length,
  totalOrders: mockOrders.length,
  lowStockItems: mockProducts.filter(p => p.stockQuantity <= p.minStockLevel).length,
  totalRevenue: mockOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.totalAmount, 0),
  pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
  processingOrders: mockOrders.filter(o => o.status === 'processing').length,
  shippedOrders: mockOrders.filter(o => o.status === 'shipped').length,
  deliveredOrders: mockOrders.filter(o => o.status === 'delivered').length,
}
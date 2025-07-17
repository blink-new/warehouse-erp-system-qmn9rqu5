import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { InventoryTable } from '@/components/inventory/InventoryTable'
import { OrdersTable } from '@/components/orders/OrdersTable'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import { ProductForm } from '@/components/forms/ProductForm'
import { OrderForm } from '@/components/forms/OrderForm'
import { OrderDetailsModal } from '@/components/modals/OrderDetailsModal'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { Product, Order, DashboardStats as StatsType } from '@/types'
import { mockProducts, mockOrders, mockDashboardStats } from '@/data/mockData'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [stats, setStats] = useState<StatsType>(mockDashboardStats)
  
  // Modal states
  const [productFormOpen, setProductFormOpen] = useState(false)
  const [orderFormOpen, setOrderFormOpen] = useState(false)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add')
  
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Update stats whenever products or orders change
  useEffect(() => {
    const newStats = {
      totalProducts: products.length,
      totalOrders: orders.length,
      lowStockItems: products.filter(p => p.stockQuantity <= p.minStockLevel).length,
      totalRevenue: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + order.totalAmount, 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      processingOrders: orders.filter(o => o.status === 'processing').length,
      shippedOrders: orders.filter(o => o.status === 'shipped').length,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    }
    setStats(newStats)
  }, [products, orders])

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setFormMode('add')
    setProductFormOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setFormMode('edit')
    setProductFormOpen(true)
  }

  const handleProductSubmit = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (formMode === 'add') {
      const newProduct: Product = {
        ...productData,
        id: `prod_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user?.id || 'system'
      }
      setProducts(prev => [...prev, newProduct])
      toast({
        title: "Product Added",
        description: `${productData.name} has been added to inventory`,
      })
    } else if (selectedProduct) {
      const updatedProduct: Product = {
        ...selectedProduct,
        ...productData,
        updatedAt: new Date().toISOString()
      }
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p))
      toast({
        title: "Product Updated",
        description: `${productData.name} has been updated`,
      })
    }
  }

  const handleAddOrder = () => {
    setSelectedOrder(null)
    setFormMode('add')
    setOrderFormOpen(true)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOrderDetailsOpen(true)
  }

  const handleOrderSubmit = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, items: any[]) => {
    if (formMode === 'add') {
      const newOrder: Order = {
        ...orderData,
        id: `order_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user?.id || 'system'
      }
      setOrders(prev => [...prev, newOrder])
      
      // Update product stock quantities
      items.forEach(item => {
        setProducts(prev => prev.map(p => 
          p.id === item.productId 
            ? { ...p, stockQuantity: Math.max(0, p.stockQuantity - item.quantity) }
            : p
        ))
      })
      
      toast({
        title: "Order Created",
        description: `Order ${orderData.orderNumber} has been created`,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Warehouse ERP...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Warehouse ERP System</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the warehouse management system</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome to your warehouse management system</p>
            </div>
            <DashboardStats stats={stats} />
          </div>
        )
      
      case 'inventory':
        return (
          <InventoryTable 
            products={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
          />
        )
      
      case 'orders':
        return (
          <OrdersTable 
            orders={orders}
            onAddOrder={handleAddOrder}
            onViewOrder={handleViewOrder}
          />
        )
      
      case 'analytics':
        return <AnalyticsDashboard products={products} orders={orders} />
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <p className="text-gray-600">System configuration and user preferences</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
              <p className="text-gray-500">User management, system preferences, and configuration options will be available in the next version</p>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="lg:pl-64">
        <main className="p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
      
      {/* Modals */}
      <ProductForm
        isOpen={productFormOpen}
        onClose={() => setProductFormOpen(false)}
        onSubmit={handleProductSubmit}
        product={selectedProduct}
        mode={formMode}
      />
      
      <OrderForm
        isOpen={orderFormOpen}
        onClose={() => setOrderFormOpen(false)}
        onSubmit={handleOrderSubmit}
        order={selectedOrder}
        products={products}
        mode={formMode}
      />
      
      <OrderDetailsModal
        isOpen={orderDetailsOpen}
        onClose={() => setOrderDetailsOpen(false)}
        order={selectedOrder}
        products={products}
      />
      
      <Toaster />
    </div>
  )
}

export default App
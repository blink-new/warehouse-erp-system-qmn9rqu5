import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Order, Product } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { Plus, Minus, X } from 'lucide-react'

interface OrderItem {
  productId: string
  quantity: number
  unitPrice: number
}

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, items: OrderItem[]) => void
  order?: Order | null
  products: Product[]
  mode: 'add' | 'edit'
}

export function OrderForm({ isOpen, onClose, onSubmit, order, products, mode }: OrderFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    status: 'pending' as const,
    orderDate: new Date().toISOString().split('T')[0],
    notes: '',
    assignedTo: ''
  })

  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const salesTeam = ['Sarah Johnson', 'Mike Wilson', 'Alex Chen', 'Emma Davis']

  useEffect(() => {
    if (order && mode === 'edit') {
      setFormData({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone || '',
        customerAddress: order.customerAddress || '',
        status: order.status,
        orderDate: order.orderDate.split('T')[0],
        notes: order.notes || '',
        assignedTo: order.assignedTo || ''
      })
      // Note: In a real app, you'd load order items from the database
      setOrderItems([])
    } else {
      // Generate order number for new orders
      const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      setFormData({
        orderNumber,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        status: 'pending',
        orderDate: new Date().toISOString().split('T')[0],
        notes: '',
        assignedTo: ''
      })
      setOrderItems([])
    }
  }, [order, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.customerName || !formData.customerEmail || !formData.orderNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    if (orderItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one item to the order",
        variant: "destructive"
      })
      return
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

    const orderData = {
      orderNumber: formData.orderNumber,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      status: formData.status,
      orderDate: new Date(formData.orderDate).toISOString(),
      totalAmount,
      notes: formData.notes,
      assignedTo: formData.assignedTo
    }

    onSubmit(orderData, orderItems)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addOrderItem = () => {
    if (!selectedProduct) {
      toast({
        title: "Selection Required",
        description: "Please select a product to add",
        variant: "destructive"
      })
      return
    }

    const product = products.find(p => p.id === selectedProduct)
    if (!product) return

    const existingItem = orderItems.find(item => item.productId === selectedProduct)
    if (existingItem) {
      setOrderItems(prev => prev.map(item => 
        item.productId === selectedProduct 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setOrderItems(prev => [...prev, {
        productId: selectedProduct,
        quantity: 1,
        unitPrice: product.unitPrice
      }])
    }

    setSelectedProduct('')
  }

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeOrderItem(productId)
      return
    }

    setOrderItems(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    ))
  }

  const removeOrderItem = (productId: string) => {
    setOrderItems(prev => prev.filter(item => item.productId !== productId))
  }

  const getProductById = (id: string) => products.find(p => p.id === id)

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Create New Order' : 'Edit Order'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number *</Label>
                  <Input
                    id="orderNumber"
                    value={formData.orderNumber}
                    onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                    placeholder="ORD-2024-001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderDate">Order Date *</Label>
                  <Input
                    id="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => handleInputChange('orderDate', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="+1-555-0123"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesTeam.map(member => (
                        <SelectItem key={member} value={member}>{member}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerAddress">Customer Address</Label>
                <Textarea
                  id="customerAddress"
                  value={formData.customerAddress}
                  onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                  placeholder="123 Main St, City, State, ZIP"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Order notes..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Item */}
              <div className="flex gap-2">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select product to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.unitPrice.toFixed(2)} (Stock: {product.stockQuantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addOrderItem}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Items List */}
              {orderItems.length > 0 && (
                <div className="space-y-2">
                  {orderItems.map((item) => {
                    const product = getProductById(item.productId)
                    if (!product) return null

                    return (
                      <div key={item.productId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand} {product.model}</div>
                          <Badge variant="outline" className="mt-1">{product.sku}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="w-8 text-center">{item.quantity}</span>
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          
                          <div className="ml-4 text-right">
                            <div className="font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</div>
                            <div className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} each</div>
                          </div>
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOrderItem(item.productId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                  
                  <div className="flex justify-end pt-4 border-t">
                    <div className="text-right">
                      <div className="text-lg font-bold">Total: ${totalAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">{orderItems.length} item(s)</div>
                    </div>
                  </div>
                </div>
              )}

              {orderItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No items added yet. Select a product above to add to this order.
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {mode === 'add' ? 'Create Order' : 'Update Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
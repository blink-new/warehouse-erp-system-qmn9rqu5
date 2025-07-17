import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Order, Product } from '@/types'
import { format } from 'date-fns'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Package, 
  DollarSign,
  FileText,
  UserCheck
} from 'lucide-react'

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  products: Product[]
}

export function OrderDetailsModal({ isOpen, onClose, order, products }: OrderDetailsModalProps) {
  if (!order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Mock order items - in a real app, these would come from the database
  const mockOrderItems = [
    {
      id: 'item_1',
      productId: 'prod_1',
      quantity: 1,
      unitPrice: 1999.00,
      totalPrice: 1999.00
    },
    {
      id: 'item_2',
      productId: 'prod_2',
      quantity: 2,
      unitPrice: 1299.00,
      totalPrice: 2598.00
    }
  ]

  const orderItems = mockOrderItems.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  })).filter(item => item.product)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.orderNumber}</span>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Order Date</div>
                    <div className="font-medium">
                      {format(new Date(order.orderDate), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Total Amount</div>
                    <div className="font-medium text-lg">${order.totalAmount.toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Assigned To</div>
                    <div className="font-medium">{order.assignedTo || 'Unassigned'}</div>
                  </div>
                </div>
              </div>

              {order.shippedDate && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Shipped Date</div>
                      <div className="font-medium">
                        {format(new Date(order.shippedDate), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {order.deliveredDate && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Delivered Date</div>
                      <div className="font-medium">
                        {format(new Date(order.deliveredDate), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium">{order.customerName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{order.customerEmail}</div>
                  </div>
                </div>

                {order.customerPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{order.customerPhone}</div>
                    </div>
                  </div>
                )}

                {order.customerAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-medium">{order.customerAddress}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({orderItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.product?.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.product?.brand} {item.product?.model}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {item.product?.sku}
                      </Badge>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center pt-2">
                  <div className="font-medium">Total</div>
                  <div className="text-xl font-bold">${order.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Order Created</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(order.orderDate), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                </div>

                {order.status !== 'pending' && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Order Processing</div>
                      <div className="text-sm text-gray-500">Status updated to processing</div>
                    </div>
                  </div>
                )}

                {order.shippedDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Order Shipped</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(order.shippedDate), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                )}

                {order.deliveredDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Order Delivered</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(order.deliveredDate), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                )}

                {order.status === 'cancelled' && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Order Cancelled</div>
                      <div className="text-sm text-gray-500">Order was cancelled</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
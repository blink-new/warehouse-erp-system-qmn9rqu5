import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Product } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void
  product?: Product | null
  mode: 'add' | 'edit'
}

export function ProductForm({ isOpen, onClose, onSubmit, product, mode }: ProductFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    model: '',
    sku: '',
    description: '',
    specifications: '',
    unitPrice: '',
    costPrice: '',
    stockQuantity: '',
    minStockLevel: '',
    maxStockLevel: '',
    location: '',
    status: 'active' as const
  })

  const categories = ['Laptops', 'Tablets', 'Accessories', 'Monitors', 'Keyboards', 'Mice', 'Storage']
  const statuses = ['active', 'discontinued', 'out_of_stock']

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name,
        category: product.category,
        brand: product.brand,
        model: product.model,
        sku: product.sku,
        description: product.description || '',
        specifications: product.specifications || '',
        unitPrice: product.unitPrice.toString(),
        costPrice: product.costPrice.toString(),
        stockQuantity: product.stockQuantity.toString(),
        minStockLevel: product.minStockLevel.toString(),
        maxStockLevel: product.maxStockLevel.toString(),
        location: product.location || '',
        status: product.status
      })
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        category: '',
        brand: '',
        model: '',
        sku: '',
        description: '',
        specifications: '',
        unitPrice: '',
        costPrice: '',
        stockQuantity: '',
        minStockLevel: '5',
        maxStockLevel: '100',
        location: '',
        status: 'active'
      })
    }
  }, [product, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.category || !formData.brand || !formData.sku) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    if (parseFloat(formData.unitPrice) <= 0 || parseFloat(formData.costPrice) <= 0) {
      toast({
        title: "Validation Error",
        description: "Prices must be greater than 0",
        variant: "destructive"
      })
      return
    }

    if (parseInt(formData.stockQuantity) < 0) {
      toast({
        title: "Validation Error",
        description: "Stock quantity cannot be negative",
        variant: "destructive"
      })
      return
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      model: formData.model,
      sku: formData.sku,
      description: formData.description,
      specifications: formData.specifications,
      unitPrice: parseFloat(formData.unitPrice),
      costPrice: parseFloat(formData.costPrice),
      stockQuantity: parseInt(formData.stockQuantity),
      minStockLevel: parseInt(formData.minStockLevel),
      maxStockLevel: parseInt(formData.maxStockLevel),
      location: formData.location,
      status: formData.status
    }

    onSubmit(productData)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., MacBook Pro 14"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="e.g., MBP-14-M3-512"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="e.g., Apple"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., MacBook Pro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., A1-B2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price ($) *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price ($) *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStockLevel">Min Stock Level</Label>
              <Input
                id="minStockLevel"
                type="number"
                min="0"
                value={formData.minStockLevel}
                onChange={(e) => handleInputChange('minStockLevel', e.target.value)}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStockLevel">Max Stock Level</Label>
              <Input
                id="maxStockLevel"
                type="number"
                min="0"
                value={formData.maxStockLevel}
                onChange={(e) => handleInputChange('maxStockLevel', e.target.value)}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Product description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specifications">Specifications</Label>
            <Textarea
              id="specifications"
              value={formData.specifications}
              onChange={(e) => handleInputChange('specifications', e.target.value)}
              placeholder="Technical specifications..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {mode === 'add' ? 'Add Product' : 'Update Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Search, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  MapPin,
  User,
  CreditCard,
  Calendar
} from 'lucide-react'

// ============================================================================
// INTERFACES - Define the data structure for orders
// ============================================================================
// WHY: TypeScript interfaces help us catch errors early and provide autocomplete
// These match the database schema structure for orders and order items

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  product_image: string
  quantity: number
  price_at_purchase: number
}

interface Order {
  id: string
  user_id: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  stripe_payment_id: string | null
  shipping_address: {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  items: OrderItem[]
  created_at: string
  updated_at: string
}

// ============================================================================
// MOCK DATA - Sample orders for demonstration
// ============================================================================
// WHY: Mock data allows us to build the UI without needing a database connection
// This will be replaced with real API calls later when we connect to Supabase

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    user_id: 'user-1',
    customer_name: 'John Doe',
    customer_email: 'john.doe@example.com',
    total_amount: 87.97,
    status: 'processing',
    payment_status: 'paid',
    stripe_payment_id: 'pi_1234567890',
    shipping_address: {
      name: 'John Doe',
      line1: '123 Main Street',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'US'
    },
    items: [
      {
        id: 'item-1',
        product_id: 'prod-1',
        product_name: 'Custom Phone Stand',
        product_image: '/api/placeholder/100/100',
        quantity: 2,
        price_at_purchase: 12.99
      },
      {
        id: 'item-2',
        product_id: 'prod-2',
        product_name: 'Cable Tray',
        product_image: '/api/placeholder/100/100',
        quantity: 1,
        price_at_purchase: 18.99
      },
      {
        id: 'item-3',
        product_id: 'prod-3',
        product_name: 'Desk Organizer',
        product_image: '/api/placeholder/100/100',
        quantity: 1,
        price_at_purchase: 43.00
      }
    ],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T11:00:00Z'
  },
  {
    id: 'ORD-002',
    user_id: 'user-2',
    customer_name: 'Jane Smith',
    customer_email: 'jane.smith@example.com',
    total_amount: 124.98,
    status: 'shipped',
    payment_status: 'paid',
    stripe_payment_id: 'pi_0987654321',
    shipping_address: {
      name: 'Jane Smith',
      line1: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      postal_code: '90001',
      country: 'US'
    },
    items: [
      {
        id: 'item-4',
        product_id: 'prod-4',
        product_name: 'Dragon Figurine',
        product_image: '/api/placeholder/100/100',
        quantity: 1,
        price_at_purchase: 24.99
      },
      {
        id: 'item-5',
        product_id: 'prod-5',
        product_name: 'Gaming Controller Holder',
        product_image: '/api/placeholder/100/100',
        quantity: 2,
        price_at_purchase: 49.99
      }
    ],
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-15T09:15:00Z'
  },
  {
    id: 'ORD-003',
    user_id: 'user-3',
    customer_name: 'Bob Johnson',
    customer_email: 'bob.johnson@example.com',
    total_amount: 62.97,
    status: 'pending',
    payment_status: 'pending',
    stripe_payment_id: null,
    shipping_address: {
      name: 'Bob Johnson',
      line1: '789 Pine Road',
      city: 'Chicago',
      state: 'IL',
      postal_code: '60601',
      country: 'US'
    },
    items: [
      {
        id: 'item-6',
        product_id: 'prod-6',
        product_name: 'Custom Phone Stand',
        product_image: '/api/placeholder/100/100',
        quantity: 3,
        price_at_purchase: 12.99
      }
    ],
    created_at: '2024-01-16T08:45:00Z',
    updated_at: '2024-01-16T08:45:00Z'
  },
  {
    id: 'ORD-004',
    user_id: 'user-4',
    customer_name: 'Alice Williams',
    customer_email: 'alice.williams@example.com',
    total_amount: 43.00,
    status: 'delivered',
    payment_status: 'paid',
    stripe_payment_id: 'pi_abcdefghij',
    shipping_address: {
      name: 'Alice Williams',
      line1: '321 Elm Street',
      line2: 'Suite 200',
      city: 'Houston',
      state: 'TX',
      postal_code: '77001',
      country: 'US'
    },
    items: [
      {
        id: 'item-7',
        product_id: 'prod-7',
        product_name: 'Desk Organizer',
        product_image: '/api/placeholder/100/100',
        quantity: 1,
        price_at_purchase: 43.00
      }
    ],
    created_at: '2024-01-10T16:30:00Z',
    updated_at: '2024-01-13T10:00:00Z'
  },
  {
    id: 'ORD-005',
    user_id: 'user-5',
    customer_name: 'Charlie Brown',
    customer_email: 'charlie.brown@example.com',
    total_amount: 99.96,
    status: 'cancelled',
    payment_status: 'refunded',
    stripe_payment_id: 'pi_klmnopqrst',
    shipping_address: {
      name: 'Charlie Brown',
      line1: '654 Maple Drive',
      city: 'Phoenix',
      state: 'AZ',
      postal_code: '85001',
      country: 'US'
    },
    items: [
      {
        id: 'item-8',
        product_id: 'prod-8',
        product_name: 'Gaming Keycap Set',
        product_image: '/api/placeholder/100/100',
        quantity: 2,
        price_at_purchase: 49.98
      }
    ],
    created_at: '2024-01-12T11:20:00Z',
    updated_at: '2024-01-13T14:30:00Z'
  }
]

export default function OrdersPage() {
  // State management - tracks filters, selected order, and UI state
  // WHY: React state allows the UI to react to user interactions
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  // Filter orders based on search term, status, and payment status
  // WHY: Users need to filter orders to find specific ones quickly
  const filteredOrders = mockOrders.filter(order => {
    // Search filter - matches order ID, customer name, or email
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Status filter - matches order status or shows all
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    // Payment status filter - matches payment status or shows all
    const matchesPaymentStatus = paymentStatusFilter === 'all' || order.payment_status === paymentStatusFilter
    
    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  // Get status badge color based on order status
  // WHY: Color coding makes it easy to quickly identify order status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'default' // Green/gray for delivered
      case 'shipped':
        return 'default' // Blue for shipped
      case 'processing':
        return 'secondary' // Yellow/orange for processing
      case 'pending':
        return 'secondary' // Gray for pending
      case 'cancelled':
        return 'destructive' // Red for cancelled
      default:
        return 'secondary'
    }
  }

  // Get payment status badge color
  // WHY: Visual indicators help admins quickly see payment status
  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default' // Green for paid
      case 'pending':
        return 'secondary' // Yellow/orange for pending
      case 'failed':
        return 'destructive' // Red for failed
      case 'refunded':
        return 'secondary' // Gray for refunded
      default:
        return 'secondary'
    }
  }

  // Get status icon based on order status
  // WHY: Icons provide visual context for status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'processing':
        return <Package className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Format date for display
  // WHY: Makes dates human-readable instead of ISO format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Open order details modal
  // WHY: Allows admins to view full order details without navigating away
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderModalOpen(true)
  }

  // Update order status (mock implementation)
  // WHY: Admins need to update order status as orders progress
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    // TODO: Implement API call to update order status in database
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
    alert(`Order ${orderId} status updated to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track customer orders</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Order Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Status</label>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All payment statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All payment statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>
            Showing {filteredOrders.length} of {mockOrders.length} orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-sm text-gray-500">{order.customer_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.items.length} item(s)</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ${order.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center space-x-1 w-fit">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusBadgeVariant(order.payment_status)} className="capitalize">
                          {order.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {/* WHY: Shows full order details in a popup without navigating away */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  Complete information for this order
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Order Status Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="capitalize">
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Status:</span>
                        <Badge variant={getPaymentStatusBadgeVariant(selectedOrder.payment_status)} className="capitalize">
                          {selectedOrder.payment_status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment ID:</span>
                        <span className="text-sm font-mono">
                          {selectedOrder.stripe_payment_id || 'N/A'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Order Date:</span>
                        <span className="text-sm">{formatDate(selectedOrder.created_at)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Updated:</span>
                        <span className="text-sm">{formatDate(selectedOrder.updated_at)}</span>
                      </div>
                      <div className="flex items-center justify-between font-bold">
                        <span>Total Amount:</span>
                        <span className="text-green-600">${selectedOrder.total_amount.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Customer Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="text-sm">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm">{selectedOrder.customer_email}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>Shipping Address</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <div className="font-medium">{selectedOrder.shipping_address.name}</div>
                      <div>{selectedOrder.shipping_address.line1}</div>
                      {selectedOrder.shipping_address.line2 && (
                        <div>{selectedOrder.shipping_address.line2}</div>
                      )}
                      <div>
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}{' '}
                        {selectedOrder.shipping_address.postal_code}
                      </div>
                      <div>{selectedOrder.shipping_address.country}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>Order Items ({selectedOrder.items.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{item.product_name}</div>
                              <div className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ${item.price_at_purchase.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ${(item.quantity * item.price_at_purchase).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>
                    Close
                  </Button>
                  {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) => updateOrderStatus(selectedOrder.id, value as Order['status'])}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Users, Mail, Calendar, ShoppingBag } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  createdAt: string
  status: 'active' | 'inactive'
}

const mockCustomers: Customer[] = [
  {
    id: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    totalOrders: 5,
    totalSpent: 245.50,
    lastOrderDate: '2024-01-15',
    createdAt: '2023-12-01',
    status: 'active'
  },
  {
    id: 'user_2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'customer',
    totalOrders: 3,
    totalSpent: 189.75,
    lastOrderDate: '2024-01-10',
    createdAt: '2023-11-15',
    status: 'active'
  },
  {
    id: 'user_3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'customer',
    totalOrders: 8,
    totalSpent: 456.25,
    lastOrderDate: '2024-01-12',
    createdAt: '2023-10-20',
    status: 'active'
  },
  {
    id: 'user_4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'customer',
    totalOrders: 1,
    totalSpent: 67.99,
    lastOrderDate: '2023-12-20',
    createdAt: '2023-12-15',
    status: 'inactive'
  }
]

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // In a real application, you would fetch customers from an API
  // useEffect(() => {
  //   async function fetchCustomers() {
  //     setLoading(true)
  //     try {
  //       const response = await fetch('/api/admin/customers')
  //       const data = await response.json()
  //       setCustomers(data.customers)
  //     } catch (error) {
  //       console.error('Failed to fetch customers:', error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchCustomers()
  // }, [])

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Maps customer status to valid Badge component variants
  // Badge component only accepts: "default" | "secondary" | "destructive" | "outline"
  // Using "default" for active (primary color) and "secondary" for inactive (muted color)
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active': return 'default'  // Changed from 'success' to 'default' - valid Badge variant
      case 'inactive': return 'secondary'  // Keep 'secondary' - already valid
      default: return 'secondary'  // Fallback to secondary for unknown statuses
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-gray-600 mt-2">Manage your customer base and view customer insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{customers.length} total customers</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">85% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Orders/Customer</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Spend/Customer</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>View and manage all registered customers</CardDescription>
          <div className="flex items-center space-x-2 mt-4">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-gray-600">Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No customers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <Badge variant={customer.role === 'admin' ? 'default' : 'secondary'}>
                          {customer.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>{formatDate(customer.lastOrderDate)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(customer.status)}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(customer.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

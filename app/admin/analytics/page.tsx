'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download
} from 'lucide-react'

export default function AnalyticsPage() {
  // Mock analytics data
  const analyticsData = {
    revenue: {
      current: 12450.75,
      previous: 10890.25,
      change: 14.3,
      trend: 'up' as const
    },
    orders: {
      current: 156,
      previous: 142,
      change: 9.9,
      trend: 'up' as const
    },
    customers: {
      current: 89,
      previous: 76,
      change: 17.1,
      trend: 'up' as const
    },
    products: {
      current: 45,
      previous: 42,
      change: 7.1,
      trend: 'up' as const
    }
  }

  const topSellingProducts = [
    { name: 'Custom Phone Stand', sales: 45, revenue: 584.55, growth: 12.5 },
    { name: 'Dragon Figurine', sales: 32, revenue: 799.68, growth: 8.3 },
    { name: 'Cable Tray', sales: 28, revenue: 531.72, growth: 15.2 },
    { name: 'Gaming Keycap Set', sales: 24, revenue: 359.76, growth: 22.1 },
    { name: 'Desk Organizer', sales: 21, revenue: 315.21, growth: 5.7 }
  ]

  const monthlyRevenue = [
    { month: 'Jan', revenue: 8500 },
    { month: 'Feb', revenue: 9200 },
    { month: 'Mar', revenue: 10800 },
    { month: 'Apr', revenue: 11200 },
    { month: 'May', revenue: 12450 },
    { month: 'Jun', revenue: 13100 }
  ]

  const orderStatusDistribution = [
    { status: 'Completed', count: 89, percentage: 57.1 },
    { status: 'Processing', count: 34, percentage: 21.8 },
    { status: 'Shipped', count: 23, percentage: 14.7 },
    { status: 'Pending', count: 10, percentage: 6.4 }
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into your 3D print shop performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            Last 30 days
          </Badge>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span className="text-sm">Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.revenue.current.toLocaleString()}</div>
            <div className="flex items-center space-x-2 mt-1">
              {analyticsData.revenue.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={`text-xs font-medium ${
                analyticsData.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                +{analyticsData.revenue.change}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.orders.current}</div>
            <div className="flex items-center space-x-2 mt-1">
              {analyticsData.orders.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={`text-xs font-medium ${
                analyticsData.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                +{analyticsData.orders.change}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.customers.current}</div>
            <div className="flex items-center space-x-2 mt-1">
              {analyticsData.customers.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={`text-xs font-medium ${
                analyticsData.customers.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                +{analyticsData.customers.change}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.products.current}</div>
            <div className="flex items-center space-x-2 mt-1">
              {analyticsData.products.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={`text-xs font-medium ${
                analyticsData.products.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                +{analyticsData.products.change}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Revenue Trend</span>
            </CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart will be implemented here</p>
                <p className="text-sm text-gray-400">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Order Status Distribution</span>
            </CardTitle>
            <CardDescription>Current order status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderStatusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">{item.count}</span>
                    <span className="text-xs text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Top Selling Products</span>
          </CardTitle>
          <CardDescription>Best performing products this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Sales</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{product.sales}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">${product.revenue}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-sm text-green-600">+{product.growth}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

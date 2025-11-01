'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Clock,
  Star,
  BarChart3,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Activity,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react'
// Recharts imports for creating sales chart visualization
// WHY: Recharts is a composable charting library for React that works well with TypeScript
// LineChart: Container component that sets up the coordinate system for line graphs
// Line: Component that draws the actual line connecting data points
// XAxis: Component for rendering labels/scale on horizontal (X) axis
// YAxis: Component for rendering labels/scale on vertical (Y) axis
// CartesianGrid: Draws grid lines on the chart for easier reading
// Tooltip: Shows data values when user hovers over chart points
// ResponsiveContainer: Makes chart automatically resize to fit parent container
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  // ============================================================================
  // MOCK SALES DATA - Last 7 days of revenue
  // ============================================================================
  // WHY: This data simulates daily sales revenue for the past week
  // Format: { day: string, revenue: number } - matches recharts LineChart data format
  // This would typically come from your backend API, but for now we use static mock data
  const salesData = [
    { day: 'Mon', revenue: 1850 },   // Monday's revenue
    { day: 'Tue', revenue: 2120 },   // Tuesday's revenue
    { day: 'Wed', revenue: 1980 },   // Wednesday's revenue
    { day: 'Thu', revenue: 2340 },   // Thursday's revenue (higher sales day)
    { day: 'Fri', revenue: 2890 },   // Friday's revenue (weekend shopping starts)
    { day: 'Sat', revenue: 3120 },   // Saturday's revenue (peak day)
    { day: 'Sun', revenue: 2650 }    // Sunday's revenue
  ]

  // ============================================================================
  // MOCK DATA FOR THE DASHBOARD
  // ============================================================================
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,345',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'vs last month'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      description: 'vs last month'
    },
    {
      title: 'Total Products',
      value: '89',
      change: '+3',
      changeType: 'positive' as const,
      icon: Package,
      description: 'active products'
    },
    {
      title: 'Total Customers',
      value: '456',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'vs last month'
    }
  ]

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      amount: '$89.99',
      status: 'processing',
      date: '2024-01-15'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      amount: '$124.50',
      status: 'shipped',
      date: '2024-01-14'
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      amount: '$67.25',
      status: 'delivered',
      date: '2024-01-13'
    },
    {
      id: 'ORD-004',
      customer: 'Alice Brown',
      amount: '$156.75',
      status: 'pending',
      date: '2024-01-12'
    }
  ]

  const topProducts = [
    { name: 'Custom Phone Stand', sales: 45, revenue: '$584.55' },
    { name: 'Dragon Figurine', sales: 32, revenue: '$799.68' },
    { name: 'Cable Tray', sales: 28, revenue: '$531.72' },
    { name: 'Gaming Keycap', sales: 24, revenue: '$359.76' }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'order',
      message: 'New order #ORD-005 received',
      time: '2 minutes ago',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'product',
      message: 'Product "Custom Headphone Stand" added',
      time: '15 minutes ago',
      icon: Package,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'customer',
      message: 'New customer registration',
      time: '1 hour ago',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'order',
      message: 'Order #ORD-003 marked as delivered',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'default'
      case 'shipped': return 'default'
      case 'processing': return 'secondary'
      case 'pending': return 'secondary'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="p-0">
      {/* Header */}
      <div className="px-6 pt-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your 3D print shop.</p>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    )}
                    <span className={`text-xs font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">{stat.description}</span>
                  </div>
                </CardContent>
                {/* Gradient overlay for visual appeal */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Charts and Analytics Row */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Sales Overview</span>
              </CardTitle>
              <CardDescription>Revenue trends for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {/* ResponsiveContainer: Automatically adjusts chart size to fit parent */}
              {/* WHY: Ensures chart looks good on all screen sizes (mobile, tablet, desktop) */}
              {/* height="100%" with parent h-64 (256px) creates consistent chart height */}
              <ResponsiveContainer width="100%" height={256}>
                {/* LineChart: Main container for line graph visualization */}
                {/* WHY: Line charts are perfect for showing trends over time (days in this case) */}
                {/* data={salesData}: Provides the data points to plot on the chart */}
                {/* margin: Adds padding inside chart area so labels don't get cut off */}
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  {/* CartesianGrid: Draws grid lines behind the chart */}
                  {/* WHY: Grid lines help users read exact values from the chart more easily */}
                  {/* strokeDasharray="3 3": Creates dashed lines (3px dash, 3px gap) for subtle appearance */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  
                  {/* XAxis: Horizontal axis showing day labels (Mon, Tue, Wed, etc.) */}
                  {/* WHY: X-axis typically shows the time/category dimension */}
                  {/* dataKey="day": Tells XAxis to use the "day" property from salesData objects */}
                  {/* stroke="#6b7280": Gray color for axis line matching design system */}
                  <XAxis 
                    dataKey="day" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  
                  {/* YAxis: Vertical axis showing revenue values */}
                  {/* WHY: Y-axis shows the numeric values (revenue amounts) */}
                  {/* stroke="#6b7280": Matches X-axis styling for consistency */}
                  {/* tickFormatter: Formats numbers with $ sign and comma separators */}
                  {/* WHY: Makes revenue amounts more readable (e.g., "$2,000" instead of "2000") */}
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                  />
                  
                  {/* Tooltip: Popup that appears when hovering over data points */}
                  {/* WHY: Users can see exact values by hovering over the line */}
                  {/* contentStyle: Styles the tooltip box */}
                  {/* formatter: Customizes how values are displayed in tooltip */}
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    labelStyle={{ color: '#374151', fontWeight: 600 }}
                  />
                  
                  {/* Line: The actual line that connects data points */}
                  {/* WHY: Visual representation of how revenue changes day by day */}
                  {/* type="monotone": Creates smooth curves instead of sharp angles */}
                  {/* dataKey="revenue": Uses "revenue" property from salesData for Y-axis values */}
                  {/* stroke="#2563eb": Blue color matching the design system */}
                  {/* strokeWidth={2}: Makes line slightly thicker for better visibility */}
                  {/* dot: Shows small circles at each data point */}
                  {/* activeDot: Larger circle appears when hovering over a point */}
                  {/* WHY: Visual feedback helps users identify specific data points */}
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', r: 4 }}
                    activeDot={{ r: 6, fill: '#1d4ed8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest updates from your shop</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 ${activity.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Recent Orders</span>
                </span>
                <Badge variant="outline" className="text-xs">
                  {recentOrders.length} orders
                </Badge>
              </CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{order.id}</span>
                        <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{order.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Top Products</span>
                </span>
                <Badge variant="outline" className="text-xs">
                  This month
                </Badge>
              </CardTitle>
              <CardDescription>Best performing products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">#{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-green-600">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="px-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                <Package className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-sm">Add Product</p>
                <p className="text-xs text-gray-500">Create new item</p>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                <Download className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium text-sm">Export Data</p>
                <p className="text-xs text-gray-500">Download reports</p>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                <Users className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium text-sm">View Customers</p>
                <p className="text-xs text-gray-500">Manage users</p>
              </button>
              <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
                <Settings className="h-6 w-6 text-orange-600 mb-2" />
                <p className="font-medium text-sm">Settings</p>
                <p className="text-xs text-gray-500">Configure shop</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
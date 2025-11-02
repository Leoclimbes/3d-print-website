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
// Recharts imports - A popular React charting library
// LineChart: Creates a line chart (good for showing trends over time)
// AreaChart: Similar to line but with filled area under the line (more visual)
// PieChart: Circular chart showing proportions/percentages
// Tooltip: Shows data when you hover over chart elements
// Legend: Shows what each color/series represents
// ResponsiveContainer: Makes chart automatically resize to fit its container
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// ============================================================================
// MOCK DATA - Defined at module level (outside component)
// ============================================================================
// WHY: These data objects are created once when the module loads, not on every render.
// This prevents unnecessary object recreation on every component re-render, improving performance.
// React components re-render frequently (on state changes, prop updates, etc.), so moving
// static mock data outside the component ensures it's only created once.

// Main analytics metrics with trends and comparisons
const analyticsData = {
  revenue: {
    current: 12450.75,
    previous: 10890.25,
    change: 14.3,
    trend: 'up' as const  // 'as const' makes TypeScript treat 'up' as literal type, not string
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

// Top selling products with sales numbers and growth metrics
const topSellingProducts = [
  { name: 'Custom Phone Stand', sales: 45, revenue: 584.55, growth: 12.5 },
  { name: 'Dragon Figurine', sales: 32, revenue: 799.68, growth: 8.3 },
  { name: 'Cable Tray', sales: 28, revenue: 531.72, growth: 15.2 },
  { name: 'Gaming Keycap Set', sales: 24, revenue: 359.76, growth: 22.1 },
  { name: 'Desk Organizer', sales: 21, revenue: 315.21, growth: 5.7 }
]

// Monthly revenue data for chart visualization (currently placeholder)
const monthlyRevenue = [
  { month: 'Jan', revenue: 8500 },
  { month: 'Feb', revenue: 9200 },
  { month: 'Mar', revenue: 10800 },
  { month: 'Apr', revenue: 11200 },
  { month: 'May', revenue: 12450 },
  { month: 'Jun', revenue: 13100 }
]

// Order status breakdown showing distribution of orders by status
const orderStatusDistribution = [
  { status: 'Completed', count: 89, percentage: 57.1 },
  { status: 'Processing', count: 34, percentage: 21.8 },
  { status: 'Shipped', count: 23, percentage: 14.7 },
  { status: 'Pending', count: 10, percentage: 6.4 }
]

// Color palette for charts - defined as constants for reusability
// COLORS array: Used for pie chart segments, each status gets a unique color
// These colors are visually distinct and accessible (good contrast)
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] // blue, green, orange, red

export default function AnalyticsPage() {

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
            {/* ResponsiveContainer: Wraps the chart and makes it responsive (adapts to container size) */}
            {/* width="100%" height={250}: Chart takes full width, fixed height of 250px */}
            <ResponsiveContainer width="100%" height={250}>
              {/* AreaChart: Creates an area chart (line with filled area underneath) */}
              {/* data: The data array to visualize (monthlyRevenue from above) */}
              {/* margin: Adds padding inside chart so axis labels don't get cut off */}
              <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                {/* CartesianGrid: Adds grid lines (horizontal/vertical) for easier reading */}
                {/* strokeDasharray: Makes dashed lines instead of solid */}
                {/* stroke: Gray color for grid lines (light so they don't distract) */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                
                {/* XAxis: The horizontal axis (bottom) showing month names */}
                {/* dataKey="month": Which property from data array to display on X-axis */}
                {/* stroke: Color of axis line and labels */}
                {/* tick: Custom styling for the month labels */}
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                
                {/* YAxis: The vertical axis (left) showing revenue values */}
                {/* stroke: Color of axis line and labels */}
                {/* tick: Custom styling for revenue value labels */}
                {/* tickFormatter: Formats numbers - adds $ and commas (e.g., "$12,450") */}
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                
                {/* Tooltip: Shows detailed info when hovering over chart points */}
                {/* cursor: Shows a line/indicator where you're hovering */}
                {/* contentStyle: Custom styling for the tooltip popup */}
                <Tooltip 
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '8px 12px'
                  }}
                  // labelFormatter: Custom format for the month label in tooltip
                  labelFormatter={(label) => `Month: ${label}`}
                  // formatter: Custom format for the revenue value in tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                
                {/* Area: The actual visual element - the filled area/line */}
                {/* type: "monotone" creates smooth curved lines (other options: linear, step) */}
                {/* dataKey="revenue": Which property from data to plot */}
                {/* stroke: Color of the line (blue) */}
                {/* strokeWidth: Thickness of the line */}
                {/* fill: Color of the filled area underneath (blue with transparency) */}
                {/* fillOpacity: How transparent the fill is (0.1 = 10% opacity, mostly see-through) */}
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="#3b82f6" 
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
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
            {/* ResponsiveContainer: Makes the pie chart responsive and fit container */}
            <ResponsiveContainer width="100%" height={250}>
              {/* PieChart: Creates a circular pie chart showing proportions */}
              <PieChart>
                {/* Pie: The actual pie chart element */}
                {/* data: The data array (orderStatusDistribution) */}
                {/* dataKey: Which property to use for the size of each slice (percentage) */}
                {/* nameKey: Which property to use for labeling (status) */}
                {/* cx, cy: Center position of pie (50% = middle of container) */}
                {/* outerRadius: Size of the pie (80px radius = 160px diameter) */}
                {/* fill: Default color (gets overridden by Cell colors below) */}
                {/* label: Function to show labels on each slice */}
                <Pie
                  data={orderStatusDistribution}
                  dataKey="percentage"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ status, percentage }) => `${status}: ${percentage}%`}
                >
                  {/* Cell: Individual slice styling - one for each data item */}
                  {/* We map through COLORS array to give each slice a different color */}
                  {/* index: The position in the data array (0, 1, 2, 3) */}
                  {orderStatusDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                
                {/* Tooltip: Shows detailed info when hovering over pie slices */}
                {/* contentStyle: Custom styling for the tooltip popup */}
                {/* formatter: Custom format - shows count and percentage */}
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '8px 12px'
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${props.payload.count} orders (${value}%)`,
                    props.payload.status
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend: Visual key showing what each color represents */}
            {/* This adds a nice legend below the chart */}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {orderStatusDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {/* Color indicator: Small square showing the color for this status */}
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  {/* Status label and count */}
                  <span className="text-sm font-medium">{item.status}</span>
                  <span className="text-xs text-gray-500">({item.count})</span>
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

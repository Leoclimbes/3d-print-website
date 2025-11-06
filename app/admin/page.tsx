'use client'

// ============================================================================
// ADMIN DASHBOARD - Overview of shop statistics and recent activity
// ============================================================================
// WHY: Admins need to see key metrics, recent orders, and sales trends
// This page fetches real data from the orders API instead of using mock data

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
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
  Activity,
  CheckCircle,
  AlertCircle,
  Home
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
  // ROUTER SETUP - Navigation handling
  // ============================================================================
  // WHY: useRouter hook from Next.js allows programmatic navigation in client components
  // This lets us navigate to different pages when users click the quick action buttons
  const router = useRouter()

  // ============================================================================
  // STATE MANAGEMENT - Track orders, products, and loading state
  // ============================================================================
  // WHY: We need to fetch orders and products from the API to calculate real statistics
  
  // Orders state - stores all orders fetched from API
  // WHY: We need orders to calculate revenue, recent orders, top products, etc.
  const [orders, setOrders] = useState<any[]>([])
  
  // Products state - stores all products fetched from API
  // WHY: We need products to calculate total products count
  const [products, setProducts] = useState<any[]>([])
  
  // Loading state - tracks if data is being fetched
  // WHY: We need to show loading state while fetching data
  const [isLoading, setIsLoading] = useState(true)
  
  // ============================================================================
  // FETCH DATA - Load orders and products from API
  // ============================================================================
  // WHY: We need to fetch real data to replace mock data with actual statistics
  
  // useEffect hook - runs when component mounts
  // WHY: We want to fetch data as soon as the page loads
  useEffect(() => {
    // Fetch orders and products from API
    // WHY: We need real data to calculate statistics
    const fetchData = async () => {
      try {
        // Set loading state to true
        // WHY: Show loading indicator while fetching
        setIsLoading(true)
        
        // Fetch orders and products in parallel
        // WHY: Fetching in parallel is faster than sequential fetches
        const [ordersResponse, productsResponse] = await Promise.all([
          fetch('/api/orders'),  // Fetch all orders
          fetch('/api/products') // Fetch all products
        ])
        
        // Check if orders request was successful
        // WHY: Handle errors gracefully
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders')
        }
        
        // Check if products request was successful
        // WHY: Handle errors gracefully
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products')
        }
        
        // Parse JSON responses
        // WHY: API returns JSON data
        const ordersData = await ordersResponse.json()
        const productsData = await productsResponse.json()
        
        // Update state with fetched data
        // WHY: Store data in state so we can use it to calculate statistics
        setOrders(ordersData.orders || [])
        setProducts(productsData.products || productsData || [])
        
      } catch (error) {
        // Handle errors during fetch
        // WHY: Network errors or API errors need to be handled gracefully
        console.error('Error fetching dashboard data:', error)
        // Set empty arrays on error
        // WHY: Better to show empty data than crash the app
        setOrders([])
        setProducts([])
      } finally {
        // Set loading state to false
        // WHY: Hide loading indicator after fetch completes (success or error)
        setIsLoading(false)
      }
    }
    
    // Call fetch function
    // WHY: Fetch data when component mounts
    fetchData()
  }, []) // Empty dependency array - only run once on mount
  
  // ============================================================================
  // CALCULATE STATISTICS - Calculate real stats from orders and products
  // ============================================================================
  // WHY: We need to calculate actual statistics from real data instead of using mock data
  
  // Ensure orders and products are arrays (safety check)
  // WHY: Prevent errors if API returns unexpected data structure
  const ordersArray = Array.isArray(orders) ? orders : []
  const productsArray = Array.isArray(products) ? products : []
  
  // Calculate total revenue from all paid orders
  // WHY: Total revenue is sum of all paid orders
  const totalRevenue = ordersArray
    .filter(order => order && order.payment_status === 'paid')  // Only count paid orders
    .reduce((sum, order) => sum + (order.total_amount || 0), 0)  // Sum all amounts
  
  // Format total revenue as currency string
  // WHY: Display revenue in readable format (e.g., "$1,234.56")
  const totalRevenueFormatted = `$${totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  
  // Calculate total orders count
  // WHY: Total orders is the count of all orders
  const totalOrders = ordersArray.length
  
  // Format total orders as string with comma separator
  // WHY: Display order count in readable format (e.g., "1,234")
  const totalOrdersFormatted = totalOrders.toLocaleString()
  
  // Calculate total products count
  // WHY: Total products is the count of all products
  const totalProducts = productsArray.length
  
  // Format total products as string (with safety check)
  // WHY: Display product count in readable format, ensure it's a number first
  const totalProductsFormatted = (totalProducts || 0).toString()
  
  // Calculate unique customers (unique email addresses)
  // WHY: Total customers is the count of unique customer emails
  const uniqueCustomers = new Set(
    ordersArray
      .filter(order => order && order.customer_email)  // Filter out orders without email
      .map(order => order.customer_email)  // Get email addresses
  ).size
  
  // Format unique customers as string with comma separator
  // WHY: Display customer count in readable format
  const uniqueCustomersFormatted = (uniqueCustomers || 0).toLocaleString()
  
  // Stats array - calculated from real data
  // WHY: Display real statistics instead of mock data
  const stats = [
    {
      title: 'Total Revenue',
      value: totalRevenueFormatted,
      change: '',  // Could calculate change vs previous period if needed
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'from all orders'
    },
    {
      title: 'Total Orders',
      value: totalOrdersFormatted,
      change: '',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      description: 'total orders'
    },
    {
      title: 'Total Products',
      value: totalProductsFormatted,
      change: '',
      changeType: 'positive' as const,
      icon: Package,
      description: 'active products'
    },
    {
      title: 'Total Customers',
      value: uniqueCustomersFormatted,
      change: '',
      changeType: 'positive' as const,
      icon: Users,
      description: 'unique customers'
    }
  ]
  
  // ============================================================================
  // CALCULATE SALES DATA - Last 7 days of revenue
  // ============================================================================
  // WHY: We need to calculate daily revenue for the sales chart from real orders
  
  // Get last 7 days of dates
  // WHY: We want to show revenue for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    // Calculate date for each day (most recent first, going backwards)
    // WHY: We want today as the last day, and 6 days ago as the first day
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))  // Start from 6 days ago, end today
    return date
  })
  
  // Calculate revenue for each day
  // WHY: We need daily revenue data for the sales chart
  const salesData = last7Days.map(date => {
    // Get day name (Mon, Tue, Wed, etc.)
    // WHY: Chart needs day labels
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    
    // Calculate revenue for this day
    // WHY: We need to sum all paid orders created on this day
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)  // Start of day (midnight)
    
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)  // End of day (11:59:59 PM)
    
    // Filter orders created on this day and that are paid
    // WHY: Only count paid orders for revenue
    const dayOrders = ordersArray.filter(order => {
      // Safety check - ensure order exists and has created_at
      if (!order || !order.created_at) return false
      
      const orderDate = new Date(order.created_at)
      return order.payment_status === 'paid' && 
             orderDate >= dayStart && 
             orderDate <= dayEnd
    })
    
    // Sum revenue for this day
    // WHY: Calculate total revenue for the day
    const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    
    // Return day data for chart
    // WHY: Chart needs { day, revenue } format
    return {
      day: dayName,
      revenue: dayRevenue
    }
  })
  
  // ============================================================================
  // GET RECENT ORDERS - Latest orders from database
  // ============================================================================
  // WHY: Display the most recent orders instead of mock data
  
  // Get recent orders (last 4 orders, sorted by creation date descending)
  // WHY: Show the most recent orders first
  const recentOrders = ordersArray
    .filter(order => order && order.created_at)  // Filter out invalid orders
    .sort((a, b) => {
      // Sort by creation date (newest first)
      // WHY: Most recent orders should appear first
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA  // Descending order (newest first)
    })
    .slice(0, 4)  // Get only first 4 orders
    .map(order => ({
      // Format order data for display
      // WHY: Convert order data to display format
      id: order.id || 'Unknown',
      customer: order.customer_name || 'Unknown Customer',
      amount: `$${(order.total_amount || 0).toFixed(2)}`,
      status: order.status || 'pending',
      date: new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }))
  
  // ============================================================================
  // CALCULATE TOP PRODUCTS - Best selling products from orders
  // ============================================================================
  // WHY: Display top products based on actual sales from orders
  
  // Calculate product sales from order items
  // WHY: We need to count how many times each product was sold
  const productSales = new Map<string, { name: string; sales: number; revenue: number }>()
  
  // Loop through all orders to count product sales
  // WHY: We need to aggregate sales data from all orders
  ordersArray.forEach(order => {
    // Safety check - ensure order exists and is paid
    // WHY: Only count products from paid orders
    if (order && order.payment_status === 'paid' && Array.isArray(order.items)) {
      // Loop through each item in the order
      // WHY: Each item represents a product sale
      order.items.forEach((item: any) => {
        // Safety check - ensure item exists
        // WHY: Skip invalid items
        if (!item) return
        
        // Get product name (use product_name from order item)
        // WHY: Order items have product_name as a snapshot
        const productName = item.product_name || 'Unknown Product'
        
        // Get or create product sales entry
        // WHY: We need to track sales per product
        const existing = productSales.get(productName) || { name: productName, sales: 0, revenue: 0 }
        
        // Update sales count (add quantity)
        // WHY: Count how many units were sold
        existing.sales += item.quantity || 0
        
        // Update revenue (add item total)
        // WHY: Calculate total revenue per product
        existing.revenue += (item.quantity || 0) * (item.price_at_purchase || 0)
        
        // Save back to map
        // WHY: Update the product sales data
        productSales.set(productName, existing)
      })
    }
  })
  
  // Convert map to array and sort by sales (descending)
  // WHY: Get top products sorted by number of sales
  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.sales - a.sales)  // Sort by sales count (highest first)
    .slice(0, 4)  // Get only top 4 products
    .map(product => ({
      // Format product data for display
      // WHY: Convert to display format with formatted revenue
      name: product.name,
      sales: product.sales,
      revenue: `$${product.revenue.toFixed(2)}`
    }))
  
  // ============================================================================
  // GET RECENT ACTIVITIES - Recent order updates and changes
  // ============================================================================
  // WHY: Display recent activities based on actual order updates
  
  // Get recent activities from orders (last 4 orders)
  // WHY: Show recent activities based on order updates
  const recentActivities = ordersArray
    .filter(order => order && (order.updated_at || order.created_at))  // Filter out invalid orders
    .sort((a, b) => {
      // Sort by updated date (newest first)
      // WHY: Most recent activities should appear first
      const dateA = new Date(a.updated_at || a.created_at).getTime()
      const dateB = new Date(b.updated_at || b.created_at).getTime()
      return dateB - dateA  // Descending order (newest first)
    })
    .slice(0, 4)  // Get only first 4 activities
    .map((order, index) => {
      // Calculate time ago (e.g., "2 minutes ago")
      // WHY: Display relative time for better UX
      const updatedDate = new Date(order.updated_at || order.created_at)
      const now = new Date()
      const diffMs = now.getTime() - updatedDate.getTime()
      const diffMins = Math.floor(diffMs / 60000)  // Minutes
      const diffHours = Math.floor(diffMs / 3600000)  // Hours
      const diffDays = Math.floor(diffMs / 86400000)  // Days
      
      // Format time ago string
      // WHY: Human-readable time format
      let timeAgo = ''
      if (diffMins < 1) {
        timeAgo = 'Just now'
      } else if (diffMins < 60) {
        timeAgo = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
      } else {
        timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
      }
      
      // Determine activity message and icon based on order status
      // WHY: Different messages for different order statuses
      let message = ''
      let icon = ShoppingCart
      let color = 'text-blue-600'
      
      if (order.status === 'delivered') {
        message = `Order ${order.id} marked as delivered`
        icon = CheckCircle
        color = 'text-green-600'
      } else if (order.status === 'shipped') {
        message = `Order ${order.id} shipped`
        icon = Package
        color = 'text-blue-600'
      } else if (order.status === 'processing') {
        message = `Order ${order.id} is being processed`
        icon = Clock
        color = 'text-yellow-600'
      } else {
        message = `New order ${order.id} received`
        icon = ShoppingCart
        color = 'text-blue-600'
      }
      
      // Return activity object
      // WHY: Format activity data for display
      return {
        id: order.id,
        type: 'order',
        message: message,
        time: timeAgo,
        icon: icon,
        color: color
      }
    })

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

  // ============================================================================
  // QUICK ACTION HANDLERS - Navigation functions
  // ============================================================================
  // WHY: These functions handle clicks on quick action buttons and navigate to appropriate pages
  // Each function uses router.push() to navigate to a different admin section

  // Handle "Add Product" button click
  // WHY: Navigates to the product creation page when admin wants to add a new product
  const handleAddProduct = () => {
    router.push('/admin/products/new')
  }

  // Handle "View Customers" button click
  // WHY: Navigates to the customer management page to view and manage all customers
  const handleViewCustomers = () => {
    router.push('/admin/customers')
  }

  // Handle "Go to Main Page" button click
  // WHY: Navigates to the main/home page of the website when admin wants to view the public-facing site
  // This allows admins to quickly switch from admin dashboard to the customer-facing homepage
  const handleGoToMainPage = () => {
    router.push('/')  // Navigate to root route which is the main/home page
  }

  // ============================================================================
  // LOADING STATE - Show loading indicator while fetching data
  // ============================================================================
  // WHY: Users should see a loading state while data is being fetched
  
  // Show loading state if data is still loading
  // WHY: Better UX to show loading indicator than empty dashboard
  if (isLoading) {
    return (
      <div className="p-0">
        <div className="px-6 pt-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Loading dashboard data...</p>
        </div>
        <div className="px-6">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Loading statistics and orders...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-0">
      {/* Header */}
      <div className="px-6 pt-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your 3D print shop.</p>
      </div>

      {/* Quick Actions - Moved to top for easy access */}
      {/* WHY: Quick actions should be prominently placed so admins can quickly navigate to common tasks */}
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
            {/* Grid layout: 2 columns on mobile, 3 columns on medium+ screens */}
            {/* WHY: Responsive design ensures buttons look good on all device sizes */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Add Product Button */}
              {/* WHY: onClick handler triggers navigation to product creation page */}
              {/* className includes hover states for visual feedback when user hovers */}
              <button 
                onClick={handleAddProduct}
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left cursor-pointer"
              >
                <Package className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-sm">Add Product</p>
                <p className="text-xs text-gray-500">Create new item</p>
              </button>
              
              {/* View Customers Button */}
              {/* WHY: onClick handler navigates to customer management page */}
              <button 
                onClick={handleViewCustomers}
                className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left cursor-pointer"
              >
                <Users className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium text-sm">View Customers</p>
                <p className="text-xs text-gray-500">Manage users</p>
              </button>
              
              {/* Go to Main Page Button */}
              {/* WHY: onClick handler navigates to the main/home page of the website */}
              {/* This button allows admins to quickly switch from admin dashboard view to the public-facing homepage */}
              {/* className includes hover states: bg-gray-50 (light gray background) -> bg-gray-100 (darker on hover) */}
              {/* transition-colors: Smoothly animates color changes when hovering for better UX */}
              <button 
                onClick={handleGoToMainPage}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left cursor-pointer"
              >
                {/* Home icon from lucide-react: Represents the main/home page */}
                {/* text-gray-600: Gray color for the icon matching the button's gray theme */}
                <Home className="h-6 w-6 text-gray-600 mb-2" />
                <p className="font-medium text-sm">Main Page</p>
                <p className="text-xs text-gray-500">View homepage</p>
              </button>
            </div>
          </CardContent>
        </Card>
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
              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity</p>
                  <p className="text-sm mt-2">Activity will appear here as orders are placed and updated</p>
                </div>
              ) : (
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
              )}
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
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No orders yet</p>
                  <p className="text-sm mt-2">Orders will appear here once customers make purchases</p>
                </div>
              ) : (
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
              )}
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
              {topProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No product sales yet</p>
                  <p className="text-sm mt-2">Top products will appear here once orders are placed</p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
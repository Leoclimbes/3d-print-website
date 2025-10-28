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
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Search,
  Download,
  Settings,
  Bell,
  Mail,
  MessageSquare,
  Heart,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Activity,
  Target,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

export default function AdminDashboard() {
  // Enhanced mock data for demo purposes
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,345',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'vs last month',
      color: 'blue',
      trend: [120, 135, 142, 138, 145, 152, 148]
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      description: 'vs last month',
      color: 'green',
      trend: [45, 52, 48, 55, 62, 58, 65]
    },
    {
      title: 'Total Customers',
      value: '567',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'vs last month',
      color: 'purple',
      trend: [12, 18, 15, 22, 28, 25, 32]
    },
    {
      title: 'Total Products',
      value: '89',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: Package,
      description: 'vs last month',
      color: 'orange',
      trend: [95, 92, 88, 85, 89, 87, 89]
    }
  ]

  const recentOrders = [
    { 
      id: 'ORD-001', 
      customer: 'John Doe', 
      amount: '$89.99', 
      status: 'Processing', 
      date: '2 hours ago',
      items: ['Dragon Figurine', 'Phone Stand'],
      avatar: 'JD'
    },
    { 
      id: 'ORD-002', 
      customer: 'Jane Smith', 
      amount: '$45.50', 
      status: 'Shipped', 
      date: '4 hours ago',
      items: ['Cable Tray'],
      avatar: 'JS'
    },
    { 
      id: 'ORD-003', 
      customer: 'Bob Johnson', 
      amount: '$67.25', 
      status: 'Delivered', 
      date: '6 hours ago',
      items: ['Phone Stand', 'Herb Markers'],
      avatar: 'BJ'
    },
    { 
      id: 'ORD-004', 
      customer: 'Alice Brown', 
      amount: '$34.99', 
      status: 'Pending', 
      date: '1 day ago',
      items: ['Custom Keychain'],
      avatar: 'AB'
    },
    { 
      id: 'ORD-005', 
      customer: 'Mike Wilson', 
      amount: '$156.75', 
      status: 'Processing', 
      date: '1 day ago',
      items: ['Dragon Figurine', 'Cable Tray', 'Phone Stand'],
      avatar: 'MW'
    },
  ]

  const topProducts = [
    { 
      name: 'Dragon Figurine', 
      sales: 45, 
      revenue: '$1,124.55',
      rating: 4.8,
      reviews: 23,
      category: 'Toys & Games',
      image: '🐉'
    },
    { 
      name: 'Cable Management Tray', 
      sales: 32, 
      revenue: '$607.68',
      rating: 4.6,
      reviews: 18,
      category: 'Home & Garden',
      image: '📱'
    },
    { 
      name: 'Custom Phone Stand', 
      sales: 28, 
      revenue: '$363.72',
      rating: 4.7,
      reviews: 15,
      category: 'Accessories',
      image: '📱'
    },
    { 
      name: 'Herb Garden Markers', 
      sales: 25, 
      revenue: '$249.75',
      rating: 4.9,
      reviews: 12,
      category: 'Home & Garden',
      image: '🌱'
    },
  ]

  const recentActivity = [
    {
      type: 'order',
      message: 'New order received',
      details: 'Order #ORD-006 - $78.50',
      time: '5 minutes ago',
      icon: CheckCircle,
      color: 'green'
    },
    {
      type: 'product',
      message: 'Product added',
      details: 'Custom Keychain v2',
      time: '1 hour ago',
      icon: Plus,
      color: 'blue'
    },
    {
      type: 'customer',
      message: 'New customer registered',
      details: 'sarah.johnson@email.com',
      time: '2 hours ago',
      icon: Users,
      color: 'purple'
    },
    {
      type: 'alert',
      message: 'Low stock alert',
      details: 'Dragon Figurine - 2 left',
      time: '3 hours ago',
      icon: AlertCircle,
      color: 'yellow'
    },
    {
      type: 'review',
      message: 'New 5-star review',
      details: 'Cable Tray by Mike Wilson',
      time: '4 hours ago',
      icon: Star,
      color: 'orange'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Pending': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActivityIconColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-100'
      case 'blue': return 'text-blue-600 bg-blue-100'
      case 'purple': return 'text-purple-600 bg-purple-100'
      case 'yellow': return 'text-yellow-600 bg-yellow-100'
      case 'orange': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="p-0 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="mb-6 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your 3D print business today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
          }
          
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="flex items-center space-x-2 text-sm">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 px-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Sales Overview</span>
                </CardTitle>
                <CardDescription>Revenue trends over the last 7 days</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">7 days</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">30 days</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">90 days</button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Sales Chart</p>
                <p className="text-sm text-gray-500">Chart integration coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest updates from your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getActivityIconColor(activity.color)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 px-6">
        {/* Enhanced Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Orders</span>
                </CardTitle>
                <CardDescription>Latest orders from your customers</CardDescription>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {order.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.items.join(', ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount}</p>
                    <Badge className={`${getStatusColor(order.status)} border`}>
                      {order.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Top Products</span>
                </CardTitle>
                <CardDescription>Your best-selling products this month</CardDescription>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{product.image}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} sales • {product.category}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{product.revenue}</p>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">#{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="px-6 mb-8">
        <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="group p-6 text-left border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Add Product</h3>
              <p className="text-sm text-gray-600">Create a new 3D printed product</p>
            </button>
            
            <button className="group p-6 text-left border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Process Orders</h3>
              <p className="text-sm text-gray-600">Update order statuses and tracking</p>
            </button>
            
            <button className="group p-6 text-left border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">Customer and admin management</p>
            </button>
            
            <button className="group p-6 text-left border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
              <p className="text-sm text-gray-600">Sales performance insights</p>
            </button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
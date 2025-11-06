// ============================================================================
// ORDERS API ROUTE - Get all orders
// ============================================================================
// WHY: Admin panel needs to fetch all orders to display them
// This endpoint returns all orders from the database (with optional filtering)

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ordersDb } from '@/lib/orders-db'
import { logger } from '@/lib/logger'

// GET /api/orders - Get all orders
// WHY: Admin panel needs to fetch all orders to display in the orders page
// SECURITY: Only admins can access all orders (regular users can only see their own)
export async function GET(request: NextRequest) {
  try {
    // ========================================================================
    // AUTHENTICATION - Check if user is logged in and is admin
    // ========================================================================
    // WHY: Only admins should be able to see all orders
    
    // Get current session to check authentication
    // WHY: We need to verify the user is logged in and has admin privileges
    const session = await getServerSession(authOptions)
    
    // Check if user is logged in
    // WHY: Only authenticated users can access orders
    if (!session || !session.user) {
      // Return unauthorized error if not logged in
      // WHY: User needs to be authenticated to access orders
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 } // 401 Unauthorized
      )
    }
    
    // Check if user is admin
    // WHY: Only admins can see all orders (regular users should use a different endpoint)
    // NOTE: In production, you might want to allow users to see their own orders
    if (session.user.role !== 'admin') {
      // Return forbidden error if not admin
      // WHY: Regular users don't have permission to see all orders
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 } // 403 Forbidden
      )
    }
    
    // ========================================================================
    // FETCH ORDERS - Get all orders from database
    // ========================================================================
    // WHY: Admin panel needs all orders to display them
    
    // Get all orders from database
    // WHY: We need to fetch all orders to display in admin panel
    const orders = ordersDb.getAllOrders()
    
    // ========================================================================
    // OPTIONAL FILTERING - Filter orders by status or payment status
    // ========================================================================
    // WHY: Admin might want to filter orders by status (e.g., only show pending orders)
    
    // Get query parameters from URL
    // WHY: Admin might want to filter orders by status or payment status
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')  // Filter by order status
    const paymentStatusFilter = searchParams.get('payment_status')  // Filter by payment status
    
    // Filter orders if filters are provided
    // WHY: Allow admin to filter orders by status or payment status
    let filteredOrders = orders
    
    // Filter by order status if provided
    // WHY: Admin might want to see only pending, processing, shipped, etc.
    if (statusFilter && statusFilter !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter)
    }
    
    // Filter by payment status if provided
    // WHY: Admin might want to see only paid orders, pending payments, etc.
    if (paymentStatusFilter && paymentStatusFilter !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.payment_status === paymentStatusFilter)
    }
    
    // ========================================================================
    // SUCCESS RESPONSE - Return filtered orders
    // ========================================================================
    
    // Return orders as JSON
    // WHY: Frontend needs orders in JSON format to display them
    return NextResponse.json(
      {
        orders: filteredOrders,  // Array of orders
        total: filteredOrders.length,  // Total count of filtered orders
      },
      { status: 200 } // 200 OK - success
    )
    
  } catch (error) {
    // Handle any errors that occur during processing
    // WHY: Database errors, authentication errors, etc. need to be handled gracefully
    logger.error('Error fetching orders', error as Error)
    
    // Return error response
    // WHY: Frontend needs to know if something went wrong
    return NextResponse.json(
      {
        error: 'An error occurred while fetching orders',
      },
      { status: 500 } // 500 Internal Server Error - server error
    )
  }
}


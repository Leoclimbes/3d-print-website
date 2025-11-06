// ============================================================================
// ORDER BY ID API ROUTE - Get a single order by ID
// ============================================================================
// WHY: Checkout success page and admin order details need to fetch a single order
// This endpoint returns order details for a specific order ID

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ordersDb } from '@/lib/orders-db'
import { logger } from '@/lib/logger'

// GET /api/orders/[id] - Get a single order by ID
// WHY: Checkout success page needs to display order details after payment
// Also used by admin panel to view order details
// SECURITY: Users can only see their own orders (unless they're admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // ========================================================================
    // GET ORDER ID - Extract order ID from URL parameters
    // ========================================================================
    // WHY: We need the order ID from the URL to fetch the specific order
    
    // Handle both promise and non-promise params (Next.js 15+ compatibility)
    // WHY: Next.js 15 changed params to be async, but we need to support both
    const resolvedParams = await Promise.resolve(params)
    const orderId = resolvedParams.id
    
    // Validate order ID is provided
    // WHY: We can't fetch an order without an ID
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 } // 400 Bad Request
      )
    }
    
    // ========================================================================
    // AUTHENTICATION - Check if user is logged in (optional for guest orders)
    // ========================================================================
    // WHY: We want to allow users to view their own orders, but also allow guest checkout
    
    // Get current session to check authentication (optional)
    // WHY: Guest checkout orders should still be viewable by order ID
    let session = null
    try {
      session = await getServerSession(authOptions)
    } catch (error) {
      // If session check fails, continue without session (guest checkout)
      // WHY: Don't fail if session check fails - guest orders should still be viewable
      // logger.warn() only accepts 2 arguments: message and context (not error separately)
      logger.warn('Error getting session for order lookup', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
    }
    
    // ========================================================================
    // FETCH ORDER - Get order from database
    // ========================================================================
    // WHY: We need to fetch the order to return its details
    
    // Get order from database by ID
    // WHY: We need to fetch the specific order requested
    const order = ordersDb.getOrderById(orderId)
    
    // Check if order exists
    // WHY: Order might not exist (invalid ID, deleted, etc.)
    if (!order) {
      // Return not found error if order doesn't exist
      // WHY: User needs to know if order ID is invalid
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 } // 404 Not Found
      )
    }
    
    // ========================================================================
    // AUTHORIZATION - Check if user can view this order
    // ========================================================================
    // WHY: Users should only see their own orders (unless they're admin)
    
    // If user is logged in, check if they can view this order
    // WHY: Users should only see their own orders (unless they're admin)
    if (session && session.user) {
      // Check if user is admin (admins can see all orders)
      // WHY: Admins need to see all orders for management
      const isAdmin = session.user.role === 'admin'
      
      // Check if order belongs to this user
      // WHY: Users should be able to see their own orders
      const isOrderOwner = order.user_id === session.user.id
      
      // If user is not admin and order doesn't belong to them, deny access
      // WHY: Security - users shouldn't see other users' orders
      if (!isAdmin && !isOrderOwner) {
        // Return forbidden error if user doesn't have permission
        // WHY: User needs to know they don't have permission to view this order
        return NextResponse.json(
          { error: 'Forbidden - You do not have permission to view this order' },
          { status: 403 } // 403 Forbidden
        )
      }
    }
    // Note: If no session (guest checkout), we allow viewing by order ID
    // WHY: Guest checkout orders should be viewable by anyone with the order ID
    // This is a trade-off - in production, you might want to add email verification
    
    // ========================================================================
    // SUCCESS RESPONSE - Return order details
    // ========================================================================
    
    // Return order as JSON
    // WHY: Frontend needs order details in JSON format to display them
    return NextResponse.json(
      {
        order: order,  // Full order object with all details
      },
      { status: 200 } // 200 OK - success
    )
    
  } catch (error) {
    // Handle any errors that occur during processing
    // WHY: Database errors, authentication errors, etc. need to be handled gracefully
    logger.error('Error fetching order', error as Error)
    
    // Return error response
    // WHY: Frontend needs to know if something went wrong
    return NextResponse.json(
      {
        error: 'An error occurred while fetching order',
      },
      { status: 500 } // 500 Internal Server Error - server error
    )
  }
}

// PUT /api/orders/[id] - Update an order (e.g., change status)
// WHY: Admin panel needs to update order status (e.g., mark as shipped)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // ========================================================================
    // GET ORDER ID - Extract order ID from URL parameters
    // ========================================================================
    
    // Handle both promise and non-promise params (Next.js 15+ compatibility)
    const resolvedParams = await Promise.resolve(params)
    const orderId = resolvedParams.id
    
    // Validate order ID is provided
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    // ========================================================================
    // AUTHENTICATION - Check if user is admin
    // ========================================================================
    // WHY: Only admins should be able to update orders
    
    const session = await getServerSession(authOptions)
    
    // Check if user is logged in
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    // WHY: Only admins can update orders
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }
    
    // ========================================================================
    // PARSE REQUEST BODY - Get update data
    // ========================================================================
    
    // Parse JSON body from request
    // WHY: Update data is sent as JSON in the request body
    const body = await request.json()
    
    // Validate update data
    // WHY: We need to ensure valid status values
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded']
    
    // Build update object with only valid fields
    // WHY: We only want to update allowed fields
    const updates: {
      status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
      stripe_payment_id?: string | null
    } = {}
    
    // Add status if provided and valid
    // WHY: Only update status if it's a valid value
    if (body.status && validStatuses.includes(body.status)) {
      updates.status = body.status
    }
    
    // Add payment_status if provided and valid
    // WHY: Only update payment_status if it's a valid value
    if (body.payment_status && validPaymentStatuses.includes(body.payment_status)) {
      updates.payment_status = body.payment_status
    }
    
    // Add stripe_payment_id if provided
    // WHY: Allow updating Stripe payment ID
    if (body.stripe_payment_id !== undefined) {
      updates.stripe_payment_id = body.stripe_payment_id
    }
    
    // Check if any updates were provided
    // WHY: Can't update if no valid fields were provided
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid update fields provided' },
        { status: 400 }
      )
    }
    
    // ========================================================================
    // UPDATE ORDER - Save changes to database
    // ========================================================================
    
    // Update order in database
    // WHY: We need to persist the changes
    const updatedOrder = await ordersDb.updateOrder(orderId, updates)
    
    // Check if order was found
    // WHY: Order might not exist
    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // ========================================================================
    // SUCCESS RESPONSE - Return updated order
    // ========================================================================
    
    // Return updated order as JSON
    // WHY: Frontend needs the updated order to refresh the UI
    return NextResponse.json(
      {
        order: updatedOrder,
      },
      { status: 200 }
    )
    
  } catch (error) {
    // Handle any errors that occur during processing
    logger.error('Error updating order', error as Error)
    
    // Return error response
    return NextResponse.json(
      {
        error: 'An error occurred while updating order',
      },
      { status: 500 }
    )
  }
}


// ============================================================================
// CHECKOUT API ROUTE - Mock payment processing
// ============================================================================
// WHY: This API endpoint processes payment requests from the checkout page
// This is a MOCK payment system that only accepts card number "111111111111"
// In production, this would connect to a real payment processor like Stripe

import { NextRequest, NextResponse } from 'next/server'
import { ordersDb } from '@/lib/orders-db'
import { productsDb } from '@/lib/products-db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'

// ============================================================================
// INTERFACE DEFINITIONS - Type definitions for payment data
// ============================================================================

// Payment request interface - structure of data sent from checkout page
// WHY: TypeScript needs to know the shape of incoming payment data
interface PaymentRequest {
  cardNumber: string              // Card number - must be "111111111111" for mock system
  cardName: string                // Name on card
  expiryDate: string              // Expiry date (MM/YY format)
  cvv: string                     // CVV security code
  email: string                   // Email address for order confirmation
  shippingAddress: {              // Shipping address object
    street: string
    city: string
    state: string
    zipCode: string
  }
  items: Array<{                  // Cart items array
    id: string
    name: string
    price: number
    quantity: number
  }>
  total: number                   // Total order amount
}

// Payment response interface - structure of response sent back
// WHY: TypeScript needs to know what we're sending back
interface PaymentResponse {
  success: boolean                // Whether payment was successful
  orderId?: string                // Order ID if payment succeeded
  error?: string                  // Error message if payment failed
}

// ============================================================================
// CARD NUMBER VALIDATION - Validate card number
// ============================================================================

// Validate card number - check if it's the accepted test card
// WHY: Mock system only accepts "111111111111" for testing
// Takes card number and returns true if valid, false otherwise
function validateCardNumber(cardNumber: string): boolean {
  // Remove all spaces and non-digits from card number
  // WHY: Card number might have spaces, but we validate without spaces
  const cleaned = cardNumber.replace(/\s+/g, '').replace(/\D/g, '')
  
  // Check if card number is exactly "111111111111" (12 digits)
  // WHY: This is the only accepted card number for the mock payment system
  // In production, this would validate against real card number patterns (Luhn algorithm)
  return cleaned === '111111111111'
}

// ============================================================================
// PAYMENT PROCESSING - Process the payment
// ============================================================================

// POST handler - process payment request
// WHY: This is the main function that handles payment requests
// Takes payment data, validates it, and processes the payment
export async function POST(request: NextRequest) {
  try {
    // Parse JSON body from request
    // WHY: Payment data is sent as JSON in the request body
    const body: PaymentRequest = await request.json()
    
    // ========================================================================
    // VALIDATION - Validate all required fields
    // ========================================================================
    
    // Validate card number - must be "111111111111"
    // WHY: Mock system only accepts this specific card number
    if (!validateCardNumber(body.cardNumber)) {
      // Return error response if card number is invalid
      // WHY: User needs to know why payment failed
      return NextResponse.json<PaymentResponse>(
        {
          success: false,
          error: 'Invalid card number. Please use 1111 1111 1111 for testing.',
        },
        { status: 400 } // 400 Bad Request - client error
      )
    }
    
    // Validate card name - must be provided
    // WHY: Payment processing requires name on card
    if (!body.cardName || !body.cardName.trim()) {
      return NextResponse.json<PaymentResponse>(
        {
          success: false,
          error: 'Card name is required',
        },
        { status: 400 }
      )
    }
    
    // Validate expiry date - must be in MM/YY format
    // WHY: Payment processing requires valid expiry date
    if (!body.expiryDate || !/^\d{2}\/\d{2}$/.test(body.expiryDate)) {
      return NextResponse.json<PaymentResponse>(
        {
          success: false,
          error: 'Invalid expiry date format. Use MM/YY',
        },
        { status: 400 }
      )
    }
    
    // Validate CVV - must be 3-4 digits
    // WHY: Payment processing requires CVV for security
    if (!body.cvv || body.cvv.length < 3) {
      return NextResponse.json<PaymentResponse>(
        {
          success: false,
          error: 'Invalid CVV. Must be 3-4 digits',
        },
        { status: 400 }
      )
    }
    
    // Validate email - must be valid email format
    // WHY: We need email to send order confirmation
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json<PaymentResponse>(
        {
          success: false,
          error: 'Invalid email address',
        },
        { status: 400 }
      )
    }
    
    // Validate shipping address - all fields must be provided
    // WHY: We need complete address to ship products
    if (!body.shippingAddress.street?.trim() ||
        !body.shippingAddress.city?.trim() ||
        !body.shippingAddress.state?.trim() ||
        !body.shippingAddress.zipCode?.trim()) {
      return NextResponse.json<PaymentResponse>(
        {
          success: false,
          error: 'Complete shipping address is required',
        },
        { status: 400 }
      )
    }
    
    // Validate items - must have at least one item
    // WHY: Can't process payment for empty cart
    if (!body.items || body.items.length === 0) {
      return NextResponse.json<PaymentResponse>(
        {
          success: false,
          error: 'Cart is empty',
        },
        { status: 400 }
      )
    }
    
    // Validate total - must be positive number
    // WHY: Total must be a valid positive amount
    if (!body.total || body.total <= 0) {
      return NextResponse.json<PaymentResponse>(
        {
          success: false,
          error: 'Invalid order total',
        },
        { status: 400 }
      )
    }
    
    // ========================================================================
    // MOCK PAYMENT PROCESSING - Simulate payment processing
    // ========================================================================
    
    // Simulate payment processing delay
    // WHY: Real payment processing takes time, so we simulate it
    // In production, this would make actual API calls to payment processor
    await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
    
    // ========================================================================
    // FETCH PRODUCT DETAILS - Get full product information for order items
    // ========================================================================
    // WHY: We need product images and complete product info to save in the order
    // Order items should have snapshot of product data at time of purchase
    
    // Fetch product details for each item in the order
    // WHY: We need product images and complete product info for order records
    const orderItemsWithProductDetails = await Promise.all(
      body.items.map(async (item) => {
        // Fetch product from database using item ID
        // WHY: item.id is the product ID, we need to get full product details
        const product = productsDb.getProductById(item.id)
        
        // If product not found, use fallback data
        // WHY: Product might have been deleted, but we still want to save the order
        if (!product) {
          // Log warning if product not found
          // WHY: This shouldn't happen in normal flow, but we handle it gracefully
          logger.warn('Product not found when creating order', { productId: item.id })
          
          // Return item with fallback image
          // WHY: Order should still be created even if product is missing
          return {
            product_id: item.id,
            product_name: item.name,
            product_image: '/api/placeholder/300/300', // Fallback placeholder image
            quantity: item.quantity,
            price_at_purchase: item.price
          }
        }
        
        // Return item with full product details
        // WHY: We want to save complete product snapshot in the order
        return {
          product_id: product.id,
          product_name: product.name,
          product_image: product.images && product.images.length > 0 
            ? product.images[0]  // Use first product image
            : '/api/placeholder/300/300', // Fallback if no images
          quantity: item.quantity,
          price_at_purchase: item.price
        }
      })
    )
    
    // ========================================================================
    // GET USER ID - Get current user ID if logged in
    // ========================================================================
    // WHY: Orders should be linked to users if they're logged in (for order history)
    
    let userId: string | null = null
    try {
      // Get current session to check if user is logged in
      // WHY: We want to link orders to users so they can see their order history
      const session = await getServerSession(authOptions)
      // If user is logged in, use their user ID
      // WHY: Guest checkout is allowed (userId will be null)
      userId = session?.user?.id || null
    } catch (error) {
      // If session check fails, continue with guest checkout (userId = null)
      // WHY: Don't fail the order if session check fails
      logger.warn('Error getting session for order', error as Error)
    }
    
    // ========================================================================
    // CREATE ORDER - Save order to database
    // ========================================================================
    // WHY: We need to save the order so it appears in admin panel and order history
    
    // Create order in database
    // WHY: Orders need to be persisted so they can be viewed later
    const order = await ordersDb.createOrder({
      user_id: userId,  // User ID if logged in, null for guest checkout
      customer_name: body.cardName.trim(),  // Use card name as customer name
      customer_email: body.email.trim().toLowerCase(),  // Normalize email
      total_amount: body.total,
      payment_status: 'paid',  // Payment succeeded, so status is 'paid'
      stripe_payment_id: null,  // Mock system doesn't use Stripe, so null
      shipping_address: {
        name: body.cardName.trim(),  // Use card name for shipping
        line1: body.shippingAddress.street.trim(),  // Street address
        line2: '',  // No line2 in checkout form, so empty
        city: body.shippingAddress.city.trim(),
        state: body.shippingAddress.state.trim(),
        postal_code: body.shippingAddress.zipCode.trim(),
        country: 'US'  // Default to US (could be enhanced to collect country)
      },
      items: orderItemsWithProductDetails  // Items with full product details
    })
    
    // Log successful order creation
    // WHY: Logging helps with debugging and monitoring
    logger.info('Order created successfully', { 
      orderId: order.id, 
      customerEmail: order.customer_email,
      totalAmount: order.total_amount,
      itemCount: order.items.length
    })
    
    // ========================================================================
    // SUCCESS RESPONSE - Return success with order ID
    // ========================================================================
    
    // Return success response with order ID
    // WHY: Payment was successful, return order ID for confirmation page
    return NextResponse.json<PaymentResponse>(
      {
        success: true,
        orderId: order.id,  // Use the order ID from database
      },
      { status: 200 } // 200 OK - success
    )
    
  } catch (error) {
    // Handle any errors that occur during processing
    // WHY: Network errors, parsing errors, etc. need to be handled gracefully
    console.error('Payment processing error:', error)
    
    // Return error response
    // WHY: User needs to know that payment failed
    return NextResponse.json<PaymentResponse>(
      {
        success: false,
        error: 'An error occurred while processing your payment. Please try again.',
      },
      { status: 500 } // 500 Internal Server Error - server error
    )
  }
}

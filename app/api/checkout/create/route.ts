// ============================================================================
// CHECKOUT API ROUTE - Mock payment processing
// ============================================================================
// WHY: This API endpoint processes payment requests from the checkout page
// This is a MOCK payment system that only accepts card number "111111111111"
// In production, this would connect to a real payment processor like Stripe

import { NextRequest, NextResponse } from 'next/server'

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
    
    // Generate mock order ID
    // WHY: We need a unique order ID to track the order
    // In production, this would be generated by the order system
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // ========================================================================
    // SUCCESS RESPONSE - Return success with order ID
    // ========================================================================
    
    // Return success response with order ID
    // WHY: Payment was successful, return order ID for confirmation
    return NextResponse.json<PaymentResponse>(
      {
        success: true,
        orderId: orderId,
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

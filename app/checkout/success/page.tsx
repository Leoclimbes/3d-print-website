'use client'

// ============================================================================
// CHECKOUT SUCCESS PAGE - Order confirmation
// ============================================================================
// WHY: Users need a confirmation page after successful payment
// This page displays order confirmation and next steps

import Navigation from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Mail, Home } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CheckoutSuccessPage() {
  // ============================================================================
  // URL PARAMETERS - Get order ID from URL
  // ============================================================================
  
  // useSearchParams hook - reads query parameters from URL
  // WHY: Order ID is passed in URL query string (e.g., ?orderId=ORDER-123)
  // This gives us access to the order ID for display
  const searchParams = useSearchParams()
  
  // Get order ID from URL parameters
  // WHY: We need to display the order ID to the user
  const orderId = searchParams.get('orderId') || 'N/A'
  
  // ============================================================================
  // ORDER DETAILS STATE - Track order details and loading state
  // ============================================================================
  // WHY: We need to fetch and display full order details after payment
  
  // State for order details - stores the full order object
  // WHY: We want to show order items, shipping address, and other details
  const [orderDetails, setOrderDetails] = useState<any>(null)
  
  // Loading state - tracks if order details are being fetched
  // WHY: We need to show loading state while fetching order details
  const [isLoading, setIsLoading] = useState(true)
  
  // Error state - tracks if there was an error fetching order details
  // WHY: We need to show error message if API call fails
  const [error, setError] = useState<string | null>(null)
  
  // ============================================================================
  // ORDER DETAILS FETCH - Fetch order details from API
  // ============================================================================
  // WHY: We want to show order items, shipping address, and other details
  
  // Fetch order details if order ID is available
  // WHY: We want to show order items, shipping address, etc.
  useEffect(() => {
    // Only fetch if order ID is available and not 'N/A'
    // WHY: We need a valid order ID to fetch order details
    if (orderId && orderId !== 'N/A') {
      // Fetch order details from API
      // WHY: GET /api/orders/[id] returns full order details
      const fetchOrderDetails = async () => {
        try {
          // Set loading state to true
          // WHY: Show loading indicator while fetching
          setIsLoading(true)
          setError(null) // Clear any previous errors
          
          // Fetch order from API endpoint
          // WHY: We need to get full order details from the database
          const response = await fetch(`/api/orders/${orderId}`)
          
          // Check if request was successful
          // WHY: Handle errors gracefully
          if (!response.ok) {
            // If response is not OK, throw error
            // WHY: We need to handle API errors
            throw new Error(`Failed to fetch order: ${response.statusText}`)
          }
          
          // Parse JSON response
          // WHY: API returns JSON data
          const data = await response.json()
          
          // Update order details state with fetched order
          // WHY: Store order details in state so we can display them
          setOrderDetails(data.order || null)
          
        } catch (err) {
          // Handle errors during fetch
          // WHY: Network errors or API errors need to be handled gracefully
          console.error('Error fetching order details:', err)
          setError(err instanceof Error ? err.message : 'Failed to fetch order details')
          setOrderDetails(null) // Set to null on error
        } finally {
          // Set loading state to false
          // WHY: Hide loading indicator after fetch completes (success or error)
          setIsLoading(false)
        }
      }
      
      // Call fetch function
      // WHY: Fetch order details when order ID is available
      fetchOrderDetails()
    } else {
      // If no order ID, set loading to false
      // WHY: No need to show loading if there's no order ID
      setIsLoading(false)
    }
  }, [orderId]) // Re-fetch if order ID changes
  
  // ============================================================================
  // MAIN RENDER - Display success message
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar - appears on all pages */}
      <Navigation />

      {/* Success Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            {/* Success Icon */}
            {/* WHY: Visual indicator that payment was successful */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>

            {/* Success Title */}
            {/* WHY: Clear message that order was successful */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>

            {/* Success Message */}
            {/* WHY: Explain what happened and what's next */}
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your order!
            </p>
            <p className="text-gray-600 mb-8">
              Your order has been received and is being processed.
            </p>

            {/* Order ID Display */}
            {/* WHY: Users need their order ID for reference */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Order ID</p>
              <p className="text-2xl font-mono font-bold text-gray-900">{orderId}</p>
              {/* Helper text */}
              {/* WHY: Explain what to do with order ID */}
              <p className="text-xs text-gray-500 mt-2">
                Save this order ID for your records
              </p>
            </div>

            {/* Order Details - Show if loaded */}
            {/* WHY: Display order items and shipping address if available */}
            {isLoading && (
              <div className="text-center py-8 text-gray-500">
                Loading order details...
              </div>
            )}
            
            {error && (
              <div className="text-center py-8 text-red-500">
                Error loading order details: {error}
              </div>
            )}
            
            {!isLoading && !error && orderDetails && (
              <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
                {/* Order Items */}
                {/* WHY: Show what products were ordered */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-3">Order Items</p>
                  <div className="space-y-2">
                    {orderDetails.items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity} × {item.product_name}
                        </span>
                        <span className="font-medium">
                          ${(item.quantity * item.price_at_purchase).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${orderDetails.total_amount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Shipping Address */}
                {/* WHY: Show shipping address for confirmation */}
                {orderDetails.shipping_address && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 mb-2">Shipping Address</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{orderDetails.shipping_address.name}</div>
                      <div>{orderDetails.shipping_address.line1}</div>
                      {orderDetails.shipping_address.line2 && (
                        <div>{orderDetails.shipping_address.line2}</div>
                      )}
                      <div>
                        {orderDetails.shipping_address.city}, {orderDetails.shipping_address.state} {orderDetails.shipping_address.postal_code}
                      </div>
                      <div>{orderDetails.shipping_address.country}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next Steps Information */}
            {/* WHY: Users should know what happens next */}
            <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
              {/* Email Confirmation */}
              {/* WHY: Inform users about email confirmation */}
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Email Confirmation</p>
                  <p className="text-sm text-gray-600">
                    We've sent an order confirmation to your email address
                  </p>
                </div>
              </div>

              {/* Order Processing */}
              {/* WHY: Inform users about order processing */}
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Order Processing</p>
                  <p className="text-sm text-gray-600">
                    Your order is being prepared and will ship within 3-5 business days
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {/* WHY: Users should be able to navigate after checkout */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Continue Shopping Button */}
              {/* WHY: Users might want to shop more */}
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700"
                asChild
              >
                <Link href="/products" className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
              </Button>

              {/* Home Button */}
              {/* WHY: Users might want to go back to homepage */}
              <Button
                size="lg"
                variant="outline"
                asChild
              >
                <Link href="/" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Back to Home</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

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
  
  // State for order details (if we want to fetch them)
  // WHY: We might want to show more order details in the future
  const [orderDetails, setOrderDetails] = useState<any>(null)
  
  // ============================================================================
  // ORDER DETAILS FETCH - Fetch order details (optional)
  // ============================================================================
  
  // Fetch order details if order ID is available
  // WHY: We might want to show order items, shipping address, etc.
  // This is optional - for now we just show the order ID
  useEffect(() => {
    // If order ID is available, we could fetch order details here
    // WHY: In production, you might want to fetch full order details
    // For now, we just use the order ID from URL
    if (orderId && orderId !== 'N/A') {
      // In production, you would fetch order details from API:
      // fetch(`/api/orders/${orderId}`)
      //   .then(res => res.json())
      //   .then(data => setOrderDetails(data))
    }
  }, [orderId])
  
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

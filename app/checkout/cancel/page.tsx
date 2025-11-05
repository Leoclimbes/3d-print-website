'use client'

// ============================================================================
// CHECKOUT CANCEL PAGE - Payment cancellation
// ============================================================================
// WHY: Users need a page when they cancel payment or payment fails
// This page displays cancellation message and allows users to try again

import Navigation from '@/components/Navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCancelPage() {
  // ============================================================================
  // MAIN RENDER - Display cancellation message
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar - appears on all pages */}
      <Navigation />

      {/* Cancel Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            {/* Cancel Icon */}
            {/* WHY: Visual indicator that payment was cancelled */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>

            {/* Cancel Title */}
            {/* WHY: Clear message that payment was cancelled */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Payment Cancelled
            </h1>

            {/* Cancel Message */}
            {/* WHY: Explain what happened and what users can do */}
            <p className="text-lg text-gray-600 mb-2">
              Your payment was cancelled
            </p>
            <p className="text-gray-600 mb-8">
              No charges were made. Your cart items have been saved for you.
            </p>

            {/* Action Buttons */}
            {/* WHY: Users should be able to try again or go back */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Try Again Button */}
              {/* WHY: Users might want to try checkout again */}
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700"
                asChild
              >
                <Link href="/checkout" className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Try Again</span>
                </Link>
              </Button>

              {/* Back to Cart Button */}
              {/* WHY: Users might want to review their cart */}
              <Button
                size="lg"
                variant="outline"
                asChild
              >
                <Link href="/cart" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Cart</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

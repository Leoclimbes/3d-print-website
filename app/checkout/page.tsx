'use client'

// ============================================================================
// CHECKOUT PAGE - Payment form and order processing
// ============================================================================
// WHY: Users need a page to enter payment information and complete their purchase
// This page displays cart items, payment form, and processes the order

import { useCart } from '@/contexts/CartContext'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShoppingCart, CreditCard, Lock, ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CheckoutPage() {
  // ============================================================================
  // CART CONTEXT - Access cart state and functions
  // ============================================================================
  
  // useCart hook - access cart context to read cart items and totals
  // WHY: We need to display cart items and totals on the checkout page
  // This gives us access to all cart data
  const { items, itemCount, total, clearCart } = useCart()
  
  // Next.js router - for navigation after payment
  // WHY: We need to redirect to success/cancel pages after payment processing
  const router = useRouter()
  
  // ============================================================================
  // FORM STATE - Track payment form inputs
  // ============================================================================
  
  // Payment form state - stores all payment information
  // WHY: We need to track user input for payment processing
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',        // Card number - must be "1111 1111 1111" for mock system
    cardName: '',          // Name on card - required for payment
    expiryDate: '',        // Expiry date (MM/YY format)
    cvv: '',               // CVV security code
    email: '',             // Email address for order confirmation
    shippingAddress: '',   // Shipping street address
    city: '',              // Shipping city
    state: '',             // Shipping state/province
    zipCode: '',           // Shipping ZIP/postal code
  })
  
  // Loading state - tracks if payment is being processed
  // WHY: We need to show loading state while processing payment
  // Prevents double-submission and shows user feedback
  const [isProcessing, setIsProcessing] = useState(false)
  
  // ============================================================================
  // FORM HANDLERS - Handle user input
  // ============================================================================
  
  // Handle input change - update form state when user types
  // WHY: We need to update state whenever user changes any input field
  // Takes field name and new value
  const handleInputChange = (field: keyof typeof paymentData, value: string) => {
    // Update the specific field with new value
    // WHY: Keep form state in sync with user input
    setPaymentData(prev => ({
      ...prev,           // Keep all other fields unchanged
      [field]: value,    // Update only the changed field
    }))
  }
  
  // Format card number - add spaces for readability (e.g., "1111 1111 1111")
  // WHY: Card numbers are easier to read with spaces
  // Takes raw card number and formats it with spaces every 4 digits
  const handleCardNumberChange = (value: string) => {
    // Remove all spaces and non-digits from input
    // WHY: Clean input to get only numbers
    const numbers = value.replace(/\s+/g, '').replace(/\D/g, '')
    
    // Limit to 16 digits (standard card length)
    // WHY: Credit cards have maximum 16 digits
    const limited = numbers.slice(0, 16)
    
    // Add spaces every 4 digits for readability
    // WHY: Format as "1111 1111 1111" instead of "111111111111"
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ')
    
    // Update card number in form state
    // WHY: Store formatted value for display
    handleInputChange('cardNumber', formatted)
  }
  
  // Format expiry date - ensure MM/YY format
  // WHY: Expiry dates should be in standard MM/YY format
  // Takes raw input and formats it properly
  const handleExpiryChange = (value: string) => {
    // Remove all non-digits
    // WHY: Only allow numbers in expiry date
    const numbers = value.replace(/\D/g, '')
    
    // Limit to 4 digits (MMYY)
    // WHY: Expiry dates are 4 digits (month + year)
    const limited = numbers.slice(0, 4)
    
    // Add slash after first 2 digits (month)
    // WHY: Format as "MM/YY" instead of "MMYY"
    const formatted = limited.length >= 3 
      ? `${limited.slice(0, 2)}/${limited.slice(2)}`
      : limited
    
    // Update expiry date in form state
    // WHY: Store formatted value for display
    handleInputChange('expiryDate', formatted)
  }
  
  // Format CVV - limit to 3-4 digits
  // WHY: CVV codes are 3 or 4 digits
  // Takes raw input and limits to digits only
  const handleCvvChange = (value: string) => {
    // Remove all non-digits
    // WHY: CVV should only contain numbers
    const numbers = value.replace(/\D/g, '')
    
    // Limit to 4 digits (some cards have 4-digit CVV)
    // WHY: Maximum CVV length is 4 digits
    const limited = numbers.slice(0, 4)
    
    // Update CVV in form state
    // WHY: Store cleaned value
    handleInputChange('cvv', limited)
  }
  
  // ============================================================================
  // VALIDATION - Validate form before submission
  // ============================================================================
  
  // Validate payment form - check all required fields
  // WHY: We need to ensure all required information is provided before processing
  // Returns true if form is valid, false otherwise
  const validateForm = (): boolean => {
    // Remove spaces from card number for validation
    // WHY: Card number is stored with spaces, but we validate without spaces
    const cardNumberWithoutSpaces = paymentData.cardNumber.replace(/\s/g, '')
    
    // Check if card number is exactly "111111111111" (12 digits)
    // WHY: Mock system only accepts this specific card number
    if (cardNumberWithoutSpaces !== '111111111111') {
      toast.error('Invalid card number. Please use 1111 1111 1111 for testing.')
      return false
    }
    
    // Check if card name is provided
    // WHY: Payment processing requires name on card
    if (!paymentData.cardName.trim()) {
      toast.error('Please enter the name on the card')
      return false
    }
    
    // Check if expiry date is provided and in correct format
    // WHY: Payment processing requires valid expiry date
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      toast.error('Please enter a valid expiry date (MM/YY)')
      return false
    }
    
    // Check if CVV is provided (3-4 digits)
    // WHY: Payment processing requires CVV for security
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      toast.error('Please enter a valid CVV (3-4 digits)')
      return false
    }
    
    // Check if email is provided and valid format
    // WHY: We need email to send order confirmation
    if (!paymentData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    
    // Check if shipping address is provided
    // WHY: We need address to ship the products
    if (!paymentData.shippingAddress.trim()) {
      toast.error('Please enter your shipping address')
      return false
    }
    
    // Check if city is provided
    // WHY: Shipping requires city
    if (!paymentData.city.trim()) {
      toast.error('Please enter your city')
      return false
    }
    
    // Check if state is provided
    // WHY: Shipping requires state/province
    if (!paymentData.state.trim()) {
      toast.error('Please enter your state/province')
      return false
    }
    
    // Check if ZIP code is provided
    // WHY: Shipping requires ZIP/postal code
    if (!paymentData.zipCode.trim()) {
      toast.error('Please enter your ZIP/postal code')
      return false
    }
    
    // All validations passed
    // WHY: Form is ready for submission
    return true
  }
  
  // ============================================================================
  // PAYMENT PROCESSING - Submit payment to API
  // ============================================================================
  
  // Handle form submission - process payment
  // WHY: When user clicks "Complete Order", we need to validate and process payment
  // This is the main function that handles the checkout flow
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission (page reload)
    // WHY: We want to handle submission with JavaScript, not browser default
    e.preventDefault()
    
    // Check if cart is empty
    // WHY: Can't checkout with empty cart
    if (items.length === 0) {
      toast.error('Your cart is empty')
      router.push('/cart')
      return
    }
    
    // Validate form before processing
    // WHY: Don't send invalid data to the server
    if (!validateForm()) {
      return
    }
    
    // Set loading state to prevent double-submission
    // WHY: Show loading state and prevent multiple submissions
    setIsProcessing(true)
    
    try {
      // Prepare payment data for API
      // WHY: API expects specific format
      const paymentPayload = {
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''), // Remove spaces for API
        cardName: paymentData.cardName,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        email: paymentData.email,
        shippingAddress: {
          street: paymentData.shippingAddress,
          city: paymentData.city,
          state: paymentData.state,
          zipCode: paymentData.zipCode,
        },
        // Cart data - send items and total
        // WHY: Server needs to know what's being purchased
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: total,
      }
      
      // Send payment request to API
      // WHY: Process payment on server for security
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload),
      })
      
      // Parse response from server
      // WHY: Get payment result (success or failure)
      const data = await response.json()
      
      // Check if payment was successful
      // WHY: Determine whether to redirect to success or error page
      if (response.ok && data.success) {
        // Payment successful - clear cart and redirect to success page
        // WHY: User completed purchase, clear cart and show confirmation
        clearCart()
        toast.success('Payment processed successfully!')
        router.push(`/checkout/success?orderId=${data.orderId}`)
      } else {
        // Payment failed - show error message
        // WHY: User needs to know why payment failed
        toast.error(data.error || 'Payment failed. Please try again.')
        setIsProcessing(false)
      }
    } catch (error) {
      // Handle network or other errors
      // WHY: Network errors or server issues need to be handled gracefully
      console.error('Payment processing error:', error)
      toast.error('An error occurred. Please try again.')
      setIsProcessing(false)
    }
  }
  
  // ============================================================================
  // EMPTY CART STATE - Show message when cart is empty
  // ============================================================================
  
  // Display empty cart message if no items in cart
  // WHY: Users shouldn't be able to checkout with empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation bar - appears on all pages */}
        <Navigation />
        
        {/* Empty Cart Message */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center py-16">
            <CardContent>
              <div className="text-gray-500">
                {/* Empty cart icon */}
                {/* WHY: Visual indicator that cart is empty */}
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                
                {/* Empty cart title */}
                {/* WHY: Clear message that cart is empty */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Your cart is empty
                </h2>
                
                {/* Empty cart description */}
                {/* WHY: Explain what users can do next */}
                <p className="text-gray-600 mb-6">
                  Add items to your cart before checkout
                </p>
                
                {/* Browse products button */}
                {/* WHY: Users should be able to easily go shop for products */}
                <Button asChild size="lg">
                  <Link href="/products" className="flex items-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Browse Products</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  // ============================================================================
  // MAIN RENDER - Display checkout form
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar - appears on all pages */}
      <Navigation />

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          {/* WHY: Users should know they're on the checkout page */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-lg text-gray-600">
            Complete your order
          </p>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ==================================================================== */}
          {/* LEFT COLUMN - Payment Form */}
          {/* ==================================================================== */}
          
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Information Card */}
            {/* WHY: Organize payment form in a card for better UX */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {/* Credit card icon */}
                  {/* WHY: Visual indicator that this is payment section */}
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  <CardTitle>Payment Information</CardTitle>
                </div>
                <CardDescription>
                  {/* Mock payment notice */}
                  {/* WHY: Inform users this is a test system */}
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Test Mode:</strong> Use card number <strong>1111 1111 1111</strong> to complete payment
                    </p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Payment Form */}
                {/* WHY: Form to collect payment information */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Number Field */}
                  {/* WHY: Required for payment processing */}
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1111 1111 1111"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      maxLength={19} // "1111 1111 1111" + spaces = 19 chars
                      required
                    />
                    {/* Helper text */}
                    {/* WHY: Show users what card number to use */}
                    <p className="text-xs text-gray-500">
                      Use 1111 1111 1111 for testing
                    </p>
                  </div>

                  {/* Card Name Field */}
                  {/* WHY: Required for payment processing */}
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="John Doe"
                      value={paymentData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      required
                    />
                  </div>

                  {/* Expiry and CVV Row */}
                  {/* WHY: These fields are typically shown side-by-side */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry Date Field */}
                    {/* WHY: Required for payment processing */}
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        maxLength={5} // "MM/YY" = 5 chars
                        required
                      />
                    </div>

                    {/* CVV Field */}
                    {/* WHY: Required for payment processing */}
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => handleCvvChange(e.target.value)}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  {/* WHY: Required for order confirmation */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={paymentData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      We'll send your order confirmation to this email
                    </p>
                  </div>

                  {/* Shipping Information Section */}
                  {/* WHY: Separate section for shipping details */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      {/* Package icon */}
                      {/* WHY: Visual indicator for shipping section */}
                      <Package className="h-5 w-5 text-indigo-600" />
                      <span>Shipping Address</span>
                    </h3>

                    {/* Street Address Field */}
                    {/* WHY: Required for shipping */}
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="shippingAddress">Street Address</Label>
                      <Input
                        id="shippingAddress"
                        type="text"
                        placeholder="123 Main St"
                        value={paymentData.shippingAddress}
                        onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                        required
                      />
                    </div>

                    {/* City, State, ZIP Row */}
                    {/* WHY: These fields are typically shown in a row */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* City Field */}
                      {/* WHY: Required for shipping */}
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="New York"
                          value={paymentData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          required
                        />
                      </div>

                      {/* State Field */}
                      {/* WHY: Required for shipping */}
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          type="text"
                          placeholder="NY"
                          value={paymentData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          required
                        />
                      </div>

                      {/* ZIP Code Field */}
                      {/* WHY: Required for shipping */}
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          type="text"
                          placeholder="10001"
                          value={paymentData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  {/* WHY: User needs a button to complete the order */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        {/* Loading spinner */}
                        {/* WHY: Show loading state while processing */}
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {/* Lock icon */}
                        {/* WHY: Indicate secure payment */}
                        <Lock className="h-4 w-4 mr-2" />
                        Complete Order
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* ==================================================================== */}
          {/* RIGHT COLUMN - Order Summary */}
          {/* ==================================================================== */}
          
          <div className="lg:col-span-1">
            {/* Order Summary Card */}
            {/* WHY: Show cart items and totals */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items List */}
                {/* WHY: Show what user is purchasing */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      {/* Item name and quantity */}
                      {/* WHY: Show what item and how many */}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      {/* Item subtotal */}
                      {/* WHY: Show price for this item */}
                      <p className="text-gray-900 font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                {/* WHY: Visual separation between items and total */}
                <div className="border-t border-gray-200 pt-4">
                  {/* Total */}
                  {/* WHY: Show final total amount */}
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Back to Cart Link */}
                {/* WHY: Users should be able to go back to cart */}
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/cart" className="flex items-center justify-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Cart</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

// ============================================================================
// CART PAGE - Shopping cart view and management
// ============================================================================
// WHY: Users need a page to view all items in their cart, update quantities, remove items, and see totals
// This page displays all cart items with options to modify or remove them

import { useCart } from '@/contexts/CartContext'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Package, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function CartPage() {
  // ============================================================================
  // CART CONTEXT - Access cart state and functions
  // ============================================================================
  
  // useCart hook - access cart context to read and modify cart
  // WHY: We need to display cart items, update quantities, remove items, and show totals
  // This gives us access to all cart functionality
  const { items, itemCount, total, updateQuantity, removeFromCart, clearCart } = useCart()

  // ============================================================================
  // EVENT HANDLERS - Handle user interactions
  // ============================================================================
  
  // Handle quantity increase - increment item quantity by 1
  // WHY: Users need to increase quantity of items in cart
  // Takes product ID to identify which item to update
  const handleIncreaseQuantity = (productId: string, currentQuantity: number, maxStock: number) => {
    // Check if quantity is already at max stock
    // WHY: Can't add more items than are available in stock
    if (currentQuantity >= maxStock) {
      toast.error(`Cannot add more. Only ${maxStock} available in stock.`)
      return
    }
    
    // Increase quantity by 1
    // WHY: User clicked the "+" button to add one more item
    updateQuantity(productId, currentQuantity + 1)
    
    // Show feedback to user
    // WHY: Users need confirmation that quantity was updated
    toast.success('Quantity updated')
  }

  // Handle quantity decrease - decrement item quantity by 1
  // WHY: Users need to decrease quantity of items in cart
  // Takes product ID to identify which item to update
  const handleDecreaseQuantity = (productId: string, currentQuantity: number) => {
    // If quantity is 1, removing it will delete the item (handled by updateQuantity)
    // WHY: If user decreases quantity to 0, remove item from cart
    if (currentQuantity <= 1) {
      removeFromCart(productId)
      toast.success('Item removed from cart')
      return
    }
    
    // Decrease quantity by 1
    // WHY: User clicked the "-" button to remove one item
    updateQuantity(productId, currentQuantity - 1)
    
    // Show feedback to user
    // WHY: Users need confirmation that quantity was updated
    toast.success('Quantity updated')
  }

  // Handle manual quantity input - update quantity from input field
  // WHY: Users might want to type a specific quantity instead of clicking buttons
  // Takes product ID and new quantity value from input
  const handleQuantityChange = (productId: string, newQuantity: string, maxStock: number) => {
    // Parse input value to number
    // WHY: Input values are strings, need to convert to number
    const quantity = parseInt(newQuantity, 10)
    
    // Validate input - must be a valid positive number
    // WHY: Prevent invalid input (negative, zero, or NaN)
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity')
      return
    }
    
    // Check if quantity exceeds stock
    // WHY: Can't add more items than are available in stock
    if (quantity > maxStock) {
      toast.error(`Cannot add more than ${maxStock} items (stock limit)`)
      // Set quantity to max stock instead
      // WHY: Automatically adjust to max available if user enters too many
      updateQuantity(productId, maxStock)
      return
    }
    
    // Update quantity with new value
    // WHY: User entered a valid quantity, update the cart
    updateQuantity(productId, quantity)
    
    // Show feedback to user
    // WHY: Users need confirmation that quantity was updated
    toast.success('Quantity updated')
  }

  // Handle remove item - completely remove item from cart
  // WHY: Users need to remove items they no longer want
  // Takes product ID to identify which item to remove
  const handleRemoveItem = (productId: string, productName: string) => {
    // Remove item from cart
    // WHY: User clicked remove button, delete item completely
    removeFromCart(productId)
    
    // Show feedback to user with product name
    // WHY: Users need confirmation of what was removed
    toast.success(`${productName} removed from cart`)
  }

  // Handle clear cart - remove all items from cart
  // WHY: Users might want to empty their cart completely
  const handleClearCart = () => {
    // Check if cart is already empty
    // WHY: Don't do anything if there's nothing to clear
    if (items.length === 0) {
      return
    }
    
    // Clear all items from cart
    // WHY: User confirmed they want to empty cart
    clearCart()
    
    // Show feedback to user
    // WHY: Users need confirmation that cart was cleared
    toast.success('Cart cleared')
  }

  // ============================================================================
  // EMPTY CART STATE - Show message when cart is empty
  // ============================================================================
  
  // Display empty cart message if no items in cart
  // WHY: Users need clear feedback when their cart is empty
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
                  Start adding items to your cart to see them here
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
  // MAIN RENDER - Display cart with items and totals
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar - appears on all pages */}
      <Navigation />

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          {/* WHY: Users should know they're on the cart page */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-lg text-gray-600">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ==================================================================== */}
          {/* LEFT COLUMN - Cart Items List */}
          {/* ==================================================================== */}
          
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Items Header */}
            {/* WHY: Section header for the cart items */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Cart Items
              </h2>
              
              {/* Clear Cart Button */}
              {/* WHY: Users should be able to clear their entire cart quickly */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            {/* Cart Items List */}
            {/* WHY: Display all items currently in cart */}
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Product Image */}
                    {/* WHY: Visual representation of the product */}
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.image ? (
                        // Display product image if available
                        // WHY: Show actual product image for better recognition
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // Placeholder if no image
                        // WHY: Show something even if product has no image
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    {/* WHY: Show product name and information */}
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Product Name */}
                      {/* WHY: Users need to know which product this is */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        
                        {/* Product Price per unit */}
                        {/* WHY: Show individual price for reference */}
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      {/* WHY: Users need to adjust quantities and see subtotals */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls - Increase/Decrease buttons */}
                        {/* WHY: Easy way to adjust quantity by clicking +/- */}
                        <div className="flex items-center space-x-2">
                          {/* Decrease Quantity Button */}
                          {/* WHY: Quick way to reduce quantity by 1 */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          {/* Quantity Input */}
                          {/* WHY: Users can see and manually edit quantity */}
                          <Input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value, item.stock)}
                            className="w-16 text-center"
                          />
                          
                          {/* Increase Quantity Button */}
                          {/* WHY: Quick way to increase quantity by 1 */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleIncreaseQuantity(item.id, item.quantity, item.stock)}
                            disabled={item.quantity >= item.stock}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Item Subtotal */}
                        {/* WHY: Show total price for this item (price × quantity) */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          
                          {/* Stock indicator - show if low stock */}
                          {/* WHY: Users should know if stock is limited */}
                          {item.stock < 10 && (
                            <p className="text-xs text-orange-600 mt-1">
                              Only {item.stock} in stock
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove Item Button */}
                    {/* WHY: Users need a way to completely remove items from cart */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ==================================================================== */}
          {/* RIGHT COLUMN - Order Summary */}
          {/* ==================================================================== */}
          
          <div className="lg:col-span-1">
            {/* Order Summary Card */}
            {/* WHY: Show cart totals and checkout options */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subtotal */}
                {/* WHY: Show subtotal before any additional fees */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>

                {/* Item Count */}
                {/* WHY: Show total number of items */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items</span>
                  <span className="text-gray-900">{itemCount}</span>
                </div>

                {/* Divider */}
                {/* WHY: Visual separation between summary and total */}
                <div className="border-t border-gray-200 pt-4">
                  {/* Total */}
                  {/* WHY: Show final total amount */}
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Proceed to Checkout Button */}
                {/* WHY: Users need a prominent button to start checkout process */}
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  size="lg"
                  asChild
                >
                  <Link href="/checkout" className="flex items-center justify-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Proceed to Checkout</span>
                  </Link>
                </Button>

                {/* Continue Shopping Link */}
                {/* WHY: Users should be able to easily return to shopping */}
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/products" className="flex items-center justify-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Continue Shopping</span>
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

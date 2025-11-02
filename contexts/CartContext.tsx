'use client'

// ============================================================================
// CART CONTEXT - Global state management for shopping cart
// ============================================================================
// WHY: We need to share cart data across multiple components (Navigation, Product pages, Cart page)
// This context provides a centralized way to manage cart state and sync it with localStorage

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// CartItem interface - defines the structure of items in the cart
// WHY: TypeScript needs to know what properties each cart item has
// Each item includes product info plus quantity and subtotal
interface CartItem {
  id: string                    // Product ID - unique identifier for the product
  name: string                  // Product name - displayed in cart
  price: number                 // Product price - used to calculate subtotal
  image: string                 // Product image URL - first image from product.images array
  quantity: number              // Quantity in cart - user can increase/decrease
  stock: number                 // Available stock - prevents adding more than available
}

// CartContextType interface - defines the shape of the cart context value
// WHY: TypeScript needs to know what methods and data the context provides
// This ensures type safety when using the cart context in components
interface CartContextType {
  // Cart state - array of items currently in cart
  items: CartItem[]
  
  // Cart count - total number of items (sum of all quantities)
  // WHY: Navigation needs to show total items count, not unique products
  itemCount: number
  
  // Cart total - total price of all items in cart
  // WHY: Cart page needs to display total amount
  total: number
  
  // Add item to cart - adds product or increases quantity if already in cart
  // WHY: Product pages need to add items when user clicks "Add to Cart"
  addToCart: (product: { id: string; name: string; price: number; images: string[]; stock: number }, quantity?: number) => void
  
  // Remove item from cart - completely removes product from cart
  // WHY: Cart page needs to let users remove items
  removeFromCart: (productId: string) => void
  
  // Update quantity - changes quantity of item in cart
  // WHY: Cart page needs to let users change quantities
  updateQuantity: (productId: string, quantity: number) => void
  
  // Clear cart - removes all items from cart
  // WHY: After checkout, we need to clear the cart
  clearCart: () => void
}

// Create the context with undefined as default value
// WHY: The context is initialized before providers, so we need a default
// Components will check if context is undefined to detect missing provider
const CartContext = createContext<CartContextType | undefined>(undefined)

// CartProvider component - provides cart context to all children
// WHY: Wraps the app to make cart state available everywhere
export function CartProvider({ children }: { children: ReactNode }) {
  // ============================================================================
  // STATE MANAGEMENT - Track cart items in memory
  // ============================================================================
  
  // Cart items state - stores all items in the cart
  // WHY: React state holds the cart data, synced with localStorage
  // Empty array is initial state - cart starts empty
  const [items, setItems] = useState<CartItem[]>([])

  // ============================================================================
  // LOCALSTORAGE SYNC - Persist cart data across page refreshes
  // ============================================================================
  
  // Load cart from localStorage on mount
  // WHY: Cart should persist even if user refreshes the page
  // This runs once when the component first mounts
  useEffect(() => {
    // Check if we're in the browser (not server-side)
    // WHY: localStorage is only available in browser, not during SSR
    if (typeof window !== 'undefined') {
      try {
        // Get cart data from localStorage
        // WHY: Try to restore cart from previous session
        const savedCart = localStorage.getItem('cart')
        
        // If cart data exists, parse it and set state
        // WHY: Restore cart items from saved JSON string
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart) as CartItem[]
          setItems(parsedCart)
        }
      } catch (error) {
        // If parsing fails, clear corrupted data
        // WHY: Don't break the app if localStorage data is corrupted
        console.error('Error loading cart from localStorage:', error)
        localStorage.removeItem('cart')
      }
    }
  }, []) // Empty dependency array means this runs only once on mount

  // Save cart to localStorage whenever items change
  // WHY: Keep localStorage in sync with React state
  // This runs every time the items array changes
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      try {
        // Save cart items to localStorage as JSON string
        // WHY: localStorage only stores strings, so we need to stringify
        localStorage.setItem('cart', JSON.stringify(items))
      } catch (error) {
        // Handle localStorage errors (e.g., quota exceeded)
        // WHY: Don't break the app if localStorage fails
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [items]) // Runs whenever items array changes

  // ============================================================================
  // COMPUTED VALUES - Calculate cart metrics from items
  // ============================================================================
  
  // Calculate total item count (sum of all quantities)
  // WHY: Navigation badge needs to show total items, not unique products
  // Example: 2x Product A + 3x Product B = 5 items total
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  
  // Calculate total price of all items in cart
  // WHY: Cart page needs to show total amount user will pay
  // Formula: sum of (price × quantity) for each item
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // ============================================================================
  // CART ACTIONS - Functions to modify the cart
  // ============================================================================
  
  // Add product to cart or increase quantity if already exists
  // WHY: Product pages call this when user clicks "Add to Cart"
  // Takes product data and optional quantity (defaults to 1)
  const addToCart = (
    product: { id: string; name: string; price: number; images: string[]; stock: number },
    quantity: number = 1
  ) => {
    // Validate quantity - must be positive number
    // WHY: Can't add negative or zero quantities
    if (quantity <= 0) {
      console.warn('Cannot add non-positive quantity to cart')
      return
    }

    // Check if product already exists in cart
    // WHY: If product is already in cart, we should increase quantity instead of duplicating
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(item => item.id === product.id)
      
      if (existingItemIndex >= 0) {
        // Product already in cart - update quantity
        // WHY: Don't create duplicate entries, just increase quantity
        const existingItem = currentItems[existingItemIndex]
        const newQuantity = existingItem.quantity + quantity
        
        // Check stock availability - don't exceed available stock
        // WHY: Can't add more items than are in stock
        if (newQuantity > product.stock) {
          // If adding would exceed stock, set to max available
          // WHY: Don't silently fail - set to max available quantity
          const updatedItems = [...currentItems]
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: product.stock, // Set to max stock
          }
          return updatedItems
        }
        
        // Update quantity of existing item
        // WHY: Increment quantity by the amount being added
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        }
        return updatedItems
      } else {
        // Product not in cart - add new item
        // WHY: First time adding this product, create new cart item
        // Get first image or empty string if no images
        const image = product.images && product.images.length > 0 ? product.images[0] : ''
        
        // Check stock availability
        // WHY: Can't add more than available stock
        const finalQuantity = Math.min(quantity, product.stock)
        
        // Create new cart item
        // WHY: Add product to cart with specified quantity
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: image,
          quantity: finalQuantity,
          stock: product.stock,
        }
        
        // Add new item to cart
        // WHY: Spread existing items and add the new one
        return [...currentItems, newItem]
      }
    })
  }

  // Remove product completely from cart
  // WHY: Cart page needs to let users remove items entirely
  // Takes product ID to identify which item to remove
  const removeFromCart = (productId: string) => {
    // Filter out the item with matching product ID
    // WHY: Remove item completely, not just decrease quantity
    setItems((currentItems) => 
      currentItems.filter(item => item.id !== productId)
    )
  }

  // Update quantity of specific item in cart
  // WHY: Cart page needs to let users change quantities (increase/decrease)
  // Takes product ID and new quantity
  const updateQuantity = (productId: string, quantity: number) => {
    // Validate quantity - must be positive
    // WHY: Can't have zero or negative quantities (use removeFromCart for removal)
    if (quantity <= 0) {
      // If quantity is 0 or negative, remove item instead
      // WHY: If user sets quantity to 0, they probably want to remove it
      removeFromCart(productId)
      return
    }

    // Find item and check stock availability
    // WHY: Can't set quantity higher than available stock
    setItems((currentItems) => 
      currentItems.map(item => {
        // Check if this is the item we're updating
        if (item.id === productId) {
          // Get the item's stock limit
          // WHY: Can't exceed available stock
          const maxQuantity = item.stock
          
          // If requested quantity exceeds stock, use max available
          // WHY: Don't allow users to add more than available
          const finalQuantity = Math.min(quantity, maxQuantity)
          
          // Update item with new quantity
          // WHY: Spread existing item properties and update quantity
          return { ...item, quantity: finalQuantity }
        }
        // Return unchanged items
        // WHY: Only update the specific item, leave others alone
        return item
      })
    )
  }

  // Clear all items from cart
  // WHY: After successful checkout, we need to empty the cart
  // Also useful for "Clear Cart" button if we add one
  const clearCart = () => {
    // Set items to empty array
    // WHY: Remove all items at once
    setItems([])
  }

  // ============================================================================
  // CONTEXT VALUE - What we provide to consuming components
  // ============================================================================
  
  // Create the context value object
  // WHY: This is what components get when they use useCart() hook
  const value: CartContextType = {
    items,              // Array of cart items
    itemCount,          // Total count of all items (sum of quantities)
    total,              // Total price of all items
    addToCart,          // Function to add products to cart
    removeFromCart,     // Function to remove items from cart
    updateQuantity,     // Function to update item quantities
    clearCart,          // Function to clear entire cart
  }

  // ============================================================================
  // PROVIDER - Make context available to children
  // ============================================================================
  
  // Return the provider component
  // WHY: Wraps children and provides cart context value
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// useCart hook - custom hook to access cart context
// WHY: Components need an easy way to access cart data and functions
// This is the public API that components should use
export function useCart() {
  // Get context value
  // WHY: Access the cart context created above
  const context = useContext(CartContext)
  
  // Check if context is undefined (meaning hook used outside provider)
  // WHY: Prevent runtime errors from using hook incorrectly
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  
  // Return the context value
  // WHY: Give components access to cart state and functions
  return context
}

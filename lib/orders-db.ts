import fs from 'fs'
import path from 'path'
import { logger } from './logger'

// ============================================================================
// ORDERS DATABASE - File-based database for orders
// ============================================================================
// WHY: We need a persistent storage solution so orders persist across server restarts
// This is similar to products-db.ts and local-db.ts - stores orders in a JSON file
// CONFIGURATION: Database path can be customized via DATABASE_PATH environment variable
// DEFAULT: ./data (stores orders.json in data/ directory)

const DB_PATH = process.env.DATABASE_PATH 
  ? path.resolve(process.env.DATABASE_PATH)  // Use custom path from env var if provided
  : path.join(process.cwd(), 'data')         // Default to ./data directory
const ORDERS_FILE = path.join(DB_PATH, 'orders.json')

// Ensure data directory exists - creates the folder if it doesn't exist
// WHY: The data folder might not exist when the app first starts
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true })
}

// Initialize orders file with empty array if it doesn't exist
// WHY: We want an empty orders file to exist when the app first starts
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([]))
}

// ============================================================================
// INTERFACES - Define the data structure for orders
// ============================================================================
// WHY: TypeScript interfaces help us catch errors early and provide autocomplete
// These match the structure expected by the admin orders page and checkout success page

// Order item interface - represents a single product in an order
// WHY: Each order contains multiple items (products purchased)
interface OrderItem {
  id: string                      // Unique ID for this order item
  product_id: string              // ID of the product that was purchased
  product_name: string            // Name of the product (snapshot at time of purchase)
  product_image: string           // Image URL of the product (snapshot at time of purchase)
  quantity: number                // How many of this product were ordered
  price_at_purchase: number       // Price of the product when order was placed (important: prices can change!)
}

// Order interface - represents a complete customer order
// WHY: This structure matches what the admin page expects and what we save from checkout
interface Order {
  id: string                      // Unique order ID (e.g., "ORDER-1234567890-abc123")
  user_id: string | null          // ID of the user who placed the order (null for guest checkout)
  customer_name: string           // Name of the customer (from shipping address)
  customer_email: string          // Email of the customer (for order confirmation)
  total_amount: number            // Total order amount in dollars (sum of all items)
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'  // Order fulfillment status
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'  // Payment processing status
  stripe_payment_id: string | null  // Stripe payment intent ID (if using Stripe)
  shipping_address: {             // Shipping address object
    name: string                  // Full name on shipping address
    line1: string                 // Street address line 1
    line2?: string                // Street address line 2 (optional - apartment number, etc.)
    city: string                  // City
    state: string                 // State or province
    postal_code: string           // ZIP or postal code
    country: string               // Country code (e.g., "US")
  }
  items: OrderItem[]             // Array of items in this order
  created_at: string             // ISO timestamp when order was created
  updated_at: string             // ISO timestamp when order was last updated
}

// ============================================================================
// ORDERS DATABASE CLASS - Manages all order operations
// ============================================================================
// WHY: We encapsulate all order CRUD (Create, Read, Update, Delete) operations in one place
// This provides a clean API for creating, reading, updating, and deleting orders

class OrdersDatabase {
  private orders: Order[] = []   // In-memory cache of orders

  constructor() {
    // Load orders from file when class is instantiated
    // WHY: We need to read existing orders from the JSON file on startup
    this.loadOrders()
  }

  // ============================================================================
  // FILE OPERATIONS - Load and save orders to/from JSON file
  // ============================================================================

  // Load orders from JSON file into memory
  // WHY: We need to read the latest order data from the file before performing operations
  // CONCURRENCY NOTE: File-based DB has limitations with concurrent writes - consider a real DB for production
  private loadOrders() {
    try {
      // Read the orders file as UTF-8 text
      // WHY: JSON files are text files, so we read them as UTF-8 strings
      const data = fs.readFileSync(ORDERS_FILE, 'utf8')
      // Parse the JSON string into a JavaScript array
      // WHY: JSON.parse converts the file content from string to JavaScript objects
      this.orders = JSON.parse(data)
    } catch (error) {
      // Use logger instead of console.error for consistent logging
      // WHY: Logger provides structured logging that's easier to debug
      logger.error('Error loading orders from file', error as Error, { file: ORDERS_FILE })
      // If file is corrupted or can't be read, start with empty array
      // WHY: Better to have no orders than crash the entire app
      this.orders = []
    }
  }

  // Save orders from memory to JSON file
  // WHY: We need to persist changes to disk so they survive server restarts
  // CONCURRENCY NOTE: Multiple simultaneous saves could cause data loss - file locking would help
  private saveOrders() {
    try {
      // Write atomically by writing to a temp file first, then renaming
      // WHY: This prevents corruption if the process crashes mid-write
      // The rename operation is atomic on most file systems, so it's safer
      const tempFile = `${ORDERS_FILE}.tmp`
      // Convert JavaScript array to JSON string with pretty formatting (2-space indent)
      // WHY: Pretty formatting makes the file human-readable for debugging
      fs.writeFileSync(tempFile, JSON.stringify(this.orders, null, 2))
      // Rename temp file to actual file (atomic operation)
      // WHY: If we wrote directly to ORDERS_FILE and crashed, the file would be corrupted
      fs.renameSync(tempFile, ORDERS_FILE)
    } catch (error) {
      // Use logger for consistent error reporting
      // WHY: Logger provides structured logging
      logger.error('Error saving orders to file', error as Error, { file: ORDERS_FILE })
      throw error // Re-throw so calling code knows save failed
    }
  }

  // ============================================================================
  // READ OPERATIONS - Get orders from the database
  // ============================================================================

  // Get all orders - returns a copy of the orders array
  // WHY: We return a copy to prevent external code from modifying the internal array directly
  getAllOrders(): Order[] {
    // Always reload from file to get latest data
    // WHY: In a multi-process environment, another process might have updated the file
    this.loadOrders()
    // Return a copy of the array, not a reference
    // WHY: If we returned the actual array, external code could modify it directly
    return [...this.orders]
  }

  // Get a single order by ID
  // WHY: Individual order endpoints need to fetch one order (e.g., checkout success page)
  getOrderById(id: string): Order | null {
    // Always reload to get latest data
    // WHY: Another request might have just created or updated this order
    this.loadOrders()
    // Find the order with matching ID, or return null if not found
    // WHY: find() returns undefined if not found, so we use || null to convert to null
    return this.orders.find(order => order.id === id) || null
  }

  // Get orders by user ID
  // WHY: Users should be able to see their own order history
  getOrdersByUserId(userId: string): Order[] {
    // Always reload to get latest data
    this.loadOrders()
    // Filter orders to only those belonging to this user
    // WHY: Users should only see their own orders
    return this.orders.filter(order => order.user_id === userId)
  }

  // ============================================================================
  // CREATE OPERATION - Create a new order
  // ============================================================================

  // Create a new order
  // WHY: When checkout completes successfully, we need to save the order
  async createOrder(orderData: {
    user_id?: string | null       // Optional user ID (null for guest checkout)
    customer_name: string         // Customer name from shipping address
    customer_email: string        // Customer email for order confirmation
    total_amount: number          // Total order amount
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded'  // Payment status
    stripe_payment_id?: string | null  // Stripe payment ID if using Stripe
    shipping_address: {           // Shipping address object
      name: string
      line1: string
      line2?: string
      city: string
      state: string
      postal_code: string
      country: string
    }
    items: Array<{                 // Array of items being ordered
      product_id: string
      product_name: string
      product_image: string
      quantity: number
      price_at_purchase: number
    }>
  }): Promise<Order> {
    // Load latest orders (in case another request just added one)
    // WHY: We want to ensure we have the most up-to-date data
    this.loadOrders()

    // Generate a unique order ID
    // WHY: We need a unique identifier for each order
    // Format: "ORDER-{timestamp}-{random string}" for readability and uniqueness
    const timestamp = Date.now()  // Current time in milliseconds
    const randomStr = Math.random().toString(36).substr(2, 9)  // Random alphanumeric string
    const newId = `ORDER-${timestamp}-${randomStr}`

    // Create order items with unique IDs
    // WHY: Each order item needs its own ID for tracking
    const orderItems: OrderItem[] = orderData.items.map((item, index) => ({
      id: `item-${newId}-${index}`,  // Unique ID for each item
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase
    }))

    // Create the new order object with all required fields
    // WHY: We need to create a complete order object with all required fields
    const newOrder: Order = {
      id: newId,
      user_id: orderData.user_id || null,  // Default to null if not provided (guest checkout)
      customer_name: orderData.customer_name.trim(),  // Trim whitespace
      customer_email: orderData.customer_email.trim().toLowerCase(),  // Normalize email
      total_amount: Math.max(0, orderData.total_amount),  // Ensure total is not negative
      status: 'pending',  // New orders start as pending
      payment_status: orderData.payment_status,
      stripe_payment_id: orderData.stripe_payment_id || null,
      shipping_address: {
        name: orderData.shipping_address.name.trim(),
        line1: orderData.shipping_address.line1.trim(),
        line2: orderData.shipping_address.line2?.trim(),  // Optional field
        city: orderData.shipping_address.city.trim(),
        state: orderData.shipping_address.state.trim(),
        postal_code: orderData.shipping_address.postal_code.trim(),
        country: orderData.shipping_address.country.trim()
      },
      items: orderItems,
      created_at: new Date().toISOString(),  // Current timestamp
      updated_at: new Date().toISOString()   // Current timestamp
    }

    // Add to array and save to file
    // WHY: We need to persist the new order to disk
    this.orders.push(newOrder)
    this.saveOrders()

    // Log the successful order creation
    // WHY: Logging helps with debugging and monitoring
    logger.info('Order created successfully', { 
      orderId: newOrder.id, 
      customerEmail: newOrder.customer_email,
      totalAmount: newOrder.total_amount
    })
    
    return newOrder
  }

  // ============================================================================
  // UPDATE OPERATION - Update an existing order
  // ============================================================================

  // Update an existing order
  // WHY: When admins update order status (e.g., mark as shipped), we need to save changes
  async updateOrder(id: string, updates: {
    status?: Order['status']           // Update order fulfillment status
    payment_status?: Order['payment_status']  // Update payment status
    stripe_payment_id?: string | null  // Update Stripe payment ID
  }): Promise<Order | null> {
    // Get latest data
    this.loadOrders()

    // Find the order index
    // WHY: We need to find which order to update
    const orderIndex = this.orders.findIndex(order => order.id === id)
    
    // If order doesn't exist, return null
    // WHY: Caller needs to know if update failed because order wasn't found
    if (orderIndex === -1) {
      return null
    }

    // Update the order (keep original fields, but update specified fields)
    // WHY: We only want to update the fields that are provided
    this.orders[orderIndex] = {
      ...this.orders[orderIndex],  // Keep all existing fields
      ...updates,                   // Override with new values
      id,                           // Ensure ID doesn't change (security measure)
      created_at: this.orders[orderIndex].created_at,  // Preserve original creation time
      updated_at: new Date().toISOString()  // Always update the updated_at timestamp
    }

    // Save changes to file
    // WHY: Changes must be persisted to disk
    this.saveOrders()

    // Log the update
    // WHY: Logging helps with debugging and auditing
    logger.info('Order updated successfully', { orderId: id, updates })

    return this.orders[orderIndex]
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================
// WHY: We want all parts of the app to use the same orders database instance
// This ensures data consistency across the application

export const ordersDb = new OrdersDatabase()
export type { Order, OrderItem }


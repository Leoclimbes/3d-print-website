import fs from 'fs'
import path from 'path'
import { logger } from './logger'

// Simple file-based database for products (similar to local-db.ts for users)
// WHY: We need a persistent storage solution so product changes (create, update, delete) persist across server restarts
const DB_PATH = path.join(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DB_PATH, 'products.json')

// Ensure data directory exists - creates the folder if it doesn't exist
// WHY: The data folder might not exist when the app first starts
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true })
}

// Initialize products file with default mock data if it doesn't exist
// WHY: We want some default products to exist when the app first starts
if (!fs.existsSync(PRODUCTS_FILE)) {
  const defaultProducts = [
    {
      id: '1',
      name: 'Custom Phone Stand',
      description: 'Adjustable phone stand perfect for desk work',
      price: 12.99,
      category: 'Accessories',
      images: ['/api/placeholder/300/300'],
      stock: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Gaming Controller Holder',
      description: 'Organize your gaming controllers with this sleek holder',
      price: 18.99,
      category: 'Gaming',
      images: ['/api/placeholder/300/300'],
      stock: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Desk Organizer',
      description: 'Keep your desk tidy with this multi-compartment organizer',
      price: 24.99,
      category: 'Office',
      images: ['/api/placeholder/300/300'],
      stock: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2))
}

// Product interface - defines the structure of a product object
// WHY: TypeScript needs to know what properties a product has
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  stock: number
  createdAt: string
  updatedAt: string
}

// Products database class - manages all product operations
// WHY: We encapsulate all product CRUD (Create, Read, Update, Delete) operations in one place
class ProductsDatabase {
  private products: Product[] = []

  constructor() {
    // Load products from file when class is instantiated
    // WHY: We need to read existing products from the JSON file on startup
    this.loadProducts()
  }

  // Load products from JSON file into memory
  // WHY: We need to read the latest product data from the file before performing operations
  // CONCURRENCY NOTE: File-based DB has limitations with concurrent writes - consider a real DB for production
  private loadProducts() {
    try {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8')
      this.products = JSON.parse(data)
    } catch (error) {
      // Use logger instead of console.error for consistent logging
      logger.error('Error loading products from file', error as Error, { file: PRODUCTS_FILE })
      // If file is corrupted or can't be read, start with empty array
      // WHY: Better to have no products than crash the entire app
      this.products = []
    }
  }

  // Save products from memory to JSON file
  // WHY: We need to persist changes to disk so they survive server restarts
  // CONCURRENCY NOTE: Multiple simultaneous saves could cause data loss - file locking would help
  private saveProducts() {
    try {
      // Write atomically by writing to a temp file first, then renaming
      // WHY: This prevents corruption if the process crashes mid-write
      // The rename operation is atomic on most file systems, so it's safer
      const tempFile = `${PRODUCTS_FILE}.tmp`
      fs.writeFileSync(tempFile, JSON.stringify(this.products, null, 2))
      fs.renameSync(tempFile, PRODUCTS_FILE)
    } catch (error) {
      // Use logger for consistent error reporting
      logger.error('Error saving products to file', error as Error, { file: PRODUCTS_FILE })
      throw error // Re-throw so calling code knows save failed
    }
  }

  // Get all products - returns a copy of the products array
  // WHY: We return a copy to prevent external code from modifying the internal array directly
  getAllProducts(): Product[] {
    // Always reload from file to get latest data
    // WHY: In a multi-process environment, another process might have updated the file
    this.loadProducts()
    return [...this.products] // Return copy, not reference
  }

  // Get a single product by ID
  // WHY: Individual product endpoints need to fetch one product
  getProductById(id: string): Product | null {
    this.loadProducts() // Always reload to get latest data
    return this.products.find(p => p.id === id) || null
  }

  // Create a new product
  // WHY: When admins add products through the UI, we need to save them
  async createProduct(productData: {
    name: string
    description: string
    price: number
    category: string
    images?: string[]
    stock?: number
  }): Promise<Product> {
    // Load latest products (in case another request just added one)
    this.loadProducts()

    // Generate a unique ID for the new product
    // WHY: We need a unique identifier for each product
    const newId = (this.products.length > 0 
      ? Math.max(...this.products.map(p => parseInt(p.id) || 0)) + 1 
      : 1
    ).toString()

    // Create the new product object with sanitized/normalized data
    // WHY: Trim whitespace and ensure data consistency
    const newProduct: Product = {
      id: newId,
      name: productData.name.trim(), // Remove leading/trailing whitespace
      description: productData.description.trim(),
      price: Math.max(0, productData.price), // Ensure price is not negative
      category: productData.category.trim(),
      images: productData.images || ['/api/placeholder/300/300'],
      stock: Math.max(0, productData.stock ?? 0), // Ensure stock is not negative
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to array and save to file
    this.products.push(newProduct)
    this.saveProducts()

    logger.info('Product created successfully', { productId: newProduct.id, name: newProduct.name })
    return newProduct
  }

  // Update an existing product
  // WHY: When admins edit products, we need to update the stored data
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    this.loadProducts() // Get latest data

    // Find the product index
    const productIndex = this.products.findIndex(p => p.id === id)
    
    // If product doesn't exist, return null
    // WHY: Caller needs to know if update failed because product wasn't found
    if (productIndex === -1) {
      return null
    }

    // Update the product (keep original ID and timestamps, but update updatedAt)
    // WHY: We don't want to allow changing the ID or createdAt timestamp
    // Sanitize update data - trim strings, ensure numbers are valid
    // WHY: Input sanitization prevents bad data from being saved (negative prices, etc.)
    const sanitizedUpdates: Partial<Product> = {
      // Only include fields that are actually provided in updates
      // WHY: We don't want to overwrite fields with undefined/null values
      ...(updates.name !== undefined && { name: String(updates.name).trim() }),
      ...(updates.description !== undefined && { description: String(updates.description).trim() }),
      ...(updates.price !== undefined && { price: Math.max(0, Number(updates.price)) }),
      ...(updates.category !== undefined && { category: String(updates.category).trim() }),
      ...(updates.images !== undefined && { images: updates.images }), // Keep images as-is if provided
      ...(updates.stock !== undefined && { stock: Math.max(0, Number(updates.stock)) }),
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...sanitizedUpdates,
      id, // Ensure ID doesn't change (security measure)
      createdAt: this.products[productIndex].createdAt, // Preserve original creation time
      updatedAt: new Date().toISOString() // Always update the updatedAt timestamp
    }

    // Save changes to file
    this.saveProducts()

    return this.products[productIndex]
  }

  // Delete a product by ID
  // WHY: When admins click delete, we need to remove the product permanently
  async deleteProduct(id: string): Promise<boolean> {
    this.loadProducts() // Get latest data

    // Find the product index
    const productIndex = this.products.findIndex(p => p.id === id)
    
    // If product doesn't exist, return false
    // WHY: Caller needs to know if delete failed because product wasn't found
    if (productIndex === -1) {
      return false
    }

    // Remove product from array
    // WHY: splice removes the element at the specified index
    this.products.splice(productIndex, 1)
    
    // Save changes to file
    // WHY: Changes must be persisted to disk
    this.saveProducts()

    logger.info('Product deleted successfully', { productId: id })
    return true // Success
  }
}

// Export singleton instance - only one instance exists throughout the app
// WHY: We want all parts of the app to use the same products database instance
export const productsDb = new ProductsDatabase()
export type { Product }


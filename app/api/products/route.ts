import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { productsDb } from '@/lib/products-db'
import { logger } from '@/lib/logger'

// GET /api/products - Get all products
// WHY: This endpoint returns all products, with optional filtering by category or search term
export async function GET(request: NextRequest) {
  // Declare variables outside try block so they're accessible in catch
  // WHY: Error handler needs access to these values for logging
  let category: string | null = null
  let search: string | null = null
  
  try {
    // Get query parameters from the URL
    // WHY: Users might want to filter products by category or search for specific products
    const { searchParams } = new URL(request.url)
    category = searchParams.get('category')
    search = searchParams.get('search')
    
    // Get all products from the database
    // WHY: We need to fetch products from the shared store so all endpoints see the same data
    let filteredProducts = productsDb.getAllProducts()
    
    // Filter by category if provided
    // WHY: Users might want to see only products in a specific category (e.g., "Gaming")
    if (category) {
      const categoryLower = category.toLowerCase() // Cache lowercase version
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === categoryLower
      )
    }
    
    // Filter by search term if provided
    // WHY: Users might want to search for products by name or description
    if (search) {
      const searchLower = search.toLowerCase() // Cache lowercase version
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Return filtered products
    return NextResponse.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length
    })
  } catch (error) {
    // Handle errors gracefully
    // WHY: If something goes wrong, we don't want the app to crash
    // Use logger instead of console.error for consistent logging
    logger.error('Error fetching products', error as Error, { category: category || undefined, search: search || undefined })
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
// WHY: Admins need to be able to add new products to the store
export async function POST(request: NextRequest) {
  // Declare session outside try block so it's accessible in catch for logging
  // WHY: Error handler needs access to session for logging purposes
  // Use proper type for session - it can be null or have user with role
  let session: Session | null = null
  
  try {
    // Check if user is authenticated and is an admin
    // WHY: Only admins should be able to create products
    session = await getServerSession(authOptions)
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Parse request body to get product data
    // WHY: The frontend sends product details (name, price, etc.) in the request body
    const body = await request.json()
    const { name, description, price, category, images, stock } = body
    
    // Validate required fields - ensure all necessary data is provided
    // WHY: We need at least name, description, price, and category to create a valid product
    if (!name || !description || !price || !category) {
      logger.warn('Product creation attempt with missing fields', { 
        hasName: !!name, 
        hasDescription: !!description, 
        hasPrice: !!price, 
        hasCategory: !!category 
      })
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, price, and category are required' },
        { status: 400 }
      )
    }

    // Validate price is a valid positive number
    // WHY: Price must be a valid number and not negative
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) {
      logger.warn('Product creation attempt with invalid price', { price })
      return NextResponse.json(
        { success: false, error: 'Price must be a valid positive number' },
        { status: 400 }
      )
    }

    // Validate stock is a valid non-negative integer
    // WHY: Stock must be a valid integer (can't have half items)
    const stockNum = stock !== undefined ? parseInt(stock) : 0
    if (stockNum < 0 || (stock !== undefined && !Number.isInteger(stockNum))) {
      logger.warn('Product creation attempt with invalid stock', { stock })
      return NextResponse.json(
        { success: false, error: 'Stock must be a valid non-negative integer' },
        { status: 400 }
      )
    }
    
    // Create new product in the database
    // WHY: We use the shared products database so the product persists and is visible to all endpoints
    const newProduct = await productsDb.createProduct({
      name: String(name).trim(), // Sanitize: trim whitespace
      description: String(description).trim(),
      price: priceNum,
      category: String(category).trim(),
      images: images || ['/api/placeholder/300/300'], // Default image if none provided
      stock: stockNum
    })

    // Log successful product creation with admin info
    // WHY: Audit log - track who created what
    if (session?.user?.id) {
      logger.info('Product created successfully', { 
        productId: newProduct.id, 
        name: newProduct.name, 
        adminId: session.user.id 
      })
    } else {
      logger.info('Product created successfully', { 
        productId: newProduct.id, 
        name: newProduct.name 
      })
    }
    
    // Return the newly created product
    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 }) // 201 = Created
  } catch (error) {
    // Handle errors gracefully
    // WHY: Don't expose internal errors to potential attackers
    logger.error('Error creating product', error as Error, { 
      adminId: session?.user?.id || undefined 
    })
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

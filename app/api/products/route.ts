import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { productsDb } from '@/lib/products-db'

// GET /api/products - Get all products
// WHY: This endpoint returns all products, with optional filtering by category or search term
export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the URL
    // WHY: Users might want to filter products by category or search for specific products
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    // Get all products from the database
    // WHY: We need to fetch products from the shared store so all endpoints see the same data
    let filteredProducts = productsDb.getAllProducts()
    
    // Filter by category if provided
    // WHY: Users might want to see only products in a specific category (e.g., "Gaming")
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Filter by search term if provided
    // WHY: Users might want to search for products by name or description
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
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
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
// WHY: Admins need to be able to add new products to the store
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    // WHY: Only admins should be able to create products
    const session = await getServerSession(authOptions)
    
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
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create new product in the database
    // WHY: We use the shared products database so the product persists and is visible to all endpoints
    const newProduct = await productsDb.createProduct({
      name,
      description,
      price: parseFloat(price), // Convert string to number
      category,
      images: images || ['/api/placeholder/300/300'], // Default image if none provided
      stock: parseInt(stock) || 0 // Default to 0 stock if not provided
    })
    
    // Return the newly created product
    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 }) // 201 = Created
  } catch (error) {
    // Handle errors gracefully
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

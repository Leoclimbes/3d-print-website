import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { productsDb } from '@/lib/products-db'

// GET /api/products/[id] - Get single product by ID
// WHY: When viewing or editing a product, we need to fetch its details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    // WHY: In newer Next.js versions, params is a Promise that needs to be awaited
    const resolvedParams = await Promise.resolve(params)
    const productId = resolvedParams.id
    
    // Get product from the shared database by ID
    // WHY: We use the shared products database so we always get the latest data
    const product = productsDb.getProductById(productId)
    
    // If product doesn't exist, return 404
    // WHY: The client needs to know if the product they're looking for doesn't exist
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Return the product data
    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    // Handle errors gracefully
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product
// WHY: Admins need to be able to edit product details (name, price, description, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    // WHY: In newer Next.js versions, params is a Promise that needs to be awaited
    const resolvedParams = await Promise.resolve(params)
    const productId = resolvedParams.id
    
    // Check if user is authenticated and is an admin
    // WHY: Only admins should be able to update products
    const session = await getServerSession(authOptions)
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Parse request body to get updated product data
    // WHY: The frontend sends the updated product fields in the request body
    const body = await request.json()
    
    // Update product in the shared database
    // WHY: We use the shared products database so the update is visible to all endpoints
    const updatedProduct = await productsDb.updateProduct(productId, body)
    
    // If product doesn't exist, return 404
    // WHY: The client needs to know if the product they're trying to update doesn't exist
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Return the updated product
    return NextResponse.json({
      success: true,
      data: updatedProduct
    })
  } catch (error) {
    // Handle errors gracefully
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product
// WHY: Admins need to be able to remove products from the store
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    // WHY: In newer Next.js versions, params is a Promise that needs to be awaited
    const resolvedParams = await Promise.resolve(params)
    const productId = resolvedParams.id
    
    // Log for debugging - helps us see what ID is being used
    // WHY: If deletion fails, we can check the logs to see if the ID is correct
    console.log('Attempting to delete product with ID:', productId)
    
    // Check if user is authenticated and is an admin
    // WHY: Only admins should be able to delete products (this is a destructive operation)
    const session = await getServerSession(authOptions)
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get all products for debugging - helps us see what IDs exist
    // WHY: If product not found, we can check what products actually exist in the database
    const allProducts = productsDb.getAllProducts()
    console.log('Available product IDs:', allProducts.map(p => p.id))
    
    // Delete product from the shared database
    // WHY: We use the shared products database so the deletion is persistent and visible to all endpoints
    const deleted = await productsDb.deleteProduct(productId)
    
    // If product doesn't exist, return 404 with more details
    // WHY: The client needs to know if the product they're trying to delete doesn't exist
    if (!deleted) {
      console.log(`Product with ID "${productId}" not found. Available IDs: ${allProducts.map(p => p.id).join(', ')}`)
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Return success message
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    // Handle errors gracefully
    // WHY: We want to log the full error details for debugging
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

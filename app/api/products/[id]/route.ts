import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { productsDb } from '@/lib/products-db'
import { logger } from '@/lib/logger'

// GET /api/products/[id] - Get single product by ID
// WHY: When viewing or editing a product, we need to fetch its details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Declare productId outside try block so it's accessible in catch for logging
  // WHY: Error handler needs access to productId for logging purposes
  let productId: string | undefined
  
  try {
    // Await params if it's a Promise (Next.js 15+)
    // WHY: In newer Next.js versions, params is a Promise that needs to be awaited
    const resolvedParams = await Promise.resolve(params)
    productId = resolvedParams.id
    
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
    // WHY: Don't expose internal errors - log them but return generic message
    logger.error('Error fetching product', error as Error, { productId })
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
  // Declare productId outside try block so it's accessible in catch for logging
  // WHY: Error handler needs access to productId for logging purposes
  let productId: string | undefined
  
  try {
    // Await params if it's a Promise (Next.js 15+)
    // WHY: In newer Next.js versions, params is a Promise that needs to be awaited
    const resolvedParams = await Promise.resolve(params)
    productId = resolvedParams.id
    
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

    // Validate that price is valid if provided
    // WHY: Ensure data integrity - price must be a valid positive number
    if (body.price !== undefined) {
      const priceNum = parseFloat(body.price)
      if (isNaN(priceNum) || priceNum < 0) {
        logger.warn('Product update attempt with invalid price', { productId, price: body.price })
        return NextResponse.json(
          { success: false, error: 'Price must be a valid positive number' },
          { status: 400 }
        )
      }
    }

    // Validate that stock is valid if provided
    // WHY: Ensure data integrity - stock must be a valid non-negative integer
    if (body.stock !== undefined) {
      const stockNum = parseInt(body.stock)
      if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
        logger.warn('Product update attempt with invalid stock', { productId, stock: body.stock })
        return NextResponse.json(
          { success: false, error: 'Stock must be a valid non-negative integer' },
          { status: 400 }
        )
      }
    }
    
    // Update product in the shared database
    // WHY: We use the shared products database so the update is visible to all endpoints
    const updatedProduct = await productsDb.updateProduct(productId, body)

    if (updatedProduct) {
      logger.info('Product updated successfully', { productId, adminId: session.user.id })
    }
    
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
    // WHY: Log full error but return generic message to user
    logger.error('Error updating product', error as Error, { productId })
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
  // Declare productId outside try block so it's accessible in catch for logging
  // WHY: Error handler needs access to productId for logging purposes
  let productId: string | undefined
  
  try {
    // Await params if it's a Promise (Next.js 15+)
    // WHY: In newer Next.js versions, params is a Promise that needs to be awaited
    const resolvedParams = await Promise.resolve(params)
    productId = resolvedParams.id
    
    // Check if user is authenticated and is an admin
    // WHY: Only admins should be able to delete products (this is a destructive operation)
    const session = await getServerSession(authOptions)
    
    if (session?.user?.role !== 'admin') {
      logger.warn('Unauthorized product deletion attempt', { productId, userId: session?.user?.id })
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Delete product from the shared database
    // WHY: We use the shared products database so the deletion is persistent and visible to all endpoints
    const deleted = await productsDb.deleteProduct(productId)
    
    // If product doesn't exist, return 404
    // WHY: The client needs to know if the product they're trying to delete doesn't exist
    if (!deleted) {
      logger.warn('Product deletion failed - product not found', { productId, adminId: session.user.id })
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Log successful deletion
    logger.info('Product deleted successfully', { productId, adminId: session.user.id })
    
    // Return success message
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    // Handle errors gracefully
    // WHY: Log full error details for debugging but return generic message to user
    logger.error('Error deleting product', error as Error, { productId })
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

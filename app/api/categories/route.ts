import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'

// ============================================================================
// CATEGORIES API ROUTE - Handles category CRUD operations
// ============================================================================
// WHY: This API route manages categories. Currently uses mock data, but can
// be extended to use a database. Supports GET (all categories) and PUT/PATCH
// (update category with image).

// Mock data for categories - stored in memory
// WHY: For now, categories are stored in memory. In production, this would be
// replaced with a database (Supabase, PostgreSQL, etc.)
let mockCategories = [
  {
    id: '1',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Phone stands, holders, and other accessories',
    image: '/api/placeholder/300/200',
    productCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Gaming',
    slug: 'gaming',
    description: 'Gaming accessories and organizers',
    image: '/api/placeholder/300/200',
    productCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Office',
    slug: 'office',
    description: 'Office organization and productivity tools',
    image: '/api/placeholder/300/200',
    productCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// GET /api/categories - Get all categories
// WHY: Returns all available product categories for display on the categories page
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockCategories,
      total: mockCategories.length
    })
  } catch (error) {
    // Use logger for consistent error reporting
    logger.error('Error fetching categories', error as Error, {})
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// PUT /api/categories - Update a category (especially for adding/updating images)
// WHY: Admins need to be able to update category information, particularly images
export async function PUT(request: NextRequest) {
  // Declare session outside try block so it's accessible in catch for logging
  // WHY: Error handler needs access to session for logging purposes
  let session = null
  
  try {
    // Check if user is authenticated and is an admin
    // WHY: Only admins should be able to update categories
    session = await getServerSession(authOptions)
    
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    // Parse request body to get category update data
    // WHY: The frontend sends category details (name, description, image) in the request body
    const body = await request.json()
    const { id, name, description, image } = body
    
    // Validate required fields - category ID is required
    // WHY: We need to know which category to update
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      )
    }
    
    // Find the category to update
    // WHY: We need to find the category in our mock data array
    const categoryIndex = mockCategories.findIndex(cat => cat.id === id)
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }
    
    // Update the category with new data
    // WHY: Update only the fields that were provided (partial update)
    const updatedCategory = {
      ...mockCategories[categoryIndex],
      ...(name && { name }), // Only update name if provided
      ...(description !== undefined && { description }), // Update description (can be empty string)
      ...(image && { image }), // Only update image if provided
      updatedAt: new Date().toISOString() // Always update the updatedAt timestamp
    }
    
    // Replace the old category with the updated one
    // WHY: Save the changes back to our mock data array
    mockCategories[categoryIndex] = updatedCategory
    
    // Log successful update with admin info
    // WHY: Audit log - track who updated what
    logger.info('Category updated successfully', { 
      categoryId: id, 
      name: updatedCategory.name,
      adminId: session.user.id 
    })
    
    // Return the updated category
    return NextResponse.json({
      success: true,
      data: updatedCategory
    })
  } catch (error) {
    // Handle errors gracefully
    // WHY: Don't expose internal errors to potential attackers
    logger.error('Error updating category', error as Error, { 
      adminId: session?.user?.id || undefined 
    })
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

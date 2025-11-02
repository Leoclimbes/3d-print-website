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

// POST /api/categories - Create a new category
// WHY: Admins need to be able to create new categories for organizing products
export async function POST(request: NextRequest) {
  // Declare session outside try block so it's accessible in catch for logging
  // WHY: Error handler needs access to session for logging purposes
  let session = null
  
  try {
    // Check if user is authenticated and is an admin
    // WHY: Only admins should be able to create categories
    session = await getServerSession(authOptions)
    
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    // Parse request body to get category data
    // WHY: The frontend sends category details (name, slug, description, image) in the request body
    const body = await request.json()
    const { name, slug, description, image } = body
    
    // Validate required fields - name and slug are required
    // WHY: Every category needs a name and a URL-friendly slug
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      )
    }
    
    // Check if slug already exists (slugs must be unique)
    // WHY: URL slugs need to be unique so we can route to specific categories correctly
    const existingCategory = mockCategories.find(cat => cat.slug === slug)
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 400 }
      )
    }
    
    // Generate a new ID for the category
    // WHY: Each category needs a unique identifier
    const newId = String(Math.max(...mockCategories.map(c => Number(c.id)), 0) + 1)
    const now = new Date().toISOString()
    
    // Create the new category object
    // WHY: Build the complete category object with all required fields
    const newCategory = {
      id: newId,
      name,
      slug,
      description: description || '', // Default to empty string if not provided
      image: image || '/api/placeholder/300/200', // Default placeholder image
      productCount: 0, // New category has no products yet
      createdAt: now,
      updatedAt: now
    }
    
    // Add the new category to the array
    // WHY: Save the new category to our mock data array
    mockCategories.push(newCategory)
    
    // Log successful creation with admin info
    // WHY: Audit log - track who created what
    logger.info('Category created successfully', { 
      categoryId: newId, 
      name: newCategory.name,
      slug: newCategory.slug,
      adminId: session.user.id 
    })
    
    // Return the newly created category
    return NextResponse.json({
      success: true,
      data: newCategory
    }, { status: 201 }) // 201 Created status for successful resource creation
  } catch (error) {
    // Handle errors gracefully
    // WHY: Don't expose internal errors to potential attackers
    logger.error('Error creating category', error as Error, { 
      adminId: session?.user?.id || undefined 
    })
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories - Update a category
// WHY: Admins need to be able to update category information (name, slug, description, image)
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
    // WHY: The frontend sends category details (name, slug, description, image) in the request body
    const body = await request.json()
    const { id, name, slug, description, image } = body
    
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
    
    // If slug is being updated, check if the new slug already exists (and it's not the same category)
    // WHY: Slugs must be unique, so we need to prevent duplicates
    if (slug && slug !== mockCategories[categoryIndex].slug) {
      const existingCategory = mockCategories.find(cat => cat.slug === slug && cat.id !== id)
      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: 'A category with this slug already exists' },
          { status: 400 }
        )
      }
    }
    
    // Update the category with new data
    // WHY: Update only the fields that were provided (partial update)
    const updatedCategory = {
      ...mockCategories[categoryIndex],
      ...(name && { name }), // Only update name if provided
      ...(slug && { slug }), // Only update slug if provided
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

// DELETE /api/categories - Delete a category
// WHY: Admins need to be able to delete categories that are no longer needed
export async function DELETE(request: NextRequest) {
  // Declare session outside try block so it's accessible in catch for logging
  // WHY: Error handler needs access to session for logging purposes
  let session = null
  
  try {
    // Check if user is authenticated and is an admin
    // WHY: Only admins should be able to delete categories
    session = await getServerSession(authOptions)
    
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    // Get category ID from URL search params
    // WHY: DELETE requests typically send the ID in the URL query string (e.g., ?id=123)
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('id')
    
    // Validate that category ID was provided
    // WHY: We need to know which category to delete
    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      )
    }
    
    // Find the category to delete
    // WHY: We need to find the category in our mock data array
    const categoryIndex = mockCategories.findIndex(cat => cat.id === categoryId)
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }
    
    // Get category info before deletion for logging
    // WHY: We want to log what was deleted for audit purposes
    const deletedCategory = mockCategories[categoryIndex]
    
    // Remove the category from the array
    // WHY: Delete the category from our mock data array
    mockCategories.splice(categoryIndex, 1)
    
    // Log successful deletion with admin info
    // WHY: Audit log - track who deleted what
    logger.info('Category deleted successfully', { 
      categoryId, 
      name: deletedCategory.name,
      adminId: session.user.id 
    })
    
    // Return success confirmation
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      data: { id: categoryId }
    })
  } catch (error) {
    // Handle errors gracefully
    // WHY: Don't expose internal errors to potential attackers
    logger.error('Error deleting category', error as Error, { 
      adminId: session?.user?.id || undefined 
    })
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}

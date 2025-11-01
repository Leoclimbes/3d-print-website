import { NextRequest, NextResponse } from 'next/server'

// Mock data for categories
const mockCategories = [
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
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockCategories,
      total: mockCategories.length
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

// ============================================================================
// POST /api/upload - Upload Images to Cloudinary
// ============================================================================
// WHY: This API route handles image uploads securely on the server side.
// Client-side uploads would expose API keys, so we do it server-side instead.
// The route checks for admin authentication before allowing uploads.

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    // WHY: Only admins should be able to upload product images
    const session = await getServerSession(authOptions)
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Parse the form data from the request
    // WHY: FormData contains the file that was uploaded from the client
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    // Validate that files were provided
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    // Upload each file to Cloudinary and collect the URLs
    // WHY: We support multiple image uploads at once for product galleries
    const uploadPromises = files.map(async (file) => {
      try {
        // Validate file type - only allow images
        // WHY: Security measure to prevent non-image files from being uploaded
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`)
        }

        // Upload to Cloudinary with folder organization
        // WHY: 'products' folder keeps all product images organized in Cloudinary
        const result = await uploadImageToCloudinary(file, 'products')
        
        return {
          url: result.url,
          public_id: result.public_id,
          name: file.name
        }
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error)
        throw error
      }
    })

    // Wait for all uploads to complete
    // WHY: Promise.all waits for all uploads before responding
    const uploadedImages = await Promise.all(uploadPromises)

    // Return success response with uploaded image URLs
    // WHY: The client needs these URLs to save with the product
    return NextResponse.json({
      success: true,
      data: uploadedImages
    }, { status: 200 })

  } catch (error) {
    console.error('Error uploading images:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload images' 
      },
      { status: 500 }
    )
  }
}


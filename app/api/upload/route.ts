import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImageToLocal } from '@/lib/cloudinary'

// ============================================================================
// POST /api/upload - Upload Images to Local Storage
// ============================================================================
// WHY: This API route handles image uploads securely on the server side.
// Files are saved to public/uploads so they're accessible via public URLs.
// The route checks for admin authentication before allowing uploads.

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    // WHY: Only admins should be able to upload product images
    const session = await getServerSession(authOptions)
    
    if (!session || session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Parse the form data from the request
    // WHY: FormData contains the file(s) that were uploaded from the client
    const formData = await request.formData()
    
    // Get all files from the 'files' field
    // WHY: We support multiple file uploads (user can select multiple images at once)
    const files = formData.getAll('files') as File[]

    // Validate that files were provided
    // WHY: We can't upload if no files were sent
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided. Please select at least one image.' },
        { status: 400 }
      )
    }

    // Validate each file before uploading
    // WHY: We want to check all files first, then upload all at once (all or nothing approach)
    const validationErrors: string[] = []
    
    files.forEach((file, index) => {
      // Check if file has a valid image type
      // WHY: Security - we only want image files, not executables or documents
      if (!file.type || !file.type.startsWith('image/')) {
        validationErrors.push(`File ${index + 1} (${file.name}) is not an image file`)
      }
      
      // Check file size (limit to 10MB per file)
      // WHY: Prevent huge files that could fill up disk space or cause slow uploads
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        validationErrors.push(`File ${index + 1} (${file.name}) is too large. Maximum size is 10MB.`)
      }
      
      // Check if file is empty
      // WHY: Empty files can cause errors
      if (file.size === 0) {
        validationErrors.push(`File ${index + 1} (${file.name}) is empty.`)
      }
    })

    // If validation errors exist, return them
    // WHY: Better to fail early with clear error messages than start uploading
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationErrors 
        },
        { status: 400 }
      )
    }

    // Upload each file and collect the results
    // WHY: We support multiple image uploads at once for product galleries
    const uploadResults = []
    
    // Use for...of loop instead of Promise.all to upload sequentially
    // WHY: Prevents overwhelming the server with simultaneous writes, and better error handling
    for (const file of files) {
      try {
        // Upload file to local storage (public/uploads/products/)
        // WHY: uploadImageToLocal saves the file and returns the public URL
        const result = await uploadImageToLocal(file, 'products')
        
        // Store result with original filename for reference
        // WHY: Useful for debugging and user feedback
        uploadResults.push({
          url: result.url, // Public URL like "/uploads/products/image-123.jpg"
          filename: result.filename, // Actual filename on disk
          name: file.name, // Original filename from user's computer
          size: file.size // File size in bytes
        })
      } catch (error) {
        // If one file fails, log it and include in response
        // WHY: User should know which file failed, but other files might still succeed
        console.error(`Error uploading file ${file.name}:`, error)
        
        // Return error for this specific file
        // WHY: User needs to know what went wrong
        return NextResponse.json(
          { 
            success: false, 
            error: `Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}` 
          },
          { status: 500 }
        )
      }
    }

    // If we got here, all uploads succeeded
    // WHY: Return success with all uploaded image URLs
    return NextResponse.json({
      success: true,
      data: uploadResults,
      message: `Successfully uploaded ${uploadResults.length} image(s)`
    }, { status: 200 })

  } catch (error) {
    // Catch any unexpected errors
    // WHY: Better error handling prevents crashes and gives useful feedback
    console.error('Error in upload route:', error)
    
    // Return detailed error message
    // WHY: Helps with debugging and user feedback
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload images. Please try again.' 
      },
      { status: 500 }
    )
  }
}

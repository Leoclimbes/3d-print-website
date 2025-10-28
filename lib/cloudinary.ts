import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with environment variables
// These are loaded from your .env.local file
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Function to upload images to Cloudinary
// This is used in API routes for secure server-side uploads
export async function uploadImageToCloudinary(
  file: File,
  folder: string = '3d-prints'
): Promise<{ url: string; public_id: string }> {
  try {
    // Convert File to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary with optimization settings
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder, // Organize images in folders
          resource_type: 'image',
          transformation: [
            { quality: 'auto' }, // Auto quality for web optimization
            { fetch_format: 'auto' }, // Auto format (WebP when supported)
            { width: 1200, height: 1200, crop: 'limit' }, // Max dimensions
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return {
      url: (result as any).secure_url,
      public_id: (result as any).public_id,
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

// Function to delete images from Cloudinary
// Used when products are deleted or images are replaced
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw new Error('Failed to delete image')
  }
}

// Function to get optimized image URL
// This creates optimized URLs for different use cases
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string
    format?: string
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto' } = options
  
  // Build transformation parameters
  const transformations = []
  
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (quality) transformations.push(`q_${quality}`)
  if (format) transformations.push(`f_${format}`)
  
  // Add crop mode for consistent sizing
  if (width && height) transformations.push('c_fill')
  
  const transformationString = transformations.join(',')
  
  // Return optimized URL
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}/${publicId}`
}

// Helper function to extract public_id from Cloudinary URL
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const regex = /\/upload\/.*\/(.+)$/
    const match = url.match(regex)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export { cloudinary }

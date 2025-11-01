// ============================================================================
// Image Upload Utilities - Local File Storage System
// ============================================================================
// WHY: We use local file storage instead of Cloudinary so images work immediately
// without needing external service configuration. Images are stored in public/uploads
// which makes them accessible via URLs like /uploads/products/image.jpg

import fs from 'fs'
import path from 'path'
import { writeFile, mkdir } from 'fs/promises'

// Base upload directory - where all uploaded images are stored
// WHY: All images go into public/uploads so they're accessible via public URLs
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directories exist
// WHY: The folders might not exist when the app first starts
async function ensureUploadDir(folder: string) {
  const folderPath = path.join(UPLOAD_DIR, folder)
  
  // Check if directory exists, create if it doesn't
  // WHY: fs.existsSync is synchronous and fast for checking
  if (!fs.existsSync(folderPath)) {
    // Create directory recursively (creates parent directories if needed)
    // WHY: mkdir with recursive: true creates all parent directories
    await mkdir(folderPath, { recursive: true })
  }
  
  return folderPath
}

// Generate a unique filename to avoid overwriting existing files
// WHY: If two users upload "photo.jpg", we need unique names like "photo-1234567890.jpg"
function generateUniqueFilename(originalName: string): string {
  // Get file extension (e.g., ".jpg", ".png")
  // WHY: We want to preserve the original file type
  const ext = path.extname(originalName)
  
  // Get base name without extension
  // WHY: We'll add our own unique identifier
  const baseName = path.basename(originalName, ext)
  
  // Sanitize filename - remove special characters that could cause issues
  // WHY: Some characters like spaces or special chars can break URLs or file systems
  const sanitizedName = baseName
    .replace(/[^a-zA-Z0-9]/g, '-') // Replace non-alphanumeric with dashes
    .toLowerCase() // Convert to lowercase
    .substring(0, 50) // Limit length to 50 chars
  
  // Generate unique timestamp + random number
  // WHY: This ensures each file gets a unique name even if uploaded at the same time
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  
  // Return final filename
  return `${sanitizedName}-${uniqueId}${ext}`
}

// Upload image file to local storage
// WHY: This function takes a File object and saves it to disk, returning the URL
export async function uploadImageToLocal(
  file: File,
  folder: string = 'products'
): Promise<{ url: string; filename: string }> {
  try {
    // Ensure the upload directory exists
    // WHY: We need the folder to exist before writing files to it
    const folderPath = await ensureUploadDir(folder)
    
    // Validate that it's actually an image file
    // WHY: Security measure - we only want image files, not executables or scripts
    if (!file.type.startsWith('image/')) {
      throw new Error(`File ${file.name} is not an image. File type: ${file.type}`)
    }
    
    // Convert File to buffer (binary data)
    // WHY: Files are sent as bytes, we need to convert to Buffer to write to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Generate unique filename
    // WHY: Prevent filename conflicts and overwrites
    const filename = generateUniqueFilename(file.name)
    const filepath = path.join(folderPath, filename)
    
    // Write file to disk
    // WHY: This actually saves the file to the public/uploads folder
    await writeFile(filepath, buffer)
    
    // Return the public URL path
    // WHY: The frontend needs a URL to display the image and save in the database
    // Public URLs start with /uploads/ and are served by Next.js automatically
    const url = `/uploads/${folder}/${filename}`
    
    return {
      url,
      filename
    }
  } catch (error) {
    // Log detailed error for debugging
    // WHY: If upload fails, we need to know why
    console.error('Error uploading image:', error)
    
    // Throw a user-friendly error message
    // WHY: The API route needs to return an error message to the frontend
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Delete image file from local storage
// WHY: When products are deleted or images are replaced, we should clean up files
export async function deleteImageFromLocal(imageUrl: string): Promise<void> {
  try {
    // Extract file path from URL
    // WHY: URLs like "/uploads/products/image.jpg" need to become "public/uploads/products/image.jpg"
    if (imageUrl.startsWith('/uploads/')) {
      const filepath = path.join(process.cwd(), 'public', imageUrl)
      
      // Check if file exists before trying to delete
      // WHY: Avoid errors if file was already deleted
      if (fs.existsSync(filepath)) {
        // Delete the file
        // WHY: Clean up disk space
        await fs.promises.unlink(filepath)
      }
    }
  } catch (error) {
    // Log error but don't throw - deletion failure shouldn't break the app
    // WHY: If file deletion fails (maybe already deleted), it's not critical
    console.error('Error deleting image:', error)
  }
}

// Get optimized image URL (for compatibility - returns same URL)
// WHY: This keeps the same interface as Cloudinary version for easy switching
export function getOptimizedImageUrl(
  imageUrl: string,
  options?: {
    width?: number
    height?: number
    quality?: string
    format?: string
  }
): string {
  // For local storage, we just return the URL as-is
  // WHY: Image optimization can be added later if needed (e.g., with Sharp library)
  return imageUrl
}

// Helper function to extract filename from URL (for compatibility)
// WHY: Keeps same interface as Cloudinary version
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Extract filename from URL like "/uploads/products/image.jpg"
    // WHY: Returns just "image.jpg" for reference
    const parts = url.split('/')
    return parts[parts.length - 1] || null
  } catch {
    return null
  }
}

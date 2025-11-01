'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, ArrowLeft, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Category interface - defines structure of category objects
// WHY: TypeScript needs to know what properties a category has
interface Category {
  id: string
  name: string
  slug: string
}

// Product interface - defines structure of product objects
// WHY: TypeScript needs to know what properties a product has when we fetch it
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  stock: number
  createdAt: string
  updatedAt: string
}

export default function EditProductPage() {
  // Router and params - get product ID from URL
  // WHY: Next.js useParams hook gives us the dynamic route parameter (the product ID)
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string // Extract product ID from URL params

  // Loading state - tracks if we're fetching or saving data
  // WHY: We need to show loading indicators while async operations are happening
  const [loading, setLoading] = useState(false)
  
  // Fetching state - tracks if we're still loading the product data
  // WHY: Separate from loading so we can show different UI while fetching vs saving
  const [fetching, setFetching] = useState(true)
  
  // Categories state - stores all available categories
  // WHY: We need categories to populate the category dropdown
  const [categories, setCategories] = useState<Category[]>([])

  // Form data state - stores all the form field values
  // WHY: We use controlled inputs, so we need state to track their values
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [] as string[] // Array of Cloudinary image URLs
  })

  // Image modal state - for previewing images in a larger view
  // WHY: Users should be able to click preview images to see them larger
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  // Fetch product data and categories on component mount
  // WHY: We need to load existing product data to populate the form, and categories for the dropdown
  useEffect(() => {
    // Async function to fetch both product and categories
    const fetchData = async () => {
      if (!productId) return // Don't fetch if no product ID

      try {
        setFetching(true)

        // Fetch product data from API
        // WHY: GET /api/products/[id] returns the product details we need to populate the form
        const productResponse = await fetch(`/api/products/${productId}`)
        const productData = await productResponse.json()

        // If product fetch failed, show error and redirect
        // WHY: If product doesn't exist, we can't edit it
        if (!productData.success) {
          alert('Product not found')
          router.push('/admin/products/list')
          return
        }

        // Extract product from response
        // WHY: The API returns { success: true, data: product }
        const product: Product = productData.data

        // Populate form with existing product data
        // WHY: Users need to see the current values so they can edit them
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          category: product.category || '',
          stock: product.stock?.toString() || '',
          images: product.images || [] // Existing images from Cloudinary
        })

        // Fetch categories for the dropdown
        // WHY: We need categories to populate the category select component
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()

        // If categories fetch succeeded, update categories state
        // WHY: We store categories in state so the Select component can use them
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }
      } catch (error) {
        // Handle errors gracefully
        // WHY: If fetching fails, we should inform the user
        console.error('Error fetching product:', error)
        alert('Failed to load product. Please try again.')
        router.push('/admin/products/list')
      } finally {
        // Always set fetching to false when done
        // WHY: We want to hide loading indicators even if there's an error
        setFetching(false)
      }
    }

    fetchData()
  }, [productId, router]) // Re-run if productId or router changes

  // Handle form input changes - updates form data state
  // WHY: Controlled inputs need their values stored in state
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value // Update only the field that changed
    }))
  }

  // Handle image upload - Uploads to local file storage via API
  // WHY: We need to actually upload images to the server so they persist.
  // URL.createObjectURL only creates temporary local URLs that don't persist.
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return // Exit if no files selected

    // Show loading state while uploading
    // WHY: Users need visual feedback that something is happening
    setLoading(true)

    try {
      // Validate files before uploading
      // WHY: Better user experience to catch errors before uploading
      const validationErrors: string[] = []
      
      Array.from(files).forEach((file, index) => {
        // Check if it's an image file
        // WHY: Only image files should be uploaded
        if (!file.type.startsWith('image/')) {
          validationErrors.push(`File ${index + 1} (${file.name}) is not an image file`)
        }
        
        // Check file size (10MB limit)
        // WHY: Prevent huge files that take too long to upload
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
          validationErrors.push(`File ${index + 1} (${file.name}) is too large. Maximum size is 10MB.`)
        }
        
        // Check if file is empty
        // WHY: Empty files cause errors
        if (file.size === 0) {
          validationErrors.push(`File ${index + 1} (${file.name}) is empty`)
        }
      })

      // If validation errors exist, show them and stop
      // WHY: Better to fail early with clear messages
      if (validationErrors.length > 0) {
        alert(`Upload validation failed:\n${validationErrors.join('\n')}`)
        setLoading(false)
        // Reset the file input so user can try again
        // WHY: Clear the input so same file can be selected again if needed
        event.target.value = ''
        return
      }

      // Create FormData to send files to the upload API
      // WHY: FormData is the standard way to send files in HTTP requests
      const formData = new FormData()
      
      // Add all selected files to FormData
      // WHY: We support multiple image uploads at once for product galleries
      Array.from(files).forEach(file => {
        formData.append('files', file) // 'files' is the field name expected by /api/upload
      })

      // Upload images to server
      // WHY: The /api/upload endpoint handles file upload securely on server
      // It saves files to public/uploads/products/ and returns public URLs
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData, // FormData is sent directly, browser sets Content-Type header automatically
      })

      // Parse response JSON
      // WHY: The API returns JSON with success status and data or error
      const data = await response.json()

      // If upload succeeded, add URLs to form data
      // WHY: We need these URLs to save with the product in the database
      if (data.success) {
        // Extract URLs from uploaded images
        // WHY: The API returns { success: true, data: [{ url: string, filename: string, name: string }] }
        const uploadedUrls = data.data.map((img: { url: string }) => img.url)
        
        // Update form data with uploaded image URLs (append to existing images)
        // WHY: Users can add more images to existing product images
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls] // Spread existing images, then add new ones
        }))
        
        // Show success message (optional, can be removed if too noisy)
        // WHY: User feedback that upload worked
        console.log(`Successfully uploaded ${uploadedUrls.length} image(s)`)
      } else {
        // Show detailed error message
        // WHY: Users need to know what went wrong
        const errorMessage = data.details 
          ? `${data.error}:\n${data.details.join('\n')}` 
          : data.error || 'Failed to upload images'
        alert(errorMessage)
      }
    } catch (error) {
      // Handle network errors or other unexpected errors
      // WHY: Network failures or server errors need to be caught
      console.error('Error uploading images:', error)
      
      // Show user-friendly error message
      // WHY: Users need to know something went wrong
      const errorMessage = error instanceof Error 
        ? `Upload failed: ${error.message}` 
        : 'Failed to upload images. Please check your connection and try again.'
      alert(errorMessage)
    } finally {
      // Always clear loading state
      // WHY: Re-enable form even if there's an error
      setLoading(false)
      
      // Reset the file input so user can upload more files
      // WHY: Allows user to upload more images or retry if needed
      event.target.value = ''
    }
  }

  // Remove image from the form
  // WHY: Users should be able to delete images they don't want
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index) // Remove image at specified index
    }))
  }

  // Open image modal for preview
  // WHY: Users should be able to view uploaded images in detail before submitting
  const openImageModal = (images: string[], initialIndex: number = 0) => {
    setSelectedImages(images) // Set which images to show in modal
    setCurrentImageIndex(initialIndex) // Start at the clicked image
    setIsImageModalOpen(true) // Open the modal dialog
  }

  // Navigate to previous image in modal
  // WHY: When viewing multiple images, users need to navigate between them
  const previousImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? selectedImages.length - 1 : prev - 1 // Wrap around to last image if at first
    )
  }

  // Navigate to next image in modal
  // WHY: When viewing multiple images, users need to navigate between them
  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === selectedImages.length - 1 ? 0 : prev + 1 // Wrap around to first image if at last
    )
  }

  // Handle form submission - updates the product
  // WHY: When user clicks "Update Product", we need to save the changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission (page reload)
    setLoading(true) // Show loading state

    try {
      // Send PUT request to update product
      // WHY: PUT /api/products/[id] updates the product with new data
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Tell server we're sending JSON
        },
        body: JSON.stringify({
          ...formData, // Spread all form fields
          price: parseFloat(formData.price), // Convert price string to number
          stock: parseInt(formData.stock) || 0, // Convert stock string to number (default 0)
          // Keep images as is (array of Cloudinary URLs)
          // If no images, use placeholder (though in edit mode, existing images should remain)
          images: formData.images.length > 0 ? formData.images : ['/api/placeholder/300/300']
        }),
      })

      const data = await response.json()

      // If update succeeded, redirect to products list
      // WHY: Users should see confirmation that the update worked
      if (data.success) {
        router.push('/admin/products/list')
      } else {
        // Show error if update failed
        // WHY: Users need to know if the save failed
        alert(data.error || 'Failed to update product')
      }
    } catch (error) {
      // Handle network or other errors
      // WHY: If fetch fails, we should inform the user
      console.error('Error updating product:', error)
      alert('Failed to update product')
    } finally {
      // Always clear loading state
      // WHY: Re-enable the form even if there's an error
      setLoading(false)
    }
  }

  // Show loading state while fetching product data
  // WHY: Users should see that data is loading, not a blank form
  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      {/* WHY: Users need clear navigation and page title */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/products/list">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update product information</p>
        </div>
      </div>

      {/* Product Edit Form */}
      {/* WHY: This form allows admins to update all product details including images */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Information Card */}
          {/* WHY: Groups related fields together for better UX */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Basic details about your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Name Input */}
              {/* WHY: Product name is a required field */}
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required // HTML5 validation
                />
              </div>

              {/* Description Textarea */}
              {/* WHY: Products need descriptions for customers */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your product"
                  rows={4}
                  required
                />
              </div>

              {/* Price and Stock - Side by Side */}
              {/* WHY: Related numeric fields are grouped together */}
              <div className="grid grid-cols-2 gap-4">
                {/* Price Input */}
                {/* WHY: Products need a price */}
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01" // Allow cents
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                {/* Stock Input */}
                {/* WHY: Track inventory quantity */}
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Category Select Dropdown */}
              {/* WHY: Products should be organized into categories */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Map through categories to create dropdown options */}
                    {/* WHY: Display all available categories */}
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Images Card */}
          {/* WHY: Products need images to show customers what they're buying */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Upload or manage product images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload Area */}
              {/* WHY: Users need a way to select and upload image files */}
              <div>
                <Label htmlFor="images">Upload Images</Label>
                <div className="mt-2">
                  {/* Custom styled file input */}
                  {/* WHY: Default file inputs are ugly, so we style our own */}
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {formData.images.length > 0 
                          ? `${formData.images.length} file(s) uploaded` 
                          : 'Click to upload images'}
                      </span>
                    </div>
                    {/* Hidden actual file input */}
                    {/* WHY: We hide the default input and trigger it from our styled label */}
                    <input
                      id="images"
                      type="file"
                      multiple // Allow multiple file selection
                      accept="image/*" // Only accept image files
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={loading} // Disable while uploading
                    />
                  </label>
                </div>
              </div>

              {/* Image Preview Grid */}
              {/* WHY: Users should see previews of uploaded images */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      {/* Clickable image preview */}
                      {/* WHY: Users should be able to click to view larger version */}
                      <div
                        className="cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openImageModal(formData.images, index)}
                      >
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        {/* Hover overlay to show it's clickable */}
                        {/* WHY: Visual feedback that the image is interactive */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                          <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      {/* Remove button - allows deleting individual images */}
                      {/* WHY: Users should be able to remove images they don't want */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 z-10"
                        onClick={() => removeImage(index)}
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Form Action Buttons */}
        {/* WHY: Users need clear save/cancel options */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin/products/list">
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </Button>
        </div>
      </form>

      {/* Image Preview Modal */}
      {/* WHY: Users need to see uploaded images in detail before submitting */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          
          {selectedImages.length > 0 && (
            <div className="relative">
              {/* Main Image Display */}
              {/* WHY: Show the current image in a large, clear view */}
              <div className="relative aspect-square md:aspect-video bg-gray-100">
                <img
                  src={selectedImages[currentImageIndex]}
                  alt={`Preview ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Arrows - Only show if multiple images */}
                {/* WHY: Users need to navigate between images */}
                {selectedImages.length > 1 && (
                  <>
                    {/* Previous Image Button */}
                    <button
                      onClick={previousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    {/* Next Image Button */}
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                
                {/* Image Counter - Shows current position */}
                {/* WHY: Users should know which image they're viewing (e.g., "2 of 5") */}
                {selectedImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded">
                    {currentImageIndex + 1} / {selectedImages.length}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Navigation Bar */}
              {/* WHY: Quick way to jump to specific images */}
              {selectedImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
                  {selectedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-blue-600 ring-2 ring-blue-300' // Highlight current image
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'

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

export default function ProductsListPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  // Initialize to "all" instead of empty string to match SelectItem value
  // WHY: Radix UI Select requires non-empty values, so we use "all" to represent "no filter"
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string}>>([])
  
  // Image modal state - tracks which images to show and current index
  // WHY: We need to track which product's images to show and which image is currently selected
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Delete product handler
  // WHY: This function handles the deletion of a product when admin clicks the delete button
  const handleDelete = async (productId: string) => {
    // Show confirmation dialog before deleting
    // WHY: Deleting a product is destructive, so we want to confirm before proceeding
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return // User cancelled, don't delete
    }
    
    try {
      // Send DELETE request to the API endpoint
      // WHY: We call the DELETE endpoint with the product ID to remove it from the database
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })
      
      // Parse the JSON response
      // WHY: The API returns JSON with success/error information
      const data = await response.json()
      
      // Check if the response was successful (status 200-299)
      // WHY: HTTP status codes tell us if the operation succeeded or failed
      if (response.ok && data.success) {
        // Success! Refresh the products list to show updated data
        // WHY: After deletion, we need to fetch the latest products to remove the deleted one from the UI
        await fetchProducts()
        
        // Optional: Show success message (you could add a toast notification here)
        // For now, the product disappearing from the list is sufficient feedback
      } else {
        // Handle error response from server
        // WHY: The server might return an error if user is unauthorized or product not found
        const errorMessage = data.error || 'Failed to delete product'
        alert(`Error: ${errorMessage}`)
      }
    } catch (error) {
      // Handle network errors or other exceptions
      // WHY: The request might fail due to network issues or other problems
      console.error('Error deleting product:', error)
      alert('Failed to delete product. Please check your connection and try again.')
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Filter products based on search and category
  // WHY: Filter products to show only matching search terms and categories
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase())
    // Handle "all" value as no filter (show all categories)
    // WHY: When "all" is selected, we want to show all products regardless of category
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || product.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  // Open image modal with specific product images
  // WHY: When user clicks an image, we show it in a modal with navigation
  const openImageModal = (images: string[], initialIndex: number = 0) => {
    setSelectedImages(images)
    setCurrentImageIndex(initialIndex)
    setIsImageModalOpen(true)
  }

  // Navigate to previous image in modal
  // WHY: Users should be able to browse through multiple product images
  const previousImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? selectedImages.length - 1 : prev - 1
    )
  }

  // Navigate to next image in modal
  // WHY: Users should be able to browse through multiple product images
  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === selectedImages.length - 1 ? 0 : prev + 1
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your 3D printed products</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  {/* "all" is used instead of empty string because Radix UI Select doesn't allow empty values */}
                  {/* WHY: Radix UI throws an error if SelectItem has an empty string value */}
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="shadow-lg">
            <CardHeader>
              {/* Product Image - Clickable to open modal */}
              {/* WHY: Users should be able to click images to see them larger and browse gallery */}
              <div 
                className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative group"
                onClick={() => product.images && product.images.length > 0 && openImageModal(product.images, 0)}
              >
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {/* Show overlay hint on hover */}
                    {/* WHY: Visual feedback that image is clickable */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Show image count badge if multiple images */}
                    {/* WHY: Users should know there are more images to view */}
                    {product.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        +{product.images.length - 1}
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">No Image</span>
                )}
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {product.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">
                    Stock: {product.stock}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/products/${product.id}`)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || categoryFilter 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first product'
                }
              </p>
              {!searchTerm && !categoryFilter && (
                <Link href="/admin/products/new">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="text-sm text-gray-600 text-center">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Image Modal - Shows full-size product images with navigation */}
      {/* WHY: Users need a way to view product images in detail and browse galleries */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Product Images</DialogTitle>
          </DialogHeader>
          
          {selectedImages.length > 0 && (
            <div className="relative">
              {/* Main Image Display */}
              {/* WHY: Shows the currently selected image at full size */}
              <div className="relative aspect-square md:aspect-video bg-gray-100">
                <img
                  src={selectedImages[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Arrows - Only show if multiple images */}
                {/* WHY: Users need navigation controls to browse through images */}
                {selectedImages.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={previousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    
                    {/* Next Button */}
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {/* WHY: Shows which image user is viewing (e.g., "2 of 5") */}
                {selectedImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded">
                    {currentImageIndex + 1} / {selectedImages.length}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Navigation - Shows all images as thumbnails */}
              {/* WHY: Users can quickly jump to any image by clicking thumbnails */}
              {selectedImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
                  {selectedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-blue-600 ring-2 ring-blue-300' 
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

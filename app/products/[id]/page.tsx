'use client'

// ============================================================================
// PRODUCT DETAIL PAGE - Individual product view page
// ============================================================================
// WHY: This page displays detailed information about a single product
// Customers can view all product details, images, specifications, and add to cart
// This page is accessed via /products/[id] where [id] is the product ID

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/Navigation'
import { ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight, Package, DollarSign, Tag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'

// Product interface - defines the structure of product data from the API
// WHY: TypeScript needs to know what properties each product has
// This matches the Product type returned by the /api/products/[id] endpoint
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

export default function ProductDetailPage() {
  // ============================================================================
  // CART CONTEXT - Access cart functionality
  // ============================================================================
  
  // useCart hook - access cart context to add items to cart
  // WHY: We need to add products to cart when user clicks "Add to Cart" button
  // This gives us access to addToCart function and cart state
  const { addToCart } = useCart()
  
  // ============================================================================
  // ROUTING & PARAMS - Get product ID from URL
  // ============================================================================
  
  // useParams hook - extracts dynamic route parameters from the URL
  // WHY: The URL is /products/[id], so we need to get the [id] value
  // Example: /products/abc123 → params.id = "abc123"
  const params = useParams()
  const router = useRouter()
  
  // Extract product ID from URL parameters
  // WHY: We need the product ID to fetch the specific product from the API
  const productId = params?.id as string | undefined

  // ============================================================================
  // STATE MANAGEMENT - Track product data, loading, errors, and UI state
  // ============================================================================
  
  // Product state - stores the fetched product data
  // WHY: We need to store the product in component state so we can display it
  const [product, setProduct] = useState<Product | null>(null)
  
  // Loading state - tracks whether product data is currently being fetched
  // WHY: Shows loading spinner while fetching product from API
  const [loading, setLoading] = useState(true)
  
  // Error state - stores any error message if product fetch fails
  // WHY: We need to display helpful error messages if product not found or fetch fails
  const [error, setError] = useState<string | null>(null)
  
  // Current image index - tracks which product image is currently displayed
  // WHY: Products can have multiple images, so we need to track which one to show
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // ============================================================================
  // DATA FETCHING - Load product data from API
  // ============================================================================
  
  // Fetch product details from the API endpoint
  // WHY: We need to get the product data from the backend to display on the page
  const fetchProduct = async () => {
    // Check if we have a valid product ID
    // WHY: We can't fetch a product without an ID
    if (!productId) {
      setError('Invalid product ID')
      setLoading(false)
      return
    }

    try {
      // Reset error state before making new request
      // WHY: Previous errors should be cleared when fetching new data
      setError(null)
      setLoading(true)

      // Make GET request to /api/products/[id] endpoint
      // WHY: The API route returns the specific product data for the given ID
      const response = await fetch(`/api/products/${productId}`)
      
      // Parse JSON response
      // WHY: The API returns JSON with { success: boolean, data: Product }
      const data = await response.json()
      
      // Check if request was successful
      // WHY: The API returns { success: true } when product is found
      if (data.success && data.data) {
        // Update product state with fetched data
        // WHY: Store product so it can be displayed in the UI
        setProduct(data.data)
        
        // Reset image index to first image when new product loads
        // WHY: Always show the first image when viewing a new product
        setCurrentImageIndex(0)
      } else {
        // Handle API error response (e.g., product not found)
        // WHY: If API returns success: false, display error message
        setError(data.error || 'Product not found')
      }
    } catch (error) {
      // Handle network errors or other exceptions
      // WHY: Network issues, server errors, or JSON parsing errors need to be caught
      console.error('Error fetching product:', error)
      setError('Failed to load product. Please try again later.')
    } finally {
      // Always set loading to false when done (success or error)
      // WHY: Loading spinner should disappear whether fetch succeeded or failed
      setLoading(false)
    }
  }

  // useEffect hook - runs when component mounts or productId changes
  // WHY: We need to fetch product data when the page loads or when the product ID changes
  useEffect(() => {
    // Only fetch if we have a productId
    // WHY: Don't make API request if productId is missing
    if (productId) {
      fetchProduct()
    }
  }, [productId]) // Re-fetch if productId changes (e.g., user navigates to different product)

  // ============================================================================
  // IMAGE GALLERY CONTROLS - Navigate between product images
  // ============================================================================
  
  // Go to previous image in the gallery
  // WHY: Users should be able to browse through multiple product images
  const handlePreviousImage = () => {
    // Check if product has images
    // WHY: Can't navigate images if there are none
    if (!product || !product.images || product.images.length === 0) return
    
    // Calculate previous index, wrapping to last image if at beginning
    // WHY: Circular navigation - after first image, go to last image
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  // Go to next image in the gallery
  // WHY: Users should be able to browse through multiple product images
  const handleNextImage = () => {
    // Check if product has images
    if (!product || !product.images || product.images.length === 0) return
    
    // Calculate next index, wrapping to first image if at end
    // WHY: Circular navigation - after last image, go to first image
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  // ============================================================================
  // EVENT HANDLERS - Handle user interactions
  // ============================================================================
  
  // Handle "Add to Cart" button click
  // WHY: When users click "Add to Cart", we need to add the product to their cart
  const handleAddToCart = () => {
    // Check if product exists
    // WHY: Can't add to cart if product data is missing
    if (!product) return
    
    // Check if product is in stock
    // WHY: Can't add out-of-stock products to cart
    if (product.stock === 0) {
      toast.error('This product is out of stock')
      return
    }
    
    // Add product to cart using cart context
    // WHY: Use the addToCart function from CartContext to manage cart state
    // Pass product data: id, name, price, images array, and stock
    // Quantity defaults to 1 (user adds one item at a time)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images || [], // Pass images array or empty array if none
      stock: product.stock,
    }, 1) // Add quantity of 1
    
    // Show success notification
    // WHY: Users need feedback that the item was successfully added
    // toast.success displays a nice notification at the top-right of the screen
    // Shorter notification - just product name, no description, 2 second duration
    toast.success(`Added to cart!`, {
      duration: 2000, // Notification disappears after 2 seconds
    })
  }

  // ============================================================================
  // LOADING STATE - Show spinner while data is being fetched
  // ============================================================================
  
  // Display loading spinner while fetching product
  // WHY: Users need visual feedback that the page is loading data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation bar */}
        <Navigation />
        
        {/* Loading spinner */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            {/* Spinning loader animation */}
            {/* WHY: Visual feedback that data is loading */}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================================
  // ERROR STATE - Show error message if product not found or fetch failed
  // ============================================================================
  
  // Display error message if product fetch failed or product not found
  // WHY: Users need to know when something went wrong and how to fix it
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation bar */}
        <Navigation />
        
        {/* Error message */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center py-16">
            <CardContent>
              <div className="text-gray-500">
                {/* Error icon */}
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {error || 'Product Not Found'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {error === 'Product not found' || error === 'Invalid product ID'
                    ? 'The product you are looking for does not exist or has been removed.'
                    : 'We encountered an error while loading this product. Please try again later.'}
                </p>
                
                {/* Navigation buttons */}
                <div className="flex gap-4 justify-center">
                  {/* Back to products button */}
                  {/* WHY: Users should be able to go back to browse other products */}
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Go Back</span>
                  </Button>
                  
                  {/* View all products button */}
                  {/* WHY: Users should be able to browse all available products */}
                  <Button asChild>
                    <Link href="/products" className="flex items-center space-x-2">
                      <span>View All Products</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ============================================================================
  // MAIN RENDER - Display product details page
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar - appears on all pages */}
      <Navigation />

      {/* Back to Products Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Back button - navigates to products list */}
        {/* WHY: Users should be able to easily return to the products list */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Button>
      </div>

      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ==================================================================== */}
          {/* LEFT COLUMN - Product Images */}
          {/* ==================================================================== */}
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Main Product Image */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {/* Check if product has images */}
                {product.images && product.images.length > 0 ? (
                  <>
                    {/* Display current image based on currentImageIndex */}
                    {/* WHY: Show the selected image from the gallery */}
                    <img
                      src={product.images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Image Navigation Arrows - only show if multiple images */}
                    {/* WHY: Users need controls to navigate between multiple images */}
                    {product.images.length > 1 && (
                      <>
                        {/* Previous Image Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                          onClick={handlePreviousImage}
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        
                        {/* Next Image Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                          onClick={handleNextImage}
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                    
                    {/* Image Counter - shows which image is displayed */}
                    {/* WHY: Users should know how many images there are and which one they're viewing */}
                    {product.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                        {currentImageIndex + 1} / {product.images.length}
                      </div>
                    )}
                  </>
                ) : (
                  /* Placeholder if no image */
                  /* WHY: Show something even if product has no images */
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-lg">No Image Available</span>
                  </div>
                )}
                
                {/* Stock Badge - Shows if product is out of stock */}
                {/* WHY: Users need to know immediately if product is unavailable */}
                {product.stock === 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
                    Out of Stock
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery - show all product images as thumbnails */}
              {/* WHY: Users should be able to quickly select which image to view */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50">
                  {/* Map through all images to create thumbnails */}
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      // Highlight current image with border
                      // WHY: Visual feedback showing which image is currently displayed
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ==================================================================== */}
          {/* RIGHT COLUMN - Product Information */}
          {/* ==================================================================== */}
          
          <div className="space-y-6">
            {/* Product Title and Category */}
            <div>
              {/* Product Name */}
              {/* WHY: Display the product name prominently */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              
              {/* Category Badge */}
              {/* WHY: Users should know which category the product belongs to */}
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Tag className="h-3 w-3 mr-1" />
                {product.category}
              </Badge>
            </div>

            {/* Price Section */}
            {/* WHY: Price is critical information that should be prominent */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-baseline space-x-2">
                  {/* Dollar sign icon */}
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  {/* Product Price - formatted to 2 decimal places */}
                  {/* WHY: Currency should always show 2 decimal places (e.g., $19.99) */}
                  <span className="text-4xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Stock Information */}
            {/* WHY: Users need to know availability before adding to cart */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  {/* Package icon */}
                  <Package className="h-5 w-5 text-gray-600" />
                  <div>
                    {/* Stock status message */}
                    {/* WHY: Clear messaging about product availability */}
                    {product.stock === 0 ? (
                      <span className="text-red-600 font-semibold">Out of Stock</span>
                    ) : product.stock < 10 ? (
                      <span className="text-orange-600 font-semibold">
                        Only {product.stock} left in stock!
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">In Stock</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Description */}
            {/* WHY: Detailed description helps users make informed purchase decisions */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Display full description (no truncation) */}
                {/* WHY: Detail page should show complete information */}
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {/* WHY: Primary call-to-action should be prominent */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Add to Cart Button */}
              {/* WHY: Main action users want to take - add product to cart */}
              <Button
                size="lg"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


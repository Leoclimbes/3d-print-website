'use client'

// ============================================================================
// PRODUCTS PAGE - Customer-facing product listing page
// ============================================================================
// WHY: This page displays all available products to customers browsing the store
// It includes search, filtering, and product cards with images and prices
// Customers can browse products, filter by category, and add items to cart

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Navigation from '@/components/Navigation'
import { Search, ShoppingCart, Star, Filter, Grid, List } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'

// Product interface - defines the structure of product data from the API
// WHY: TypeScript needs to know what properties each product has
// This matches the Product type from the backend
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

// Category interface - defines the structure of category data
// WHY: TypeScript needs type information for categories used in filtering
interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export default function ProductsPage() {
  // ============================================================================
  // CART CONTEXT - Access cart functionality
  // ============================================================================
  
  // useCart hook - access cart context to add items to cart
  // WHY: We need to add products to cart when user clicks "Add to Cart" button
  // This gives us access to addToCart function and cart state
  const { addToCart } = useCart()
  
  // ============================================================================
  // STATE MANAGEMENT - Track products, loading, filters, and UI preferences
  // ============================================================================
  
  // Products array - stores all products fetched from the API
  // WHY: We need to store products in component state so we can display and filter them
  const [products, setProducts] = useState<Product[]>([])
  
  // Loading state - tracks whether data is currently being fetched
  // WHY: Shows loading spinner while fetching products from API
  const [loading, setLoading] = useState(true)
  
  // Search term - stores the text entered in the search input
  // WHY: Users can search for products by name or description
  const [searchTerm, setSearchTerm] = useState('')
  
  // Category filter - stores the selected category (or "all" for no filter)
  // WHY: Users can filter products to show only items in a specific category
  // "all" is used because Radix UI Select requires non-empty values
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  // Categories array - stores available categories for the filter dropdown
  // WHY: The filter dropdown needs a list of all available categories
  const [categories, setCategories] = useState<Category[]>([])
  
  // View mode - "grid" or "list" for displaying products
  // WHY: Some users prefer grid view (cards), others prefer list view (more compact)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // ============================================================================
  // DATA FETCHING - Load products and categories from API
  // ============================================================================
  
  // Fetch products from the API endpoint
  // WHY: We need to get product data from the backend to display on the page
  const fetchProducts = async () => {
    try {
      // Make GET request to /api/products endpoint
      // WHY: The API route returns all products (with optional filtering via query params)
      const response = await fetch('/api/products')
      
      // Parse JSON response
      // WHY: The API returns JSON with { success: boolean, data: Product[] }
      const data = await response.json()
      
      // Check if request was successful
      // WHY: The API returns { success: true } when data is retrieved successfully
      if (data.success) {
        // Update products state with fetched data
        // WHY: Store products so they can be displayed and filtered
        setProducts(data.data)
      } else {
        // Handle API error response
        // WHY: If API returns success: false, log the error for debugging
        console.error('Failed to fetch products:', data.error)
      }
    } catch (error) {
      // Handle network errors or other exceptions
      // WHY: Network issues, server errors, or JSON parsing errors need to be caught
      console.error('Error fetching products:', error)
    } finally {
      // Always set loading to false when done (success or error)
      // WHY: Loading spinner should disappear whether fetch succeeded or failed
      setLoading(false)
    }
  }

  // Fetch categories from the API endpoint
  // WHY: We need categories to populate the filter dropdown
  const fetchCategories = async () => {
    try {
      // Make GET request to /api/categories endpoint
      // WHY: The API returns all available categories
      const response = await fetch('/api/categories')
      
      // Parse JSON response
      const data = await response.json()
      
      if (data.success) {
        // Update categories state with fetched data
        setCategories(data.data)
      }
    } catch (error) {
      // Log error but don't break the page if categories fail to load
      // WHY: Products can still be displayed even if category filter doesn't work
      console.error('Error fetching categories:', error)
    }
  }

  // useEffect hook - runs when component mounts (on page load)
  // WHY: We need to fetch data when the page first loads
  useEffect(() => {
    fetchProducts() // Load products
    fetchCategories() // Load categories for filtering
  }, []) // Empty dependency array means this runs once on mount

  // ============================================================================
  // FILTERING LOGIC - Filter products based on search term and category
  // ============================================================================
  
  // Filter products based on search term and category selection
  // WHY: Users expect to see only products that match their search and filter criteria
  const filteredProducts = products.filter(product => {
    // Search filter - check if search term matches product name or description
    // WHY: Users should be able to find products by searching for keywords
    const matchesSearch = 
      // Check if product name contains search term (case-insensitive)
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Check if product description contains search term (case-insensitive)
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Category filter - check if product matches selected category
    // WHY: Users should be able to browse products by category (e.g., "Gaming", "Office")
    const matchesCategory = 
      // "all" means no filter - show all categories
      categoryFilter === 'all' ||
      // Check if product category matches selected category (case-insensitive)
      product.category.toLowerCase() === categoryFilter.toLowerCase()
    
    // Product must match BOTH search AND category filters
    // WHY: Both filters should work together (e.g., search "phone" in "Accessories" category)
    return matchesSearch && matchesCategory
  })

  // ============================================================================
  // EVENT HANDLERS - Handle user interactions
  // ============================================================================
  
  // Handle "Add to Cart" button click
  // WHY: When users click "Add to Cart", we need to add the product to their cart
  const handleAddToCart = (product: Product) => {
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
    // Shorter notification - just simple message, no description, 2 second duration
    toast.success(`Added to cart!`, {
      duration: 2000, // Notification disappears after 2 seconds
    })
  }

  // ============================================================================
  // LOADING STATE - Show spinner while data is being fetched
  // ============================================================================
  
  // Display loading spinner while fetching products
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
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================================
  // MAIN RENDER - Display products page with filters and product grid
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar - appears on all pages */}
      <Navigation />

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Our Products
          </h1>
          <p className="text-lg text-gray-600">
            Browse our collection of custom 3D printed items
          </p>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                {/* Search icon - positioned absolutely inside input */}
                {/* WHY: Visual indicator that this is a search field */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                
                {/* Search input - filters products by name/description */}
                {/* WHY: Users should be able to search for specific products */}
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter Dropdown */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  {/* "All categories" option - shows all products */}
                  {/* WHY: Users should be able to clear the category filter */}
                  <SelectItem value="all">All categories</SelectItem>
                  
                  {/* Map through categories to create filter options */}
                  {/* WHY: Each category becomes a selectable filter option */}
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode Toggle - Grid or List */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                {/* Grid View Button */}
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center space-x-1"
                >
                  <Grid className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
                {/* List View Button */}
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex items-center space-x-1"
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Check if any products match filters */}
        {filteredProducts.length === 0 ? (
          /* Empty State - No products found */
          <Card className="text-center py-16">
            <CardContent>
              <div className="text-gray-500">
                {/* Empty state icon */}
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || categoryFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'No products available at the moment'}
                </p>
                {/* Clear filters button */}
                {(searchTerm || categoryFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setCategoryFilter('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Products Grid or List */
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {filteredProducts.map((product) => (
              /* Product Card - Displays product information */
              <Card
                key={product.id}
                className={
                  viewMode === 'grid'
                    ? 'overflow-hidden hover:shadow-lg transition-shadow'
                    : 'hover:shadow-lg transition-shadow'
                }
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.images && product.images.length > 0 && product.images[0] ? (
                    /* Display first product image */
                    /* WHY: Products need visual representation to attract customers */
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    /* Placeholder if no image */
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                  
                  {/* Stock Badge - Shows if product is out of stock */}
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                  
                  {/* Category Badge - Shows product category */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-white/90">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                {/* Product Information */}
                <CardHeader>
                  {/* Product Name */}
                  <CardTitle className="text-lg line-clamp-2">
                    {product.name}
                  </CardTitle>
                  
                  {/* Product Description */}
                  <CardDescription className="line-clamp-2 mt-1">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Price and Stock Info */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Product Price */}
                    <span className="text-2xl font-bold text-green-600">
                      ${product.price.toFixed(2)}
                    </span>
                    
                    {/* Stock Indicator */}
                    {product.stock > 0 && product.stock < 10 && (
                      <span className="text-xs text-orange-600">
                        Only {product.stock} left!
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {/* View Details Button - Link to product detail page */}
                    {/* WHY: Users should be able to see more information about a product */}
                    <Button
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/products/${product.id}`}>
                        View Details
                      </Link>
                    </Button>
                    
                    {/* Add to Cart Button */}
                    {/* WHY: Users need a way to add products to their cart */}
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


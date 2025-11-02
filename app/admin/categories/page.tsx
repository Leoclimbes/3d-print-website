'use client'

// ============================================================================
// ADMIN CATEGORIES MANAGEMENT PAGE
// ============================================================================
// WHY: This page allows admins to manage product categories - create, read,
// update, and delete categories. This helps organize products into logical
// groups for better navigation and organization.

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, X } from 'lucide-react'

// Category interface - defines the structure of a category object
// WHY: TypeScript interfaces help catch errors early and provide autocomplete
interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  createdAt: string
  updatedAt: string
}

export default function CategoriesPage() {
  // State management - tracks all the data and UI state for this page
  // WHY: React useState hooks manage component state that can change over time
  
  // Categories list - stores all categories fetched from the API
  const [categories, setCategories] = useState<Category[]>([])
  
  // Loading state - shows a loading spinner while fetching data
  // WHY: Users need visual feedback that data is being loaded
  const [loading, setLoading] = useState(true)
  
  // Search term - filters categories by name or description
  // WHY: When there are many categories, search helps find specific ones quickly
  const [searchTerm, setSearchTerm] = useState('')
  
  // Dialog state - controls whether the create/edit dialog is open
  // WHY: Dialogs are used to create/edit categories without navigating to a new page
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Editing mode - true when editing an existing category, false when creating new
  // WHY: The same dialog is reused for both creating and editing, so we need to track the mode
  const [isEditing, setIsEditing] = useState(false)
  
  // Current category - the category being edited (null when creating new)
  // WHY: We need to track which category is being edited to pre-fill the form
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  
  // Form fields - track the input values in the create/edit form
  // WHY: These controlled inputs allow us to update the form state reactively
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  })

  // Fetch categories from the API
  // WHY: We need to load all categories from the server to display them
  const fetchCategories = async () => {
    try {
      // Make GET request to the categories API endpoint
      // WHY: GET requests are used to retrieve data from the server
      const response = await fetch('/api/categories')
      const data = await response.json()
      
      // Check if the API call was successful
      // WHY: APIs return success flags to indicate if the operation succeeded
      if (data.success) {
        // Update the categories state with the fetched data
        // WHY: State updates trigger React to re-render the component with new data
        setCategories(data.data)
      } else {
        // Show error if API call failed
        // WHY: Users need to know when something goes wrong
        console.error('Failed to fetch categories:', data.error)
        alert(`Error: ${data.error || 'Failed to fetch categories'}`)
      }
    } catch (error) {
      // Handle network errors or other exceptions
      // WHY: Network requests can fail due to various reasons (offline, server down, etc.)
      console.error('Error fetching categories:', error)
      alert('Failed to fetch categories. Please check your connection and try again.')
    } finally {
      // Always set loading to false after the request completes
      // WHY: We want to hide the loading spinner whether the request succeeded or failed
      setLoading(false)
    }
  }

  // Generate slug from category name
  // WHY: Slugs are URL-friendly versions of names (e.g., "My Category" -> "my-category")
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading/trailing spaces
      .replace(/[^\w\s-]/g, '') // Remove special characters (except spaces and hyphens)
      .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  // Open dialog for creating a new category
  // WHY: This function resets the form and opens the dialog in "create" mode
  const openCreateDialog = () => {
    setIsEditing(false) // We're creating, not editing
    setCurrentCategory(null) // No category to edit
    setFormData({ // Reset form to empty values
      name: '',
      slug: '',
      description: '',
      image: ''
    })
    setIsDialogOpen(true) // Show the dialog
  }

  // Open dialog for editing an existing category
  // WHY: This function pre-fills the form with the category's current data
  const openEditDialog = (category: Category) => {
    setIsEditing(true) // We're editing, not creating
    setCurrentCategory(category) // Store the category being edited
    setFormData({ // Pre-fill form with category data
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || ''
    })
    setIsDialogOpen(true) // Show the dialog
  }

  // Handle form input changes
  // WHY: When user types in form fields, we need to update the state
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Auto-generate slug from name when name changes
      // WHY: Slugs should match the name, so we auto-update it unless user manually changed it
      if (field === 'name') {
        // Only auto-generate if slug is empty or matches the old name's slug
        // WHY: We don't want to overwrite a manually entered slug
        const oldSlug = generateSlug(prev.name)
        if (!prev.slug || prev.slug === oldSlug) {
          newData.slug = generateSlug(value)
        }
      }
      
      return newData
    })
  }

  // Save category (create or update)
  // WHY: This function handles both creating new categories and updating existing ones
  const handleSave = async () => {
    // Validate required fields
    // WHY: We need to ensure required data is provided before submitting
    if (!formData.name || !formData.slug) {
      alert('Name and slug are required')
      return
    }

    try {
      let response
      
      if (isEditing && currentCategory) {
        // Update existing category
        // WHY: PUT requests are used to update existing resources
        response = await fetch('/api/categories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json' // Tell server we're sending JSON
          },
          body: JSON.stringify({ // Convert JavaScript object to JSON string
            id: currentCategory.id,
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            image: formData.image
          })
        })
      } else {
        // Create new category
        // WHY: POST requests are used to create new resources
        response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            image: formData.image
          })
        })
      }

      const data = await response.json()

      if (response.ok && data.success) {
        // Success! Refresh the categories list
        // WHY: After creating/updating, we need to fetch the latest data
        await fetchCategories()
        setIsDialogOpen(false) // Close the dialog
        // Reset form
        setFormData({
          name: '',
          slug: '',
          description: '',
          image: ''
        })
      } else {
        // Handle error response from server
        // WHY: The server might return validation errors or other issues
        const errorMessage = data.error || 'Failed to save category'
        alert(`Error: ${errorMessage}`)
      }
    } catch (error) {
      // Handle network errors or other exceptions
      // WHY: Network requests can fail for various reasons
      console.error('Error saving category:', error)
      alert('Failed to save category. Please check your connection and try again.')
    }
  }

  // Delete category handler
  // WHY: This function handles category deletion when admin clicks delete button
  const handleDelete = async (categoryId: string, categoryName: string) => {
    // Show confirmation dialog before deleting
    // WHY: Deleting is destructive, so we want to confirm before proceeding
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
      return // User cancelled, don't delete
    }

    try {
      // Send DELETE request with category ID as query parameter
      // WHY: DELETE requests typically send the ID in the URL (e.g., /api/categories?id=123)
      const response = await fetch(`/api/categories?id=${categoryId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Success! Refresh the categories list
        // WHY: After deletion, we need to fetch the latest data to remove the deleted category from the UI
        await fetchCategories()
      } else {
        // Handle error response from server
        // WHY: The server might return errors (e.g., category not found, unauthorized)
        const errorMessage = data.error || 'Failed to delete category'
        alert(`Error: ${errorMessage}`)
      }
    } catch (error) {
      // Handle network errors or other exceptions
      // WHY: Network requests can fail for various reasons
      console.error('Error deleting category:', error)
      alert('Failed to delete category. Please check your connection and try again.')
    }
  }

  // useEffect hook - runs when component mounts or dependencies change
  // WHY: We need to fetch categories when the page first loads
  useEffect(() => {
    fetchCategories()
  }, []) // Empty array means this only runs once when component mounts

  // Filter categories based on search term
  // WHY: When there are many categories, search helps find specific ones quickly
  const filteredCategories = categories.filter(category => {
    // Search in name, slug, and description
    // WHY: Users might search for categories by any of these fields
    const searchLower = searchTerm.toLowerCase()
    return (
      category.name.toLowerCase().includes(searchLower) ||
      category.slug.toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower)
    )
  })

  // Show loading spinner while fetching data
  // WHY: Users need visual feedback that data is being loaded
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section - Title and Add Button */}
      {/* WHY: Clear page title and prominent action button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage your product categories</p>
        </div>
        <Button 
          onClick={openCreateDialog}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search Filter Card */}
      {/* WHY: Search helps find categories when there are many */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories by name, slug, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      {/* WHY: Grid layout displays categories in an organized, scannable way */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="shadow-lg">
            <CardHeader>
              {/* Category Image */}
              {/* WHY: Visual representation helps identify categories quickly */}
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
              </div>
              
              {/* Category Name and Info */}
              {/* WHY: Display key category information prominently */}
              <div>
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription className="mt-1">
                  Slug: <code className="text-xs bg-gray-100 px-1 rounded">{category.slug}</code>
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Description */}
                {/* WHY: Description helps understand what the category is for */}
                {category.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                {/* Stats and Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-gray-500">
                    {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                  </span>
                  
                  {/* Action Buttons */}
                  {/* WHY: Edit and delete buttons allow quick category management */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {/* WHY: Show helpful message when no categories match the search */}
      {filteredCategories.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first category'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={openCreateDialog}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Category
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Footer */}
      {/* WHY: Show how many categories are displayed */}
      <div className="text-sm text-gray-600 text-center">
        Showing {filteredCategories.length} of {categories.length} categories
      </div>

      {/* Create/Edit Dialog */}
      {/* WHY: Dialog allows creating/editing categories without navigating away */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Category Name Input */}
            {/* WHY: Name is the primary identifier for a category */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Home Decor"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            {/* Category Slug Input */}
            {/* WHY: Slug is the URL-friendly version used in routes */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                placeholder="e.g., home-decor"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                URL-friendly version of the name (lowercase, hyphens only)
              </p>
            </div>

            {/* Category Description Textarea */}
            {/* WHY: Description helps explain what products belong in this category */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this category..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            {/* Category Image URL Input */}
            {/* WHY: Image URL allows setting a visual representation for the category */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                URL to an image representing this category
              </p>
            </div>
          </div>

          {/* Dialog Actions */}
          {/* WHY: Save and Cancel buttons complete the form */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isEditing ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


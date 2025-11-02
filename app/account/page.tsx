'use client'

// ============================================================================
// MY ACCOUNT PAGE - Allows users to view and edit their account information
// ============================================================================
// WHY: Users need a place to manage their profile, change their password,
// and view account details like when they joined.

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/Navigation'
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Save, 
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

// Type definition for user data returned from API
// WHY: TypeScript types ensure we handle the data correctly and catch errors early
interface UserData {
  id: string
  email: string
  name: string
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

export default function AccountPage() {
  // Get current session to check if user is logged in
  // WHY: We need to verify the user is authenticated before showing account page
  // CRITICAL: We also get 'update' function to refresh session after profile changes
  // WHY: When user updates their name/email, we need to refresh NextAuth session
  // so Navigation and other components show the new name immediately
  const { data: session, status, update } = useSession()
  const router = useRouter()

  // State for user data fetched from API
  // WHY: React state stores the user's current information from the database
  const [userData, setUserData] = useState<UserData | null>(null)
  
  // State for loading indicators
  // WHY: We show loading states while fetching/updating data to provide user feedback
  const [loading, setLoading] = useState(true) // Loading initial data
  const [saving, setSaving] = useState(false) // Saving profile changes
  const [changingPassword, setChangingPassword] = useState(false) // Changing password
  
  // State for form fields - profile information
  // WHY: Form state tracks user input before submitting to the API
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  
  // State for password change form
  // WHY: Separate state for password fields since they're sensitive and need special handling
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // State for showing/hiding passwords
  // WHY: Users should be able to toggle password visibility to verify they typed correctly
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // State for success/error messages
  // WHY: Users need feedback on whether their actions succeeded or failed
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Fetch user data when component mounts
  // WHY: We need to load the user's current information from the API to display in the form
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Call the GET /api/user endpoint to fetch current user's data
        // WHY: The API handles authentication and returns the user's profile information
        const response = await fetch('/api/user')
        const result = await response.json()

        // Check if API call was successful
        if (result.success && result.data) {
          // Set user data and form fields
          // WHY: We populate the form with existing data so users can see and edit their info
          setUserData(result.data)
          setName(result.data.name)
          setEmail(result.data.email)
        } else {
          // Handle error - user might not be found or unauthorized
          // WHY: Gracefully handle errors and redirect if needed
          setProfileMessage({ type: 'error', text: result.error || 'Failed to load account information' })
        }
      } catch (error) {
        // Handle network or unexpected errors
        // WHY: Network issues or server errors need to be caught and displayed
        console.error('Error fetching user data:', error)
        setProfileMessage({ type: 'error', text: 'Failed to load account information' })
      } finally {
        // Always stop loading indicator
        // WHY: Whether successful or not, we're done loading
        setLoading(false)
      }
    }

    // Only fetch if session is loaded (not loading)
    // WHY: We need to wait for NextAuth to finish checking authentication status
    if (status === 'authenticated') {
      fetchUserData()
    } else if (status === 'unauthenticated') {
      // If user is not logged in, redirect to login page
      // WHY: Account page should only be accessible to logged-in users
      router.push('/login')
    }
  }, [status, router])

  // Handle saving profile changes (name and email)
  // WHY: Users should be able to update their name and email address
  const handleSaveProfile = async () => {
    // Validate that at least one field has changed
    // WHY: No need to make API call if nothing changed
    if (name === userData?.name && email === userData?.email) {
      setProfileMessage({ type: 'error', text: 'No changes to save' })
      return
    }

    // Validate email format (basic client-side check)
    // WHY: Catch obvious errors before sending to server
    if (email && !email.includes('@')) {
      setProfileMessage({ type: 'error', text: 'Please enter a valid email address' })
      return
    }

    setSaving(true)
    setProfileMessage(null)

    try {
      // Call PUT /api/user endpoint to update profile
      // WHY: The API validates data and updates the database
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Update local state with new data from API response
        // WHY: Keep UI in sync with database after successful update
        setUserData(result.data)
        
        // CRITICAL FIX: Update form fields to match the saved data
        // WHY: The input fields are controlled by 'name' and 'email' state variables,
        // not 'userData'. Without updating these, the form shows old values even though
        // the data was saved successfully to the database.
        setName(result.data.name)
        setEmail(result.data.email)
        
        // CRITICAL FIX: Refresh NextAuth session to update everywhere in the website
        // WHY: NextAuth stores user data (name, email) in the JWT token and session.
        // Navigation, admin layout, and other components read session.user.name.
        // Without refreshing the session, they'll show the old name even though
        // the database was updated. Calling update() triggers the JWT callback
        // with trigger='update', which fetches fresh data from the database.
        await update()
        
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' })
        
        // Clear message after 3 seconds
        // WHY: Success messages should auto-dismiss so they don't clutter the UI
        setTimeout(() => setProfileMessage(null), 3000)
      } else {
        // Display error message from API
        // WHY: API returns specific error messages (e.g., "Email already in use")
        setProfileMessage({ type: 'error', text: result.error || 'Failed to update profile' })
      }
    } catch (error) {
      // Handle network errors
      // WHY: Network issues need to be caught and displayed
      console.error('Error updating profile:', error)
      setProfileMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      // Always stop saving indicator
      // WHY: Whether successful or not, we're done saving
      setSaving(false)
    }
  }

  // Handle changing password
  // WHY: Users need to be able to change their password for security reasons
  const handleChangePassword = async () => {
    // Validate that new password matches confirmation
    // WHY: Prevent typos - if passwords don't match, user probably made a mistake
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    // Validate password length (basic check - API does full validation)
    // WHY: Catch obvious errors before sending to server
    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }

    setChangingPassword(true)
    setPasswordMessage(null)

    try {
      // Call POST /api/user endpoint to change password
      // WHY: The API verifies current password and updates with new hashed password
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Clear password fields after successful change
        // WHY: Security - don't leave passwords in form fields
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' })
        
        // Clear message after 3 seconds
        setTimeout(() => setPasswordMessage(null), 3000)
      } else {
        // Display error message from API
        // WHY: API returns specific errors (e.g., "Current password is incorrect")
        setPasswordMessage({ type: 'error', text: result.error || 'Failed to change password' })
      }
    } catch (error) {
      // Handle network errors
      console.error('Error changing password:', error)
      setPasswordMessage({ type: 'error', text: 'Failed to change password' })
    } finally {
      // Always stop changing password indicator
      setChangingPassword(false)
    }
  }

  // Format date for display
  // WHY: Convert ISO date strings to user-friendly format (e.g., "January 15, 2024")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Show loading state while checking authentication or fetching data
  // WHY: Better UX - show loading indicator instead of blank page
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (redirect will happen)
  // WHY: Prevent flash of content before redirect
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar - consistent across all pages */}
      <Navigation />

      {/* Main content area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your account information and security settings</p>
        </div>

        {/* Profile Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription>
              Update your name and email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Success/Error message display */}
            {/* WHY: Users need feedback on whether their actions succeeded */}
            {profileMessage && (
              <div
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  profileMessage.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {profileMessage.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="text-sm font-medium">{profileMessage.text}</span>
              </div>
            )}

            {/* Name input field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                disabled={saving}
              />
            </div>

            {/* Email input field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                disabled={saving}
              />
            </div>

            {/* Save button */}
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Details Card - Shows read-only information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Account Details</span>
            </CardTitle>
            <CardDescription>
              Your account information and membership status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User ID - usually not shown to users, but included for transparency */}
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium text-gray-600">User ID</span>
              <span className="text-sm text-gray-900 font-mono">{userData?.id || 'Loading...'}</span>
            </div>

            {/* Account Role - shows if user is customer or admin */}
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium text-gray-600">Account Type</span>
              <Badge variant={userData?.role === 'admin' ? 'default' : 'secondary'}>
                {userData?.role === 'admin' ? 'Administrator' : 'Customer'}
              </Badge>
            </div>

            {/* Account creation date */}
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Member Since</span>
              </span>
              <span className="text-sm text-gray-900">
                {userData?.created_at ? formatDate(userData.created_at) : 'Loading...'}
              </span>
            </div>

            {/* Last updated date */}
            {userData?.updated_at && userData.updated_at !== userData.created_at && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">
                  {formatDate(userData.updated_at)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Change Password</span>
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Success/Error message display */}
            {passwordMessage && (
              <div
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {passwordMessage.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="text-sm font-medium">{passwordMessage.text}</span>
              </div>
            )}

            {/* Current password input */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  disabled={changingPassword}
                  className="pr-10"
                />
                {/* Toggle password visibility button */}
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={changingPassword}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New password input */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  disabled={changingPassword}
                  className="pr-10"
                />
                {/* Toggle password visibility button */}
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={changingPassword}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* Password requirements hint */}
              <p className="text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            {/* Confirm new password input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  disabled={changingPassword}
                  className="pr-10"
                />
                {/* Toggle password visibility button */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={changingPassword}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Change password button */}
            <Button
              onClick={handleChangePassword}
              disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="w-full sm:w-auto"
            >
              {changingPassword ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Changing Password...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

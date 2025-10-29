'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Lock, User, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSetupPassword: '', // Special password for admin setup
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Password strength requirements
  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'Contains number', met: /[0-9]/.test(formData.password) },
    { text: 'Contains special character', met: /[^a-zA-Z0-9]/.test(formData.password) },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!passwordRequirements.every(req => req.met)) {
      newErrors.password = 'Password does not meet all requirements'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Admin setup password validation
    if (!formData.adminSetupPassword) {
      newErrors.adminSetupPassword = 'Admin setup password is required'
    } else if (formData.adminSetupPassword !== 'AdminSetup2025!') {
      newErrors.adminSetupPassword = 'Please use: AdminSetup2025!'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          adminSetupPassword: formData.adminSetupPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin account')
      }

      toast.success('Admin account created successfully!')
      
      // Redirect to login page
      router.push('/login?message=admin-created')

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create admin account')
      console.error('Admin creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Account Setup</CardTitle>
            <CardDescription>
              Create the first admin account for your 3D Print Shop
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Admin Setup Password */}
              <div className="space-y-2">
                <Label htmlFor="adminSetupPassword" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Admin Setup Password</span>
                </Label>
                <Input
                  id="adminSetupPassword"
                  name="adminSetupPassword"
                  type="password"
                  value={formData.adminSetupPassword}
                  onChange={handleInputChange}
                  placeholder="Enter admin setup password"
                  className={errors.adminSetupPassword ? 'border-red-500' : ''}
                />
                {errors.adminSetupPassword && (
                  <p className="text-sm text-red-600">{errors.adminSetupPassword}</p>
                )}
                <p className="text-xs text-gray-500">
                  Admin setup password: <code className="bg-gray-100 px-1 rounded">AdminSetup2025!</code>
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Full Name</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@yourcompany.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">Password Requirements:</p>
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        {req.met ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-gray-400" />
                        )}
                        <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Security Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Notice:</strong> This admin account will have full access to manage products, 
                  orders, and customer data. Keep your credentials secure.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full"
                size="lg"
              >
                {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/login')}
                className="text-sm"
              >
                ← Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

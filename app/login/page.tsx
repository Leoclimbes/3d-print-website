'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Lock, LogIn, Shield, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

// ============================================================================
// LOGIN CONTENT COMPONENT - Wrapped in Suspense for useSearchParams
// ============================================================================
// WHY: useSearchParams() requires Suspense boundary in Next.js 13+ App Router
// This component uses useSearchParams and is wrapped in Suspense to prevent build errors
function LoginContent() {
  const router = useRouter()
  // useSearchParams hook - reads query parameters from URL
  // WHY: We need to check for success messages from URL params (e.g., ?message=account-created)
  // NOTE: This must be wrapped in Suspense boundary for Next.js App Router
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [message, setMessage] = useState<string | null>(null)

  // Check for success messages from URL params
  // WHY: After account creation, we redirect to login with a success message
  useEffect(() => {
    const urlMessage = searchParams.get('message')
    if (urlMessage === 'account-created') {
      setMessage('Account created successfully! Please log in with your credentials.')
    } else if (urlMessage === 'admin-created') {
      setMessage('Admin account created successfully! Please log in with your admin credentials.')
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid email or password')
        return
      }

      if (result?.ok) {
        // Get the session to check user role
        const session = await getSession()
        
        if (session?.user?.role === 'admin') {
          toast.success('Welcome back, Admin!')
          router.push('/admin')
        } else {
          toast.success('Welcome back!')
          router.push('/')
        }
      }

    } catch (error) {
      toast.error('An error occurred during login')
      console.error('Login error:', error)
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
              <LogIn className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your 3D Print Shop account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Success Message */}
            {message && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Password</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full"
                size="lg"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Customer:</strong> demo@example.com / password123</p>
                <p><strong>Admin:</strong> admin@example.com / admin123</p>
              </div>
            </div>

            {/* Links */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  Create one here
                </Link>
              </p>
              
              <div className="flex flex-col space-y-2">
                <Link href="/admin-setup">
                  <Button variant="outline" size="sm" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Setup
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/')}
                  className="text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
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
// MAIN EXPORT - Wrapped in Suspense for useSearchParams
// ============================================================================
// WHY: useSearchParams() requires Suspense boundary in Next.js 13+ App Router
// This prevents build errors during static generation
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardContent className="pt-6">
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading login page...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
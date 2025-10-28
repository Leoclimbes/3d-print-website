import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'

// NextAuth configuration for authentication
// This handles both customer and admin login with role-based access
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check if Supabase is properly configured
          if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
            console.error('Supabase not configured - using demo mode')
            
            // Demo mode: Customer user
            if (credentials.email === 'demo@example.com' && credentials.password === 'password123') {
              return {
                id: 'demo-user-id',
                email: 'demo@example.com',
                name: 'Demo User',
                role: 'customer' as const,
              }
            }
            
            // Demo mode: Admin user
            if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
              return {
                id: 'demo-admin-id',
                email: 'admin@example.com',
                name: 'Admin User',
                role: 'admin' as const,
              }
            }
            
            return null
          }

          // Query user from database using admin client (has elevated permissions)
          const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (error || !user) {
            console.error('User not found:', error)
            return null
          }

          // Verify password using bcrypt
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash || '')

          if (!isPasswordValid) {
            console.error('Invalid password for user:', credentials.email)
            return null
          }

          // Return user object that will be available in session
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  
  // Session configuration
  session: {
    strategy: 'jwt', // Use JWT tokens instead of database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // JWT configuration
  callbacks: {
    async jwt({ token, user }) {
      // Add user role to JWT token
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    
    async session({ session, token }) {
      // Add role and id to session object
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as 'customer' | 'admin'
      }
      return session
    }
  },
  
  // Pages configuration
  pages: {
    signIn: '/login', // Custom login page
    // Note: NextAuth doesn't have a signUp page option
    // Registration is handled by our custom /register page
  },
  
  // Security configuration
  secret: process.env.NEXTAUTH_SECRET,
}

// Helper function to hash passwords during registration
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12 // Higher salt rounds = more secure but slower
  return await bcrypt.hash(password, saltRounds)
}

// Helper function to verify passwords
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Middleware helper to check if user is admin
export function isAdmin(session: any): boolean {
  return session?.user?.role === 'admin'
}

// Middleware helper to check if user is authenticated
export function isAuthenticated(session: any): boolean {
  return !!session?.user
}

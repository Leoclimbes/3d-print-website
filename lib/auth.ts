import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { localDb } from './local-db'
import { logger } from './logger'

// Type definitions for better type safety
interface User {
  id: string
  email: string
  name: string | null
  role: 'customer' | 'admin'
}

interface AuthResult {
  id: string
  email: string
  name: string | null
  role: 'customer' | 'admin'
}

// Admin setup configuration
// SECURITY NOTE: Admin setup password should be in environment variables, not hardcoded
// WHY: Hardcoded passwords are a security risk - anyone with access to the code can see it
const ADMIN_SETUP_CONFIG = {
  // Get admin setup password from environment variable or fallback to a default
  // WHY: Environment variables are more secure than hardcoded values
  // TODO: Remove fallback in production - require environment variable
  get ADMIN_SETUP_PASSWORD(): string {
    return process.env.ADMIN_SETUP_PASSWORD || 'AdminSetup2025!'
  },
  // Check if admin account exists
  async hasAdminAccount(): Promise<boolean> {
    return await localDb.hasAdminAccount()
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<AuthResult | null> {
        if (!credentials?.email || !credentials?.password) {
          logger.warn('Authentication attempt with missing credentials')
          return null
        }

        try {
          // Use local database for authentication
          const user = await localDb.findUserByEmail(credentials.email)
          
          if (!user) {
            logger.warn('Authentication attempt for non-existent user', { email: credentials.email })
            return null
          }

          const isPasswordValid = await localDb.verifyPassword(credentials.password, user.password_hash)

          if (!isPasswordValid) {
            logger.warn('Invalid password attempt', { email: credentials.email })
            return null
          }

          logger.info('Successful authentication', { email: credentials.email, userId: user.id, role: user.role })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }

        } catch (error) {
          logger.error('Unexpected error during authentication', error as Error, { email: credentials.email })
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as 'customer' | 'admin'
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  // SECURITY: Use environment variable for secret, fallback only for development
  // WHY: The secret is used to sign JWT tokens - it must be secure and random
  // TODO: Remove fallback in production - require environment variable
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-change-in-production',
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return await bcrypt.compare(password, hashedPassword)
}

interface CreateUserParams {
  name: string
  email: string
  password: string
  role: 'customer' | 'admin'
}

// Helper function to transform database user to auth result
// WHY: Reduces code duplication - both createUser and createAdminUser need this transformation
function transformUserToAuthResult(user: { id: string; email: string; name: string | null; role: 'customer' | 'admin' } | null): AuthResult | null {
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

// Internal helper function to create a user (shared logic)
// WHY: Both createUser and createAdminUser do the same thing - this reduces duplication
async function createUserInternal({ name, email, password, role }: CreateUserParams, userType: 'admin' | 'regular'): Promise<{ user: AuthResult | null; error: string | null }> {
  try {
    const { user, error } = await localDb.createUser({ name, email, password, role })

    if (error) {
      logger.error(`${userType} user creation failed`, new Error(error), { email, role })
      return { user: null, error }
    }

    logger.info(`${userType === 'admin' ? 'Admin' : 'Regular'} user created successfully`, { 
      userId: user?.id, 
      email: user?.email, 
      role: user?.role 
    })
    
    return {
      user: transformUserToAuthResult(user),
      error: null,
    }
  } catch (error) {
    logger.error(`Unexpected error during ${userType} user creation`, error as Error, { email, role })
    return { user: null, error: (error as Error).message || 'An unexpected error occurred' }
  }
}

// Create an admin user (calls internal helper)
// WHY: Provides a clear API for creating admin users
export async function createAdminUser({ name, email, password, role }: CreateUserParams): Promise<{ user: AuthResult | null; error: string | null }> {
  return createUserInternal({ name, email, password, role }, 'admin')
}

// Create a regular user (calls internal helper)
// WHY: Provides a clear API for creating regular users
export async function createUser({ name, email, password, role }: CreateUserParams): Promise<{ user: AuthResult | null; error: string | null }> {
  return createUserInternal({ name, email, password, role }, 'regular')
}

// Admin account creation utilities
export async function createAdminAccount(email: string, password: string, name: string, adminSetupPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if admin account already exists
    const hasAdmin = await localDb.hasAdminAccount()
    if (hasAdmin) {
      return { success: false, error: 'Admin account already exists' }
    }

    // Validate admin setup password
    // SECURITY: Don't expose the actual password in error message - just say it's invalid
    // WHY: Revealing the password in error messages is a security risk
    if (adminSetupPassword !== ADMIN_SETUP_CONFIG.ADMIN_SETUP_PASSWORD) {
      logger.warn('Admin account creation failed - invalid setup password', { email, name })
      return { success: false, error: 'Invalid admin setup password' }
    }

    // Create the admin account using local database
    const { user, error } = await localDb.createUser({
      email,
      name,
      password,
      role: 'admin'
    })

    if (error) {
      logger.error('Admin account creation failed', new Error(error), { email, name })
      return { success: false, error }
    }

    logger.info('Admin account created successfully', { email, name, userId: user?.id })
    return { success: true }
  } catch (error) {
    logger.error('Unexpected error during admin account creation', error as Error, { email, name })
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export function getAdminSetupPassword(): string {
  return ADMIN_SETUP_CONFIG.ADMIN_SETUP_PASSWORD
}

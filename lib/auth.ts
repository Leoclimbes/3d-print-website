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
// SECURITY NOTE: Admin setup password MUST be in environment variables, not hardcoded
// WHY: Hardcoded passwords are a security risk - anyone with access to the code can see it
// SECURITY: In production, remove the fallback and require ADMIN_SETUP_PASSWORD env var
// HOW TO SET: Add ADMIN_SETUP_PASSWORD=your-strong-password to .env.local file
const ADMIN_SETUP_CONFIG = {
  // Get admin setup password from environment variable or fallback to a default
  // WHY: Environment variables are more secure than hardcoded values
  // SECURITY: The fallback is only for development - never use in production!
  // CONFIGURATION: Set ADMIN_SETUP_PASSWORD in .env.local file (see .env.example)
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
          // CRITICAL FOR VERCEL: If file system fails, this will use in-memory storage
          // WHY: On Vercel, file system is read-only - database operations are handled gracefully
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
          // CRITICAL: Log detailed error information for debugging
          // WHY: In production (Vercel), we need detailed logs to diagnose issues
          logger.error('Unexpected error during authentication', error as Error, { 
            email: credentials.email,
            errorMessage: (error as Error).message,
            errorStack: (error as Error).stack
          })
          // Return null instead of throwing - prevents 500 error page
          // WHY: Better to show login error than crash with 500
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
    // JWT callback - called whenever a JWT is created or updated
    // WHY: This allows us to store user data in the JWT token
    async jwt({ token, user, trigger }) {
      // When user first logs in, store their data in the token
      // WHY: Initial login - save user data to token
      if (user) {
        token.role = user.role
        token.id = user.id
        // Handle email - convert null to undefined for JWT type compatibility
        // WHY: JWT token type expects string | undefined, but user.email might be string | null
        token.email = user.email || undefined
        // Handle name - can be null, which is allowed by JWT type
        // WHY: Names are optional, so null is valid
        token.name = user.name ?? null
      }
      
      // CRITICAL FIX: Refresh user data from database when session is updated
      // WHY: When the user updates their profile, we trigger a session refresh.
      // This ensures the token always has the latest name and email from the database.
      // The 'trigger' parameter is 'update' when session.update() is called.
      if (trigger === 'update' && token.id) {
        // Fetch fresh user data from database
        // WHY: Database is source of truth - token should always match database
        const freshUser = await localDb.findUserById(token.id)
        if (freshUser) {
          // Update token with fresh data from database
          // WHY: Keep token in sync with database after profile updates
          token.name = freshUser.name
          token.email = freshUser.email
          token.role = freshUser.role
        }
      }
      
      return token
    },
    // Session callback - called whenever a session is checked
    // WHY: This allows us to include custom data in the session object
    async session({ session, token }) {
      if (token) {
        // Copy data from token to session
        // WHY: Token has the user data, session object needs it for client components
        session.user.id = token.id as string
        session.user.role = token.role as 'customer' | 'admin'
        // CRITICAL FIX: Include name and email from token in session
        // WHY: Navigation and other components read session.user.name - it must be fresh!
        session.user.name = token.name as string | null
        session.user.email = token.email as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  // CRITICAL FOR VERCEL: NextAuth automatically reads NEXTAUTH_URL from environment
  // WHY: NextAuth needs to know the full URL of your site to generate proper redirects and CSRF tokens
  // WITHOUT THIS: You'll get 500 errors on Vercel because NextAuth can't determine the callback URL
  // HOW TO SET: Add NEXTAUTH_URL=https://your-domain.vercel.app to Vercel environment variables
  // AUTO-DETECTION: In development, NextAuth can auto-detect from request headers
  // PRODUCTION: Must be explicitly set to your Vercel deployment URL
  // NOTE: Include the protocol (https://) and don't include a trailing slash
  // EXAMPLE: NEXTAUTH_URL=https://3d-print-website.vercel.app
  // SECURITY: Use environment variable for secret, fallback only for development
  // WHY: The secret is used to sign JWT tokens - it must be secure and random
  // SECURITY: In production, remove the fallback and require NEXTAUTH_SECRET env var
  // HOW TO SET: Add NEXTAUTH_SECRET=your-random-secret to .env.local file
  // GENERATE SECRET: Run 'openssl rand -base64 32' to generate a secure random secret
  // CONFIGURATION: Set NEXTAUTH_SECRET in .env.local file (see .env.example)
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-change-in-production',
}

// VALIDATION: Check for required environment variables in production
// WHY: This helps identify configuration issues before they cause 500 errors
// WHEN: This runs when the module is loaded (server startup)
if (process.env.NODE_ENV === 'production') {
  // Check if NEXTAUTH_URL is set
  // WHY: Without this, NextAuth will fail on Vercel with 500 errors
  if (!process.env.NEXTAUTH_URL) {
    logger.warn('NEXTAUTH_URL is not set in production - authentication may fail', {
      hint: 'Set NEXTAUTH_URL in Vercel environment variables to your deployment URL (e.g., https://your-app.vercel.app)'
    })
  }
  
  // Check if NEXTAUTH_SECRET is set (warn if using fallback)
  // WHY: Using a fallback secret in production is a security risk
  if (!process.env.NEXTAUTH_SECRET) {
    logger.warn('NEXTAUTH_SECRET is not set - using fallback secret (not secure for production)', {
      hint: 'Generate a secret with: openssl rand -base64 32, then set it in Vercel environment variables'
    })
  }
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

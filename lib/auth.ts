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
const ADMIN_SETUP_CONFIG = {
  // Special admin password for initial setup
  ADMIN_SETUP_PASSWORD: 'AdminSetup2025!',
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
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
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

export async function createAdminUser({ name, email, password, role }: CreateUserParams): Promise<{ user: AuthResult | null; error: string | null }> {
  try {
    const { user, error } = await localDb.createUser({ name, email, password, role })

    if (error) {
      logger.error('Admin user creation failed', new Error(error), { email, role })
      return { user: null, error }
    }

    logger.info('Admin user created successfully', { userId: user?.id, email: user?.email, role: user?.role })
    return {
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      } : null,
      error: null,
    }
  } catch (error) {
    logger.error('Unexpected error during admin user creation', error as Error, { email, role })
    return { user: null, error: (error as Error).message || 'An unexpected error occurred' }
  }
}

export async function createUser({ name, email, password, role }: CreateUserParams): Promise<{ user: AuthResult | null; error: string | null }> {
  try {
    const { user, error } = await localDb.createUser({ name, email, password, role })

    if (error) {
      logger.error('User creation failed', new Error(error), { email, role })
      return { user: null, error }
    }

    logger.info('User created successfully', { userId: user?.id, email: user?.email, role: user?.role })
    return {
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      } : null,
      error: null,
    }
  } catch (error) {
    logger.error('Unexpected error during user creation', error as Error, { email, role })
    return { user: null, error: (error as Error).message || 'An unexpected error occurred' }
  }
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
    if (adminSetupPassword !== ADMIN_SETUP_CONFIG.ADMIN_SETUP_PASSWORD) {
      return { success: false, error: 'Invalid admin setup password. Please use: AdminSetup2025!' }
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

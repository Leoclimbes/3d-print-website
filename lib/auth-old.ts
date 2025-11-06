import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabaseAdmin, isDemoMode } from './supabase'
import { localDb } from './local-db'
import bcrypt from 'bcryptjs'
import { logger } from './logger'

// Type definitions for better type safety
interface User {
  id: string
  email: string
  name: string | null
  role: 'customer' | 'admin'
  password_hash: string | null
}

interface AuthResult {
  id: string
  email: string
  name: string | null
  role: 'customer' | 'admin'
}

// In-memory storage for demo accounts created through admin setup
declare global {
  var demoAccountsStorage: Array<{
    id: string
    email: string
    name: string
    password: string
    role: 'customer' | 'admin'
  }> | undefined
}

const getDemoAccounts = () => {
  if (!global.demoAccountsStorage) {
    global.demoAccountsStorage = []
  }
  return global.demoAccountsStorage
}

// Admin setup configuration
const ADMIN_SETUP_CONFIG = {
  // Special admin password for initial setup
  ADMIN_SETUP_PASSWORD: 'AdminSetup2025!',
  // Check if admin account exists
  async hasAdminAccount(): Promise<boolean> {
    if (isDemoMode) {
      // In demo mode, check if we have any admin users
      return false // Always allow admin creation in demo mode
    }
    
    try {
      const { data: adminUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('role', 'admin')
        .single()
      
      return !!adminUser
    } catch (error) {
      // logger.warn() only accepts 2 arguments: message and context (not error separately)
      logger.warn('Error checking for admin account', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
      return false
    }
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
  secret: process.env.NEXTAUTH_SECRET,
}

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Admin account creation utilities
export async function createAdminAccount(email: string, password: string, name: string, adminSetupPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if admin account already exists
    const hasAdmin = await ADMIN_SETUP_CONFIG.hasAdminAccount()
    if (hasAdmin && !isDemoMode) {
      return { success: false, error: 'Admin account already exists' }
    }

    // Validate admin setup password
    if (adminSetupPassword !== ADMIN_SETUP_CONFIG.ADMIN_SETUP_PASSWORD) {
      return { success: false, error: 'Invalid admin setup password. Please use: AdminSetup2025!' }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    if (isDemoMode) {
      // Store the account in demo storage
      const demoAccounts = getDemoAccounts()
      const newAccount = {
        id: `demo-admin-${Date.now()}`,
        email,
        name,
        password, // Store plain text password for demo mode
        role: 'admin' as const
      }
      demoAccounts.push(newAccount)
      
      logger.info('Admin account created in demo mode', { email, name, accountId: newAccount.id })
      return { success: true }
    }

    // Create auth user in Supabase
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password, // Use original password for auth
      user_metadata: {
        name: name,
      },
      email_confirm: true,
    })

    if (authError) {
      logger.error('Auth user creation error', authError, { email })
      return { success: false, error: 'Failed to create user account' }
    }

    // Create user record in our users table
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.user.id,
        email: email,
        name: name,
        role: 'admin',
        password_hash: hashedPassword,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (userError) {
      logger.error('User creation error', userError, { email, userId: authUser.user.id })
      // Clean up auth user if user creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      return { success: false, error: 'Failed to create user record' }
    }

    logger.info('Admin account created successfully', { email, userId: authUser.user.id, name })
    return { success: true }

  } catch (error) {
    logger.error('Admin account creation error', error as Error, { email })
    return { success: false, error: 'Internal server error' }
  }
}

// Regular user account creation
export async function createUserAccount(email: string, password: string, name: string): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    // Hash the password
    const hashedPassword = await hashPassword(password)

    if (isDemoMode) {
      logger.info('User account created in demo mode', { email, name })
      return { success: true, userId: `demo-user-${Date.now()}` }
    }

    // Create auth user in Supabase
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password,
      user_metadata: {
        name: name,
      },
      email_confirm: true,
    })

    if (authError) {
      logger.error('Auth user creation error', authError, { email })
      return { success: false, error: 'Failed to create user account' }
    }

    // Create user record in our users table
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.user.id,
        email: email,
        name: name,
        role: 'customer',
        password_hash: hashedPassword,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (userError) {
      logger.error('User creation error', userError, { email, userId: authUser.user.id })
      // Clean up auth user if user creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      return { success: false, error: 'Failed to create user record' }
    }

    logger.info('User account created successfully', { email, userId: authUser.user.id, name })
    return { success: true, userId: authUser.user.id }

  } catch (error) {
    logger.error('User account creation error', error as Error, { email })
    return { success: false, error: 'Internal server error' }
  }
}

// Export admin setup config for use in components
export { ADMIN_SETUP_CONFIG }
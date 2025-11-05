import { createClient } from '@supabase/supabase-js'
import { logger } from './logger'

// Environment validation
// WHY: Supabase credentials are sensitive and must be in environment variables
// CONFIGURATION: Set these in .env.local file (see .env.example for documentation)
// SECURITY: Never commit these values to git - they're in .gitignore
// NOTE: Currently using local file-based database - these are for future Supabase integration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Check if we're in demo mode
export const isDemoMode = supabaseUrl === 'https://placeholder.supabase.co' || 
                         supabaseAnonKey === 'placeholder-key' ||
                         supabaseServiceRoleKey === 'placeholder-service-key'

// Create Supabase client for client-side operations
// This uses the public anon key and is safe to use in the browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Create Supabase client for server-side operations with service role
// This has elevated permissions and should only be used in API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Utility function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !isDemoMode
}

// Utility function to get configuration status
export function getConfigStatus() {
  const status = {
    isDemoMode,
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
  if (isDemoMode) {
    logger.warn('Supabase is running in demo mode. Please configure environment variables for full functionality.', status)
  } else {
    logger.info('Supabase is configured and running.', status)
  }
  return status
}

// Database type definitions for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'customer' | 'admin'
          password_hash: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: 'customer' | 'admin'
          password_hash?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'customer' | 'admin'
          password_hash?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category_id: string
          material: string | null
          dimensions: string | null
          print_time: string | null
          stock_quantity: number
          images: string[]
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category_id: string
          material?: string | null
          dimensions?: string | null
          print_time?: string | null
          stock_quantity?: number
          images?: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category_id?: string
          material?: string | null
          dimensions?: string | null
          print_time?: string | null
          stock_quantity?: number
          images?: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          stripe_payment_id: string | null
          shipping_address: any // JSON object
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          stripe_payment_id?: string | null
          shipping_address: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          stripe_payment_id?: string | null
          shipping_address?: any
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_at_purchase?: number
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
  }
}

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// NextAuth API route handler
// This file handles all authentication requests (login, logout, session management)
// It uses the configuration we defined in lib/auth.ts

// CRITICAL FOR VERCEL: NextAuth configuration must include NEXTAUTH_URL
// WHY: Without NEXTAUTH_URL, NextAuth can't determine callback URLs and will throw 500 errors
// SOLUTION: Set NEXTAUTH_URL=https://your-domain.vercel.app in Vercel environment variables

// Create the NextAuth handler
// WHY: NextAuth exports a function that returns route handlers
// This handler automatically handles both GET and POST requests
const handler = NextAuth(authOptions)

// Export both GET and POST handlers
// GET: Used for session management and CSRF token generation
// POST: Used for login/logout requests
// WHY: NextAuth requires both GET and POST to handle different authentication flows
// NOTE: NextAuth v4 with App Router automatically handles the route parameters
export { handler as GET, handler as POST }

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// NextAuth API route handler
// This file handles all authentication requests (login, logout, session management)
// It uses the configuration we defined in lib/auth.ts

const handler = NextAuth(authOptions)

// Export both GET and POST handlers
// GET: Used for session management and CSRF token generation
// POST: Used for login/logout requests
export { handler as GET, handler as POST }

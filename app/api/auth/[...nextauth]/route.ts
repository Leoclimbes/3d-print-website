import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'

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

// CRITICAL: Wrap handlers with error catching for Vercel
// WHY: On Vercel, file system errors or missing env vars can cause unhandled errors
// This wrapper catches errors and logs them instead of showing blank 500 page
async function wrappedHandler(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> | { nextauth: string[] } }
) {
  try {
    // Call the NextAuth handler
    // WHY: NextAuth handles all authentication logic internally
    const response = await handler(req, context)
    return response
  } catch (error) {
    // CRITICAL: Log detailed error information for debugging
    // WHY: In production (Vercel), we need detailed logs to diagnose issues
    logger.error('NextAuth handler error', error as Error, {
      url: req.url,
      method: req.method,
      errorMessage: (error as Error).message,
      errorStack: (error as Error).stack,
      hint: 'Check Vercel logs for detailed error information. Common issues: missing NEXTAUTH_URL, file system errors on Vercel'
    })
    
    // Return a proper error response instead of crashing
    // WHY: This prevents the blank 500 page and shows a proper error message
    return NextResponse.json(
      { 
        error: 'Authentication service error',
        message: process.env.NODE_ENV === 'development' 
          ? (error as Error).message 
          : 'An error occurred during authentication. Please check server logs.',
        hint: 'Check Vercel environment variables: NEXTAUTH_URL and NEXTAUTH_SECRET must be set'
      },
      { status: 500 }
    )
  }
}

// Export both GET and POST handlers
// GET: Used for session management and CSRF token generation
// POST: Used for login/logout requests
// WHY: NextAuth requires both GET and POST to handle different authentication flows
// NOTE: NextAuth v4 with App Router automatically handles the route parameters
export const GET = wrappedHandler
export const POST = wrappedHandler

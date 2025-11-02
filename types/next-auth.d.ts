import { DefaultSession } from 'next-auth'

// Extend the default NextAuth session types to include our custom properties
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'customer' | 'admin'
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: 'customer' | 'admin'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'customer' | 'admin'
    // CRITICAL FIX: Include name and email in JWT token type
    // WHY: We store name and email in the JWT token so they can be refreshed from database
    // when the session is updated. This ensures Navigation and other components
    // always show the latest user data from the database.
    name?: string | null
    email?: string
  }
}

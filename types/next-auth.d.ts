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
  }
}

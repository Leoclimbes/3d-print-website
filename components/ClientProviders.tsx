'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'

// Client-side provider wrapper for NextAuth and other client-only features
// This component must be marked as 'use client' to use React Context
export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {children}
      {/* Toaster provides toast notifications throughout the app */}
      <Toaster position="top-right" richColors />
    </SessionProvider>
  )
}

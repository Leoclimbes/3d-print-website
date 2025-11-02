'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { CartProvider } from '@/contexts/CartContext'

// Client-side provider wrapper for NextAuth and other client-only features
// This component must be marked as 'use client' to use React Context
// WHY: Both SessionProvider and CartProvider need to be client components
export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {/* CartProvider wraps the app to provide cart state management */}
      {/* WHY: Cart state needs to be available throughout the entire application */}
      {/* This allows any component to access cart via useCart() hook */}
      <CartProvider>
        {children}
        {/* Toaster provides toast notifications throughout the app */}
        {/* WHY: Toast notifications need to be available globally for user feedback */}
        <Toaster position="top-right" richColors />
      </CartProvider>
    </SessionProvider>
  )
}

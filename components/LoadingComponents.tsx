'use client'

import React, { Suspense } from 'react'

// Loading spinner component for better UX
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
    </div>
  )
}

// Page loading component
export function PageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

// Suspense wrapper for components that might have async operations
export function SuspenseWrapper({ 
  children, 
  fallback = <LoadingSpinner /> 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}

// Image loading optimization component
export function OptimizedImage({ 
  src, 
  alt, 
  className = '',
  priority = false 
}: { 
  src: string
  alt: string
  className?: string
  priority?: boolean 
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}

// Debounced search hook for better performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Memoized component wrapper for performance
export function MemoizedComponent<T extends object>(Component: React.ComponentType<T>) {
  return React.memo(Component)
}

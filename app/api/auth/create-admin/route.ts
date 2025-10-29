import { NextRequest, NextResponse } from 'next/server'
import { createAdminAccount } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { z } from 'zod'

// Validation schema for admin creation
const adminCreationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').max(255).trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
    .max(100),
  adminSetupPassword: z.string().min(1, 'Admin setup password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = adminCreationSchema.parse(body)
    
    logger.info('Admin account creation attempt', { 
      email: validatedData.email, 
      name: validatedData.name 
    })

    // Create the admin account
    const result = await createAdminAccount(
      validatedData.email,
      validatedData.password,
      validatedData.name,
      validatedData.adminSetupPassword
    )

    if (!result.success) {
      logger.warn('Admin account creation failed', { 
        email: validatedData.email, 
        error: result.error 
      })
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    logger.info('Admin account created successfully', { 
      email: validatedData.email, 
      name: validatedData.name 
    })

    return NextResponse.json(
      { 
        message: 'Admin account created successfully',
        email: validatedData.email,
        name: validatedData.name
      },
      { status: 201 }
    )

  } catch (error) {
    logger.error('Admin creation API error', error as Error, {})
    
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

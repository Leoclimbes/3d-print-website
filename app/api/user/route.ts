import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { localDb } from '@/lib/local-db'
import { logger } from '@/lib/logger'
import { z } from 'zod'

// Validation schema for updating user profile
// WHY: We need to validate user input before updating their account to prevent invalid data
const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim().optional(),
  email: z.string().email('Invalid email address').max(255).trim().optional(),
})

// Validation schema for password change
// WHY: Password validation ensures security - strong passwords protect user accounts
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
    .max(100),
})

// GET /api/user - Get current user's account information
// WHY: The account page needs to display the user's current information (name, email, role, etc.)
export async function GET(request: NextRequest) {
  try {
    // Get the current session to identify the logged-in user
    // WHY: We need to know which user is making the request - security requires authentication
    const session = await getServerSession(authOptions)
    
    // If no session exists, user is not logged in
    // WHY: Unauthenticated users shouldn't be able to access account information
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user data from the local database using the user ID from session
    // WHY: The session only contains basic info - we need full user data from the database
    const user = await localDb.findUserById(session.user.id)

    // If user not found in database (shouldn't happen, but handle gracefully)
    // WHY: Handle edge cases where session exists but user is deleted from database
    if (!user) {
      logger.warn('User session exists but user not found in database', { userId: session.user.id })
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Return user data (excluding sensitive information like password_hash)
    // WHY: Never send password hashes to the client - security best practice
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }
    })
  } catch (error) {
    // Log the error for debugging but don't expose internal errors to client
    // WHY: Exposing internal errors can help attackers understand system structure
    logger.error('Error fetching user data', error as Error, {})
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}

// PUT /api/user - Update current user's profile information
// WHY: Users need to be able to update their name and email address
export async function PUT(request: NextRequest) {
  try {
    // Get the current session to identify the logged-in user
    // WHY: Only authenticated users should be able to update their profile
    const session = await getServerSession(authOptions)
    
    // Check authentication
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate the request body
    // WHY: Validation ensures data integrity and prevents invalid updates
    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Get user from database to check current state
    // WHY: We need to check if email is already taken by another user
    const user = await localDb.findUserById(session.user.id)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // If email is being updated, check if it's already in use by another user
    // WHY: Email addresses must be unique - can't have two users with same email
    if (validatedData.email && validatedData.email !== user.email) {
      const existingUser = await localDb.findUserByEmail(validatedData.email)
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { success: false, error: 'Email already in use by another account' },
          { status: 400 }
        )
      }
    }

    // Prepare update object with only the fields that were provided
    // WHY: Partial updates allow users to change just name OR just email without affecting other fields
    const updates: { name?: string; email?: string } = {}
    if (validatedData.name !== undefined) {
      updates.name = validatedData.name
    }
    if (validatedData.email !== undefined) {
      updates.email = validatedData.email.toLowerCase().trim() // Normalize email
    }

    // Update the user in the database
    // WHY: localDb.updateUser handles saving to file and updating timestamps
    const updatedUser = await localDb.updateUser(session.user.id, updates)

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      )
    }

    // Log the update for audit purposes
    // WHY: Tracking profile changes helps with debugging and security monitoring
    logger.info('User profile updated', { 
      userId: session.user.id, 
      updates 
    })

    // Return updated user data (excluding password_hash)
    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
      }
    })
  } catch (error) {
    // Handle validation errors separately from other errors
    // WHY: Validation errors should return 400 (bad request) not 500 (server error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    logger.error('Error updating user profile', error as Error, {})
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// POST /api/user/change-password - Change user's password
// WHY: Users need a way to change their password for security reasons
export async function POST(request: NextRequest) {
  try {
    // Get the current session
    // WHY: Password changes must be authenticated - only the account owner can change it
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate the request body
    // WHY: Password validation ensures strong passwords are set
    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    // Get user from database to verify current password
    // WHY: We need to confirm the user knows their current password before allowing change
    const user = await localDb.findUserById(session.user.id)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify the current password is correct
    // WHY: Security requirement - prevent unauthorized password changes
    const isCurrentPasswordValid = await localDb.verifyPassword(
      validatedData.currentPassword,
      user.password_hash
    )

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash the new password before storing
    // WHY: Passwords must never be stored in plain text - security requirement
    const bcrypt = await import('bcryptjs')
    const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 12)

    // Update the password in the database
    // WHY: Save the new hashed password, replacing the old one
    await localDb.updateUser(session.user.id, {
      password_hash: newPasswordHash
    })

    // Log password change for security auditing
    // WHY: Password changes should be logged for security monitoring
    logger.info('User password changed', { userId: session.user.id })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    logger.error('Error changing password', error as Error, {})
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    )
  }
}

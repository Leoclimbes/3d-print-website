import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { logger } from './logger'

// Simple file-based database for demo purposes
// WHY: File-based database stores user data locally without needing external database
// CONFIGURATION: Database path can be customized via DATABASE_PATH environment variable
// DEFAULT: ./data (stores users.json in data/ directory)
// HOW TO SET: Add DATABASE_PATH=/custom/path to .env.local file (optional)
// SECURITY: The database path is not sensitive but allows customization per environment
const DB_PATH = process.env.DATABASE_PATH 
  ? path.resolve(process.env.DATABASE_PATH)  // Use custom path from env var if provided
  : path.join(process.cwd(), 'data')         // Default to ./data directory
const USERS_FILE = path.join(DB_PATH, 'users.json')

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true })
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]))
}

interface User {
  id: string
  email: string
  name: string
  password_hash: string
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

class LocalDatabase {
  private users: User[] = []

  constructor() {
    this.loadUsers()
  }

  // Load users from JSON file into memory
  // WHY: We need to read the latest user data from the file before performing operations
  // CONCURRENCY NOTE: File-based DB has limitations with concurrent writes - consider a real DB for production
  private loadUsers() {
    try {
      const data = fs.readFileSync(USERS_FILE, 'utf8')
      this.users = JSON.parse(data)
    } catch (error) {
      // Use logger instead of console.error for consistent logging
      // WHY: Logger provides better formatting, timestamps, and can be configured for production
      logger.error('Error loading users from file', error as Error, { file: USERS_FILE })
      this.users = []
    }
  }

  // Save users from memory to JSON file
  // WHY: We need to persist changes to disk so they survive server restarts
  // CONCURRENCY NOTE: Multiple simultaneous saves could cause data loss - file locking would help
  private saveUsers() {
    try {
      // Write atomically by writing to a temp file first, then renaming
      // WHY: This prevents corruption if the process crashes mid-write
      const tempFile = `${USERS_FILE}.tmp`
      fs.writeFileSync(tempFile, JSON.stringify(this.users, null, 2))
      fs.renameSync(tempFile, USERS_FILE)
    } catch (error) {
      // Use logger for consistent error reporting
      logger.error('Error saving users to file', error as Error, { file: USERS_FILE })
      throw error // Re-throw so caller knows save failed
    }
  }

  async createUser(userData: {
    email: string
    name: string
    password: string
    role: 'customer' | 'admin'
  }): Promise<{ user: User | null; error: string | null }> {
    try {
      // Check if user already exists
      const existingUser = this.users.find(u => u.email === userData.email)
      if (existingUser) {
        return { user: null, error: 'User with this email already exists' }
      }

      // Hash the password
      const password_hash = await bcrypt.hash(userData.password, 12)

      // Create new user with unique ID
      // WHY: We need a unique identifier for each user
      // SECURITY: ID generation uses timestamp + random to minimize collision risk
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`, // Use substring instead of deprecated substr
        email: userData.email.toLowerCase().trim(), // Normalize email
        name: userData.name.trim(), // Remove leading/trailing whitespace
        password_hash,
        role: userData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      this.users.push(newUser)
      this.saveUsers()

      logger.info('User created successfully', { userId: newUser.id, email: newUser.email, role: newUser.role })
      return { user: newUser, error: null }
    } catch (error) {
      // Log the actual error but return generic message to user
      // WHY: Don't expose internal errors to potential attackers
      logger.error('Failed to create user', error as Error, { email: userData.email })
      return { user: null, error: 'Failed to create user' }
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    // Always reload users from file to ensure we have latest data
    // WHY: In a multi-process environment, another process might have updated the file
    this.loadUsers()
    // Normalize email for comparison (lowercase, trim)
    // WHY: Email matching should be case-insensitive
    const normalizedEmail = email.toLowerCase().trim()
    return this.users.find(u => u.email.toLowerCase() === normalizedEmail) || null
  }

  // Find user by their unique ID
  // WHY: We often need to look up users by ID instead of email (e.g., when updating profile)
  async findUserById(id: string): Promise<User | null> {
    // Always reload users from file to ensure we have latest data
    // WHY: In a multi-process environment, another process might have updated the file
    this.loadUsers()
    return this.users.find(u => u.id === id) || null
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  async hasAdminAccount(): Promise<boolean> {
    return this.users.some(u => u.role === 'admin')
  }

  getAllUsers(): User[] {
    return [...this.users]
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    // CRITICAL FIX: Reload users from file before updating
    // WHY: Ensures we have the latest data from disk before making changes.
    // Without this, if another process or request modified the file,
    // we might be working with stale in-memory data and overwrite recent changes.
    // This is especially important in development with hot reloading.
    this.loadUsers()
    
    // Find the user's index in the array by their unique ID
    // WHY: We need to locate the user record before we can update it
    const userIndex = this.users.findIndex(u => u.id === id)
    
    // If user not found, return null to indicate failure
    // WHY: Can't update a user that doesn't exist
    if (userIndex === -1) return null

    // Create updated user object by spreading existing data and applying updates
    // WHY: Partial updates - we only change the fields provided, keeping other fields unchanged
    // Also update the 'updated_at' timestamp to track when the record was modified
    this.users[userIndex] = {
      ...this.users[userIndex],  // Keep all existing fields
      ...updates,                 // Apply new/changed fields from updates parameter
      updated_at: new Date().toISOString(), // Always update timestamp when record changes
    }

    // Save the updated users array to disk
    // WHY: Persist changes to file so they survive server restarts
    this.saveUsers()
    
    // Return the updated user object
    // WHY: Caller needs the updated data to send back to client
    return this.users[userIndex]
  }

  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === id)
    if (userIndex === -1) return false

    this.users.splice(userIndex, 1)
    this.saveUsers()
    return true
  }
}

// Export singleton instance
export const localDb = new LocalDatabase()
export type { User }

import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

// Simple file-based database for demo purposes
const DB_PATH = path.join(process.cwd(), 'data')
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

  private loadUsers() {
    try {
      const data = fs.readFileSync(USERS_FILE, 'utf8')
      this.users = JSON.parse(data)
    } catch (error) {
      console.error('Error loading users:', error)
      this.users = []
    }
  }

  private saveUsers() {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2))
    } catch (error) {
      console.error('Error saving users:', error)
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

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        name: userData.name,
        password_hash,
        role: userData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      this.users.push(newUser)
      this.saveUsers()

      return { user: newUser, error: null }
    } catch (error) {
      return { user: null, error: 'Failed to create user' }
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    // Always reload users from file to ensure we have latest data
    this.loadUsers()
    return this.users.find(u => u.email === email) || null
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
    const userIndex = this.users.findIndex(u => u.id === id)
    if (userIndex === -1) return null

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    this.saveUsers()
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

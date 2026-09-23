import { clearToken, getToken, setToken } from './api/client'

const USERS_KEY = 'nova-users'
const SESSION_KEY = 'nova-session'

export type UserRole = 'admin' | 'user'

export type StoredUser = {
  fullName: string
  email: string
  password?: string
  role?: UserRole
}

export type SessionUser = {
  id?: number | string
  fullName: string
  email: string
  role: UserRole
  token?: string
}

export interface AuthResult {
  success: boolean
  message?: string
  user?: SessionUser
}

const normalizeRole = (role?: string): UserRole => {
  return role === 'admin' ? 'admin' : 'user'
}

export const isAuthenticated = (): boolean => {
  try {
    const session = localStorage.getItem(SESSION_KEY)
    return Boolean(session)
  } catch {
    return false
  }
}

export const getSessionUser = (): SessionUser | null => {
  try {
    const value = localStorage.getItem(SESSION_KEY)
    return value ? (JSON.parse(value) as SessionUser) : null
  } catch {
    return null
  }
}

export const setSessionUser = (user: SessionUser) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } catch {
    // ignore
  }
}

export const clearSessionUser = () => {
  try {
    localStorage.removeItem(SESSION_KEY)
    clearToken()
  } catch {
    // ignore
  }
}

const getStoredUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveStoredUsers = (users: StoredUser[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    // ignore
  }
}

/**
 * Register a new user in local storage (No DB required).
 */
export const registerUser = async (user: {
  fullName: string
  email: string
  password: string
}): Promise<AuthResult> => {
  try {
    const normalizedEmail = user.email.trim().toLowerCase()
    const users = getStoredUsers()

    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (existing) {
      return {
        success: false,
        message: 'An account with this email already exists.',
      }
    }

    const role: UserRole = normalizedEmail.includes('admin') ? 'admin' : 'user'
    const newUser: StoredUser = {
      fullName: user.fullName,
      email: normalizedEmail,
      password: user.password,
      role,
    }

    users.push(newUser)
    saveStoredUsers(users)

    const token = `local-token-${Date.now()}`
    setToken(token)

    const sessionUser: SessionUser = {
      id: Date.now(),
      fullName: user.fullName,
      email: normalizedEmail,
      role,
      token,
    }

    setSessionUser(sessionUser)
    return { success: true, user: sessionUser }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Registration failed. Please try again.',
    }
  }
}

/**
 * Login user locally (No DB required).
 * Supports default demo accounts (admin@nova.com, user@nova.com) and locally registered users.
 */
export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const normalizedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()

    const found = users.find((u) => u.email.toLowerCase() === normalizedEmail)

    let role: UserRole = 'user'
    let fullName = 'User'

    if (found) {
      if (found.password && found.password !== password) {
        return {
          success: false,
          message: 'Incorrect password. Please try again.',
        }
      }
      role = found.role || (normalizedEmail.includes('admin') ? 'admin' : 'user')
      fullName = found.fullName
    } else {
      // Demo accounts or instant fallback
      if (normalizedEmail.includes('admin')) {
        role = 'admin'
        fullName = 'Nova Administrator'
      } else {
        role = 'user'
        fullName = normalizedEmail.split('@')[0] || 'Nova User'
      }
    }

    const token = `local-token-${Date.now()}`
    setToken(token)

    const sessionUser: SessionUser = {
      id: found ? found.email : Date.now(),
      fullName,
      email: normalizedEmail,
      role,
      token,
    }

    setSessionUser(sessionUser)
    return { success: true, user: sessionUser }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Login failed. Please try again.',
    }
  }
}

export const logoutUser = () => {
  clearSessionUser()
}


import { api, clearToken, getToken, setToken } from './api/client'

const SESSION_KEY = 'nova-session'

export type UserRole = 'admin' | 'user'

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
    const token = getToken()
    return Boolean(session || token)
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

/**
 * Register a new user with the NOVA_BE backend API.
 */
export const registerUser = async (user: {
  fullName: string
  email: string
  password: string
}): Promise<AuthResult> => {
  try {
    const response = await api<{
      user: { id: number; fullName?: string; full_name?: string; email: string; role: string }
      token: string
      message?: string
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: user.fullName,
        email: user.email,
        password: user.password,
      }),
    })

    if (response.token) {
      setToken(response.token)
    }

    const sessionUser: SessionUser = {
      id: response.user?.id || Date.now(),
      fullName: response.user?.fullName || response.user?.full_name || user.fullName,
      email: response.user?.email || user.email,
      role: normalizeRole(response.user?.role),
      token: response.token,
    }

    setSessionUser(sessionUser)
    return { success: true, user: sessionUser }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Registration failed. Please check your backend connection.',
    }
  }
}

/**
 * Login user via the NOVA_BE backend API.
 */
export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const response = await api<{
      user: { id: number; fullName?: string; full_name?: string; email: string; role: string }
      token: string
      message?: string
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (response.token) {
      setToken(response.token)
    }

    const sessionUser: SessionUser = {
      id: response.user?.id || Date.now(),
      fullName: response.user?.fullName || response.user?.full_name || 'User',
      email: response.user?.email || email,
      role: normalizeRole(response.user?.role),
      token: response.token,
    }

    setSessionUser(sessionUser)
    return { success: true, user: sessionUser }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Login failed. Please check your backend connection and credentials.',
    }
  }
}

export const logoutUser = () => {
  clearSessionUser()
}



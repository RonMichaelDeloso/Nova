import { getToken } from './api/client'

const SESSION_KEY = 'nova-session'

export type UserRole = 'admin' | 'user'

export type SessionUser = {
  id: number
  fullName: string
  email: string
  role: UserRole
}

export const isAuthenticated = () => {
  try {
    return Boolean(localStorage.getItem(SESSION_KEY) && getToken())
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
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export const clearSessionUser = () => {
  localStorage.removeItem(SESSION_KEY)
}

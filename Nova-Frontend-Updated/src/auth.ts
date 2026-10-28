const USERS_KEY = 'nova-users'
const SESSION_KEY = 'nova-session'

export type UserRole = 'admin' | 'user'

export type StoredUser = {
  fullName: string
  email: string
  password: string
  role?: UserRole
}

export type SessionUser = {
  fullName: string
  email: string
  role: UserRole
}

const normalizeRole = (role?: UserRole): UserRole => {
  return role === 'admin' ? 'admin' : 'user'
}

const readUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const parsed = raw ? (JSON.parse(raw) as StoredUser[]) : []
    return parsed.map((user) => ({
      ...user,
      role: normalizeRole(user.role),
    }))
  } catch {
    return []
  }
}

const writeUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const isAuthenticated = () => {
  try {
    return Boolean(localStorage.getItem(SESSION_KEY))
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

export const seedTemporaryAccount = () => {
  const users = readUsers()

  const admin = users.find((user) => user.email.toLowerCase() === 'admin@nova.com')
  if (!admin) {
    users.push({
      fullName: 'System Admin',
      email: 'admin@nova.com',
      password: 'admin123',
      role: 'admin',
    })
  }

  const demo = users.find((user) => user.email.toLowerCase() === 'demo@nova.com')
  if (!demo) {
    users.push({
      fullName: 'Demo User',
      email: 'demo@nova.com',
      password: 'nova123',
      role: 'user',
    })
  }

  writeUsers(users)
}

export const registerUser = (user: StoredUser) => {
  const users = readUsers()
  const normalizedUser = {
    ...user,
    role: 'user' as const,
  }

  const alreadyExists = users.some((existing) => existing.email.toLowerCase() === normalizedUser.email.toLowerCase())

  if (alreadyExists) {
    return false
  }

  users.push(normalizedUser)
  writeUsers(users)
  setSessionUser({ fullName: normalizedUser.fullName, email: normalizedUser.email, role: normalizedUser.role })
  return true
}

export const loginUser = (email: string, password: string) => {
  const users = readUsers()
  const match = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() && user.password === password,
  )

  if (!match) {
    return false
  }

  setSessionUser({
    fullName: match.fullName,
    email: match.email,
    role: normalizeRole(match.role),
  })
  return true
}

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')

export const TOKEN_KEY = 'nova-token'

export type ApiUser = {
  id: number
  fullName: string
  email: string
  role: 'admin' | 'user'
}

export type AuthResponse = {
  access?: string
  token?: string
  refresh?: string
  user: ApiUser
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export async function api<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const url = `${API_URL}${cleanPath}`

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data: unknown = await response.json().catch(() => ({}))

    if (!response.ok) {
      const errorData = data && typeof data === 'object' ? data as Record<string, unknown> : {}
      const fieldError = Object.values(errorData).find((value) => Array.isArray(value) && typeof value[0] === 'string')
      const message = typeof errorData.detail === 'string'
        ? errorData.detail
        : typeof errorData.message === 'string'
          ? errorData.message
          : Array.isArray(fieldError)
            ? String(fieldError[0])
          : `Request failed with status ${response.status}`
      const error = new Error(message)
      Object.assign(error, { status: response.status, data })
      throw error
    }

    return data as T
  } catch (err: unknown) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error(`Unable to reach backend server at ${API_URL}. Please make sure NOVA_BE is running.`)
    }
    throw err
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const TOKEN_KEY = 'nova-token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // ignore
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
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

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message = data.message || `Request failed with status ${response.status}`
      const error: any = new Error(message)
      error.status = response.status
      error.data = data
      throw error
    }

    return data as T
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Unable to reach backend server at ${API_URL}. Please make sure NOVA_BE is running.`)
    }
    throw err
  }
}

export async function checkBackendHealth(): Promise<{ ok: boolean; service?: string; error?: string }> {
  try {
    const res = await api<{ ok: boolean; service?: string }>('/health')
    return { ok: Boolean(res?.ok), service: res?.service }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

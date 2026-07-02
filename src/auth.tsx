import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import api from './api'
import type { User } from './types'

interface AuthContextValue {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)

  // Carga el perfil del usuario autenticado (GET /users/current).
  async function loadCurrentUser() {
    try {
      const { data } = await api.get<User>('/users/current')
      setUser(data)
    } catch {
      // Token inválido o expirado: limpiar sesión.
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }

  // Al montar (o cuando cambia el token) recupera el usuario si hay token.
  useEffect(() => {
    if (token) {
      loadCurrentUser()
    } else {
      setUser(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function login(newToken: string) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    await loadCurrentUser()
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

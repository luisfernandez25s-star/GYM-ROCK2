'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AuthUser, UserRole } from './types'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAdmin: boolean
  isTrainer: boolean
  isClient: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      
      if (data.success && data.user) {
        setUser(data.user)
        return { success: true }
      }
      return { success: false, error: data.error || 'Error al iniciar sesión' }
    } catch {
      return { success: false, error: 'Error de conexión' }
    }
  }

  const register = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone })
      })
      const data = await res.json()
      
      if (data.success && data.user) {
        setUser(data.user)
        return { success: true }
      }
      return { success: false, error: data.error || 'Error al registrarse' }
    } catch {
      return { success: false, error: 'Error de conexión' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout failed:', error)
    }
    setUser(null)
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isTrainer: user?.role === 'trainer',
    isClient: user?.role === 'client'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function hasRole(user: AuthUser | null, roles: UserRole[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      api.get('/auth/me/')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password, remember = false) => {
    const res = await api.post('/auth/login/', { username, password })
    localStorage.setItem('access_token', res.data.access)
    localStorage.setItem('refresh_token', res.data.refresh)
    // Save username if remember me is checked
    if (remember) {
      localStorage.setItem('remembered_username', username)
    } else {
      localStorage.removeItem('remembered_username')
    }
    const me = await api.get('/auth/me/')
    setUser(me.data)
    return me.data
  }

  const register = async (data) => {
    const res = await api.post('/auth/register/', data)
    localStorage.setItem('access_token', res.data.access)
    localStorage.setItem('refresh_token', res.data.refresh)
    // Auto-remember username after registering
    localStorage.setItem('remembered_username', data.username)
    setUser(res.data.user)
    return res.data.user
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const getSavedUsername = () => localStorage.getItem('remembered_username') || ''

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getSavedUsername }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

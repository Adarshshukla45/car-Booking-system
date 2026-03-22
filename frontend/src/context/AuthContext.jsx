import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(localStorage.getItem('di_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('di_user')
    if (stored && token) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('di_user',  JSON.stringify(userData))
    localStorage.setItem('di_token', jwt)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('di_user')
    localStorage.removeItem('di_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

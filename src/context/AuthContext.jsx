import { createContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import {
  getCurrentSession,
  signIn,
  signOut,
} from '../services/authService'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      try {
        const currentSession = await getCurrentSession()

        if (mounted) {
          setSession(currentSession)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function login(email, password) {
    return signIn(email, password)
  }

  async function logout() {
    await signOut()
    setSession(null)
  }

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, ADMIN_EMAIL } from '../lib/supabase'

interface AuthContextType {
  user:    User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signIn:  (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp:  (email: string, password: string) => Promise<{ error: AuthError | null; needsConfirm?: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes — also sync profile row so admin can list all users
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_IN' && session?.user) {
        supabase.from('profiles').upsert(
          { id: session.user.id, email: session.user.email! },
          { onConflict: 'id' }
        )
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`
      }
    })
    // Supabase may require email confirmation
    const needsConfirm = !error && !data.session
    return { error, needsConfirm }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const isAdmin = user?.email === ADMIN_EMAIL

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

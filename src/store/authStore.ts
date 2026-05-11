import { create } from 'zustand'
import type { User } from '@/types'
import { supabase } from '@/lib/supabase/client'

interface AuthState {
  user: User | null
  session: unknown | null
  loading: boolean
  setUser: (user: User | null) => void
  setSession: (session: unknown | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },
  refreshUser: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', session.user.id)
        .single()
      if (data) set({ user: data as User, session })
    }
    set({ loading: false })
  },
}))

import { create } from 'zustand'
import { auth } from '../services/firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  distribution: string
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => void
  setDistribution: (dist: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  distribution: 'wayneos',
  
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      set({ user: userCredential.user, isAuthenticated: true })
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },
  
  logout: async () => {
    try {
      await signOut(auth)
      set({ user: null, isAuthenticated: false })
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },
  
  checkAuth: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, isAuthenticated: !!user, isLoading: false })
    })
  },
  
  setDistribution: (distribution: string) => {
    set({ distribution })
  }
}))
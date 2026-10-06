import { createContext } from 'react'

export interface Profile {
  name: string
  email: string
  phone: string
  department: string
}

export interface AuthContextValue {
  isAuthenticated: boolean
  profile: Profile
  login: (username: string, remember: boolean) => void
  logout: () => void
  updateProfile: (profile: Profile) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

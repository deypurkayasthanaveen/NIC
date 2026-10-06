import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { isBoolean, readStorage, removeStorage, writeStorage } from '../utils/storage'
import { AuthContext, type AuthContextValue, type Profile } from './authContext'

// Static demo auth only: a boolean flag in storage, no tokens or verification.
const AUTH_KEY = 'isAuthenticated'
const PROFILE_KEY = 'profile'

const defaultProfile: Profile = {
  name: 'Admin User',
  email: 'admin@nic.gov.in',
  phone: '',
  department: 'Administration',
}

function isProfile(value: unknown): value is Profile {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return ['name', 'email', 'phone', 'department'].every((key) => typeof candidate[key] === 'string')
}

function readAuthFlag(): boolean {
  return (
    readStorage(AUTH_KEY, false, isBoolean, window.localStorage) ||
    readStorage(AUTH_KEY, false, isBoolean, window.sessionStorage)
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuthFlag)
  const [profile, setProfile] = useState<Profile>(() =>
    readStorage(PROFILE_KEY, defaultProfile, isProfile),
  )

  const login = useCallback((username: string, remember: boolean) => {
    // "Remember me" keeps the flag across browser restarts; otherwise it lasts for this tab only.
    writeStorage(AUTH_KEY, true, remember ? window.localStorage : window.sessionStorage)
    setIsAuthenticated(true)

    if (readStorage(PROFILE_KEY, null, isProfile) === null) {
      const trimmed = username.trim()
      const isEmail = trimmed.includes('@')
      const initialProfile: Profile = {
        ...defaultProfile,
        name: isEmail ? trimmed.split('@')[0] : trimmed,
        email: isEmail ? trimmed : defaultProfile.email,
      }
      writeStorage(PROFILE_KEY, initialProfile)
      setProfile(initialProfile)
    }
  }, [])

  const logout = useCallback(() => {
    removeStorage(AUTH_KEY, window.localStorage)
    removeStorage(AUTH_KEY, window.sessionStorage)
    setIsAuthenticated(false)
  }, [])

  const updateProfile = useCallback((next: Profile) => {
    writeStorage(PROFILE_KEY, next)
    setProfile(next)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, profile, login, logout, updateProfile }),
    [isAuthenticated, profile, login, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

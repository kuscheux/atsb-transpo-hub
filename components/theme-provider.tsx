'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type AppTheme = 'default' | 'teamsters'

interface ThemeContextValue {
  theme: AppTheme
  setTheme: (t: AppTheme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'default',
  setTheme: () => {},
})

export function useAppTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>('default')

  // Read from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('app-theme') as AppTheme | null
    if (stored === 'teamsters') {
      setThemeState('teamsters')
      document.documentElement.dataset.theme = 'teamsters'
    }
  }, [])

  const setTheme = (t: AppTheme) => {
    setThemeState(t)
    localStorage.setItem('app-theme', t)
    if (t === 'teamsters') {
      document.documentElement.dataset.theme = 'teamsters'
    } else {
      delete document.documentElement.dataset.theme
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

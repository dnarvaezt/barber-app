import { createContext } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  isDark: boolean
}

export interface ThemeContextType extends ThemeState {
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
)

import { createContext } from 'react'

// Tipos para el contexto de tema
export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  isDark: boolean
}

export interface ThemeContextType extends ThemeState {
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

// Crear contexto
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
)

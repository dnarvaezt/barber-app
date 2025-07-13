import { useContext } from 'react'
import { ThemeContext } from './theme-context-def'

// Hook personalizado para usar el contexto de tema
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './theme-context-def'

import type { ReactNode } from 'react'

import type { Theme, ThemeContextType } from './theme-context-def'

interface ThemeState {
  theme: Theme
  isDark: boolean
}

// Provider del contexto
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ThemeState>(() => {
    // Intentar obtener el tema del localStorage
    const savedTheme = localStorage.getItem('theme') as Theme
    const theme =
      savedTheme && ['light', 'dark'].includes(savedTheme)
        ? savedTheme
        : 'light'

    return {
      theme,
      isDark: theme === 'dark',
    }
  })

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement

    if (state.isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Guardar en localStorage
    localStorage.setItem('theme', state.theme)
  }, [state.theme, state.isDark])

  // Acciones del tema
  const toggleTheme = useCallback(() => {
    setState(prev => ({
      theme: prev.theme === 'light' ? 'dark' : 'light',
      isDark: prev.theme === 'light',
    }))
  }, [])

  const setTheme = useCallback((theme: Theme) => {
    setState({
      theme,
      isDark: theme === 'dark',
    })
  }, [])

  const contextValue: ThemeContextType = useMemo(
    () => ({
      ...state,
      toggleTheme,
      setTheme,
    }),
    [state, toggleTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

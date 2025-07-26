import { Icon } from '../../icons'
import { useTheme } from '../theme.hook'
import './theme-toggle.scss'

export const ThemeToggle = () => {
  const { toggleTheme, isDark } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className='theme-toggle'
      aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
      title={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
    >
      {isDark ? (
        <Icon name='sun' size='sm' className='theme-toggle__icon' />
      ) : (
        <Icon name='moon' size='sm' className='theme-toggle__icon' />
      )}
    </button>
  )
}

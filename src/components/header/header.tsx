import { Icon } from '../icons'
import { ThemeToggle } from '../theme'
import './header.scss'

export interface HeaderProps {
  title: string
  visible?: boolean
  actions?: React.ReactNode
  onMenuToggle?: () => void
  showMenuButton?: boolean
}

export const Header = ({
  title,
  visible = true,
  actions,
  onMenuToggle,
  showMenuButton = true,
}: HeaderProps) => {
  if (!visible) {
    return null
  }

  return (
    <header className='header'>
      <div className='header__container'>
        <div className='header__content'>
          <div className='header__left-section'>
            {showMenuButton && onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className='header__menu-button'
                aria-label='Abrir menú lateral'
              >
                <Icon name='bars' size='lg' />
              </button>
            )}
            <div className='header__title-container'>
              <h1 className='header__title'>{title}</h1>
            </div>
          </div>

          <div className='header__right-section'>
            {actions}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { Icon } from '../icons'
import { ThemeToggle } from '../theme'
import './header.scss'

export interface HeaderProps {
  title: string
  visible?: boolean
  actions?: React.ReactNode
  showMenuButton?: boolean
}

export interface HeaderRef {
  toggleMenu: () => void
  setTitle: (title: string) => void
  isMenuOpen: () => boolean
}

export const Header = forwardRef<HeaderRef, HeaderProps>((props, ref) => {
  const { title, visible = true, actions, showMenuButton = true } = props

  // Estado interno autónomo
  const [currentTitle, setCurrentTitle] = useState(title)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Sincronizar título cuando cambien las props
  useEffect(() => {
    setCurrentTitle(title)
  }, [title])

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen])

  // Exponer métodos a través de ref
  useImperativeHandle(
    ref,
    () => ({
      toggleMenu: () => handleMenuToggle(),
      setTitle: (newTitle: string) => setCurrentTitle(newTitle),
      isMenuOpen: () => isMenuOpen,
    }),
    [isMenuOpen, handleMenuToggle]
  )

  if (!visible) {
    return null
  }

  return (
    <header className='header'>
      <div className='header__container'>
        <div className='header__content'>
          <div className='header__left-section'>
            {showMenuButton && (
              <button
                onClick={handleMenuToggle}
                className='header__menu-button'
                aria-label='Abrir menú lateral'
              >
                <Icon name='bars' size='lg' />
              </button>
            )}
            <div className='header__title-container'>
              <h1 className='header__title'>{currentTitle}</h1>
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
})

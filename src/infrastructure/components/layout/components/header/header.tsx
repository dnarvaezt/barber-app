import { MenuOutlined } from '@ant-design/icons'
import { Button, Layout, Space, Typography } from 'antd'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { ThemeToggle } from '../../../theme'
import './header.scss'

export interface HeaderProps {
  title: string
  visible?: boolean
  actions?: React.ReactNode
  showMenuButton?: boolean
  onMenuClick?: () => void
}

export interface HeaderRef {
  toggleMenu: () => void
  setTitle: (title: string) => void
  isMenuOpen: () => boolean
}

export const Header = forwardRef<HeaderRef, HeaderProps>((props, ref) => {
  const {
    title,
    visible = true,
    actions,
    showMenuButton = true,
    onMenuClick,
  } = props

  // Estado interno autónomo
  const [currentTitle, setCurrentTitle] = useState(title)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Sincronizar título cuando cambien las props
  useEffect(() => {
    setCurrentTitle(title)
  }, [title])

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
    onMenuClick?.()
  }, [isMenuOpen, onMenuClick])

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
    <Layout.Header className='header' role='banner'>
      <div className='header__container'>
        <div className='header__content'>
          <div className='header__left-section'>
            {showMenuButton && (
              <Button
                className='header__menu-button'
                aria-label='Abrir menú lateral'
                type='text'
                shape='circle'
                icon={<MenuOutlined />}
                onClick={handleMenuToggle}
              />
            )}

            <div className='header__title-container'>
              <Typography.Title level={4} className='header__title' ellipsis>
                {currentTitle}
              </Typography.Title>
            </div>
          </div>

          <div className='header__right-section'>
            <Space size={8} align='center'>
              {actions}
              <ThemeToggle />
            </Space>
          </div>
        </div>
      </div>
    </Layout.Header>
  )
})

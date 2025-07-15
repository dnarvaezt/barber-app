import { Icon } from '../icons'
import { ThemeToggle } from '../theme'
import { useHeader } from './header.hook'
import './header.scss'

export const Header = () => {
  const { headerTitle, headerVisible, headerActions, toggleSidebar } =
    useHeader()

  if (!headerVisible) {
    return null
  }

  return (
    <header className='header'>
      <div className='header__container'>
        <div className='header__content'>
          <div className='header__left-section'>
            <button onClick={toggleSidebar} className='header__menu-button'>
              <Icon name='bars' size='lg' />
            </button>
            <div className='header__title-container'>
              <h1 className='header__title'>{headerTitle}</h1>
            </div>
          </div>

          <div className='header__right-section'>
            {headerActions}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

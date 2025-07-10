import { Icon } from './icons'
import { useLayout } from './layout/useLayout'

export const Header = () => {
  const { headerTitle, headerVisible, headerActions, toggleSidebar } =
    useLayout()

  if (!headerVisible) {
    return null
  }

  return (
    <header className='bg-white border-b border-gray-300 shadow-sm sticky top-0 z-30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-14'>
          <div className='flex items-center'>
            <button
              onClick={toggleSidebar}
              className='lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-3 transition-colors duration-200'
            >
              <Icon name='bars' size='lg' />
            </button>
            <div className='flex-shrink-0'>
              <h1 className='text-gray-900 text-lg font-semibold tracking-tight'>
                {headerTitle}
              </h1>
            </div>
          </div>

          <div className='flex items-center space-x-4'>{headerActions}</div>
        </div>
      </div>
    </header>
  )
}

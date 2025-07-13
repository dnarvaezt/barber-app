import { Icon } from './icons'

export const Footer = () => {
  return (
    <footer className='bg-white border-t border-gray-300 shadow-sm dark:bg-gray-900 dark:border-gray-600'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <p className='text-gray-600 text-sm font-medium dark:text-gray-400'>
            Andes Project{' '}
            <span className='ml-2 text-gray-500 dark:text-gray-500'>
              v{__APP_VERSION__}
            </span>
          </p>
          <div className='mt-3 md:mt-0 flex items-center space-x-2'>
            <a
              href='https://github.com/andes-project/filter-docs'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 dark:text-gray-400 dark:hover:text-gray-200'
            >
              <Icon name='fa-brands fa-github' className='w-4 h-4 mr-2' />
              <span className='text-sm font-medium'>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { Icon } from './icons'

export const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <p className='text-gray-400 text-sm'>
            Andes Project <span className='ml-2'>v{__APP_VERSION__}</span>
          </p>
          <div className='mt-4 md:mt-0 flex items-center space-x-2'>
            <a
              href='https://github.com/andes-project/filter-docs'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-gray-400 hover:text-white transition-colors'
            >
              <Icon name='fa-brands fa-github' className='w-4 h-4 mr-2' />
              <span className='text-gray-400 text-sm'>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

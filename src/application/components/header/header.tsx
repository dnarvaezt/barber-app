import React from 'react';
import Icon from './icons';
import { useLayout } from './useLayout';

const Header: React.FC = () => {
  const {
    headerTitle,
    headerSubtitle,
    headerVisible,
    headerActions,
    toggleSidebar,
  } = useLayout();

  if (!headerVisible) {
    return null;
  }

  return (
    <header className='bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            {/* Botón hamburguesa para mobile */}
            <button
              onClick={toggleSidebar}
              className='lg:hidden p-2 rounded-md text-gray-100 hover:text-white hover:bg-white hover:bg-opacity-20 mr-3'
            >
              <Icon name='bars' size='lg' />
            </button>
            <div className='flex-shrink-0'>
              <h1 className='text-white text-xl font-bold tracking-tight'>
                {headerTitle}
              </h1>
              {headerSubtitle && (
                <p className='text-gray-200 text-sm'>{headerSubtitle}</p>
              )}
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            {/* Acciones personalizadas del header */}
            {headerActions}

            {/* Botón de acción por defecto */}
            <button className='p-2 rounded-md text-gray-100 hover:text-white hover:bg-white hover:bg-opacity-20'>
              <Icon name='search' size='lg' />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

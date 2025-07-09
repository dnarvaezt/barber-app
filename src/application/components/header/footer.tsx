import React from 'react';
import Icon from './icons';

const Footer: React.FC = () => {
  return (
    <footer className='bg-gray-800 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Company info */}
          <div className='col-span-1 md:col-span-2'>
            <h3 className='text-lg font-semibold mb-4'>Filter Docs</h3>
            <p className='text-gray-300 mb-4'>
              Documentación completa y ejemplos para el componente Filter de
              Andes Project.
            </p>
            <div className='flex space-x-4'>
              <a href='#' className='text-gray-400 hover:text-white'>
                <Icon name='twitter' size='lg' />
              </a>
              <a href='#' className='text-gray-400 hover:text-white'>
                <Icon name='github' size='lg' />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className='text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4'>
              Enlaces Rápidos
            </h4>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='text-gray-300 hover:text-white'>
                  Documentación
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white'>
                  Ejemplos
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white'>
                  API
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white'>
                  Guías
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className='text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4'>
              Soporte
            </h4>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='text-gray-300 hover:text-white'>
                  Contacto
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white'>
                  Issues
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white'>
                  Discord
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-300 hover:text-white'>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className='mt-8 pt-8 border-t border-gray-700'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-gray-400 text-sm'>
              © 2024 Filter Docs. Todos los derechos reservados.
            </p>
            <div className='mt-4 md:mt-0'>
              <p className='text-gray-400 text-sm'>
                Desarrollado con ❤️ por Andes Project
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

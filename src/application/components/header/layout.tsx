import React from 'react';
import Footer from './footer';
import Header from './header';
import Sidebar from './side-bar';
import { useLayout } from './useLayout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen, overlayVisible, overlayContent, hideOverlay } =
    useLayout();

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Overlay para cerrar sidebar en mobile */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={hideOverlay}
        />
      )}

      {/* Overlay personalizado */}
      {overlayVisible && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
          onClick={hideOverlay}
        >
          <div
            className='bg-white rounded-lg shadow-xl max-w-md w-full p-6'
            onClick={e => e.stopPropagation()}
          >
            {overlayContent}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal - Con margen izquierdo para el sidebar */}
      <div className='lg:ml-64'>
        {/* Header */}
        <Header />

        {/* Body - Se adapta al 100% del alto disponible */}
        <main className='min-h-screen'>{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

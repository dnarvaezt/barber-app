import { Footer } from '../footer'
import { Header } from '../header'
import { Sidebar } from '../side-bar'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900'>
      <Sidebar />

      {/* Contenido principal - Con margen izquierdo para el sidebar */}
      <div className='lg:ml-64'>
        {/* Header */}
        <Header />

        {/* Body - Se adapta al 100% del alto disponible */}
        <main className='min-h-screen bg-gray-50 dark:bg-gray-800'>
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

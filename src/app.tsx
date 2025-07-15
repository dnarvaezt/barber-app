import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout, LayoutProvider } from './components'
import { ThemeProvider } from './components/theme'
import { appRoutes, useRoutes } from './routes'

export const App = () => {
  const { getPages } = useRoutes()
  const pages = getPages()

  return (
    <ThemeProvider>
      <LayoutProvider initialSidebarItems={appRoutes}>
        <Layout>
          <Suspense
            fallback={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                  fontSize: '1.2rem',
                  color: 'var(--text-color)',
                }}
              >
                Cargando...
              </div>
            }
          >
            <Routes>
              {pages.map(page => (
                <Route
                  key={page.path}
                  path={page.path}
                  element={<page.component />}
                />
              ))}
              {/* Redirigir rutas no encontradas a la página de inicio */}
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </LayoutProvider>
    </ThemeProvider>
  )
}

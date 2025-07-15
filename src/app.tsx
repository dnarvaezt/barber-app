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
        </Layout>
      </LayoutProvider>
    </ThemeProvider>
  )
}

import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './infrastructure/components/layout'
import { ThemeProvider } from './infrastructure/components/theme'
import { appRoutes, RouteIds, useRoutes } from './infrastructure/routes'

export const App = () => {
  const { getPages, getRoutePathById } = useRoutes()
  const pages = getPages()

  return (
    <ThemeProvider>
      <Layout sidebarItems={appRoutes}>
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
            <Route
              path='*'
              element={
                <Navigate
                  to={getRoutePathById(RouteIds.NOT_FOUND) || '/404'}
                  replace
                />
              }
            />
          </Routes>
        </Suspense>
      </Layout>
    </ThemeProvider>
  )
}

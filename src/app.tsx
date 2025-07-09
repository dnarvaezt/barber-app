import { Navigate, Route, Routes } from 'react-router-dom'
import { appMenuItems } from './app.menu'
import { appPageList } from './app.pages'
import { Layout, LayoutProvider } from './components'
import { useBasePath } from './hooks'

function App() {
  const basePath = useBasePath()

  return (
    <LayoutProvider initialSidebarItems={appMenuItems}>
      <Layout>
        <Routes>
          {appPageList.map(page => (
            <Route
              key={page.path}
              path={page.path}
              element={<page.component />}
            />
          ))}
          {/* Redirigir rutas no encontradas a la página de inicio */}
          <Route path='*' element={<Navigate to={basePath} replace />} />
        </Routes>
      </Layout>
    </LayoutProvider>
  )
}

export default App

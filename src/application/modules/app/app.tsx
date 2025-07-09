import './app.scss';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout, LayoutProvider } from '../../components';
import Icon from '../../components/header/icons';
import DocumentationPage from '../pages/DocumentationPage';
import ExamplesPage from '../pages/ExamplesPage';
import HomePage from '../pages/HomePage';

// Definir las páginas disponibles
const pages = [
  {
    path: '/',
    name: 'Inicio',
    component: HomePage,
  },
  {
    path: '/documentation',
    name: 'Documentación',
    component: DocumentationPage,
  },
  {
    path: '/examples',
    name: 'Ejemplos',
    component: ExamplesPage,
  },
];

// Definir elementos del sidebar
const sidebarItems = [
  {
    id: 'home',
    title: 'Inicio',
    path: '/',
    icon: <Icon name='home' />,
  },
  {
    id: 'getting-started',
    title: 'Primeros Pasos',
    icon: <Icon name='file' />,
    children: [
      {
        id: 'installation',
        title: 'Instalación',
        path: '/documentation#installation',
      },
      {
        id: 'quick-start',
        title: 'Inicio Rápido',
        path: '/documentation#quick-start',
      },
      {
        id: 'configuration',
        title: 'Configuración',
        path: '/documentation#configuration',
      },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: <Icon name='code' />,
    children: [
      {
        id: 'components',
        title: 'Componentes',
        path: '/api/components',
      },
      {
        id: 'hooks',
        title: 'Hooks',
        path: '/api/hooks',
      },
      {
        id: 'utilities',
        title: 'Utilidades',
        path: '/api/utilities',
      },
    ],
  },
  {
    id: 'examples-section',
    title: 'Ejemplos',
    icon: <Icon name='code' />,
    children: [
      {
        id: 'basic-example',
        title: 'Ejemplo Básico',
        path: '/examples#basic',
      },
      {
        id: 'advanced-example',
        title: 'Ejemplo Avanzado',
        path: '/examples#advanced',
      },
      {
        id: 'custom-example',
        title: 'Ejemplo Personalizado',
        path: '/examples#custom',
      },
    ],
  },
  {
    id: 'guides',
    title: 'Guías',
    icon: <Icon name='book' />,
    children: [
      {
        id: 'best-practices',
        title: 'Mejores Prácticas',
        path: '/guides/best-practices',
      },
      {
        id: 'migration',
        title: 'Migración',
        path: '/guides/migration',
      },
      {
        id: 'performance',
        title: 'Optimización',
        path: '/guides/performance',
      },
    ],
  },
  {
    id: 'tips',
    title: 'Tips y Trucos',
    icon: <Icon name='lightbulb' />,
    path: '/tips',
  },
  {
    id: 'settings',
    title: 'Configuración',
    icon: <Icon name='cog' />,
    path: '/settings',
  },
];

function App() {
  return (
    <LayoutProvider initialSidebarItems={sidebarItems}>
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
  );
}

export default App;

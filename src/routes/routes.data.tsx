import { Icon } from '../components'
import { lazyRoute } from './lazy'
import type { RouteItem } from './routes.types'

export const appRoutes: RouteItem[] = [
  {
    id: 'home',
    name: 'Información',
    title: 'Información',
    icon: <Icon name='home' />,
    component: lazyRoute('home-page', 'HomePage'),
    path: '/',
    children: [],
  },
  {
    id: 'technical-documentation',
    name: 'Documentación Técnica',
    title: 'Documentación Técnica',
    icon: <Icon name='home' />,
    component: lazyRoute(
      'technical-documentation-page',
      'TechnicalDocumentationPage'
    ),
    path: '/technical-documentation',
    children: [],
  },
]

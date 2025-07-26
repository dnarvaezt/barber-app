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
    id: 'clients',
    name: 'Clientes',
    title: 'Gestión de Clientes',
    icon: <Icon name='users' />,
    component: lazyRoute('client-page', 'ClientPage'),
    path: '/clients',
    children: [],
  },
]

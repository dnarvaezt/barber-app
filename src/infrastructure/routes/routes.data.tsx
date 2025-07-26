import { Icon } from '../components'
import { lazyRoute } from './lazy'
import type { RouteItem } from './routes.types'

export const appRoutes: RouteItem[] = [
  {
    id: 'client',
    name: 'Cliente',
    title: 'Gestión de Cliente',
    icon: <Icon name='user' />,
    component: lazyRoute('client-page', 'ClientPage'),
    path: '/clients',
    children: [
      {
        id: 'client-form-new',
        name: 'Nuevo Cliente',
        title: 'Crear Nuevo Cliente',
        icon: <Icon name='user' />,
        component: lazyRoute('client-form', 'ClientFormPage'),
        path: '/form/new',
        inheritPath: true,
        internal: true,
        children: [],
      },
      {
        id: 'client-detail',
        name: 'Detalle Cliente',
        title: 'Detalle del Cliente',
        icon: <Icon name='user' />,
        component: lazyRoute('client-detail', 'ClientDetailPage'),
        path: '/:clientId',
        inheritPath: true,
        internal: true,
        children: [],
      },
      {
        id: 'client-form-edit',
        name: 'Editar Cliente',
        title: 'Editar Cliente',
        icon: <Icon name='user' />,
        component: lazyRoute('client-form', 'ClientFormPage'),
        path: '/form/:clientId',
        inheritPath: true,
        internal: true,
        children: [],
      },
    ],
  },
  {
    id: 'not-found',
    name: 'Página No Encontrada',
    title: '404 - Página No Encontrada',
    icon: <Icon name='alert' />,
    component: lazyRoute('not-found', 'NotFoundPage'),
    path: '/404',
    internal: true,
    children: [],
  },
]

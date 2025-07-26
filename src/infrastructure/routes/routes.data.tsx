import { Icon } from '../components/icons'
import { lazyRoute } from './lazy'
import { RouteIds } from './routes.constants'
import type { RouteItem } from './routes.types'

const userIcon = <Icon name='user' />
const alertIcon = <Icon name='alert' />

export const appRoutes: RouteItem[] = [
  {
    id: RouteIds.CLIENT,
    name: 'Cliente',
    title: 'Gestión de Cliente',
    icon: userIcon,
    component: lazyRoute('client-page', 'ClientPage'),
    path: '/clients',
    children: [
      {
        id: RouteIds.CLIENT_FORM_NEW,
        name: 'Nuevo Cliente',
        title: 'Crear Nuevo Cliente',
        icon: userIcon,
        component: lazyRoute('client-form', 'ClientFormPage'),
        path: '/form/new',
        inheritPath: true,
        internal: true,
        children: [],
      },
      {
        id: RouteIds.CLIENT_DETAIL,
        name: 'Detalle Cliente',
        title: 'Detalle del Cliente',
        icon: userIcon,
        component: lazyRoute('client-detail', 'ClientDetailPage'),
        path: '/:clientId',
        inheritPath: true,
        internal: true,
        children: [],
      },
      {
        id: RouteIds.CLIENT_FORM_EDIT,
        name: 'Editar Cliente',
        title: 'Editar Cliente',
        icon: userIcon,
        component: lazyRoute('client-form', 'ClientFormPage'),
        path: '/form/:clientId',
        inheritPath: true,
        internal: true,
        children: [],
      },
    ],
  },
  {
    id: RouteIds.NOT_FOUND,
    name: 'Página No Encontrada',
    title: '404 - Página No Encontrada',
    icon: alertIcon,
    component: lazyRoute('not-found', 'NotFoundPage'),
    path: '/404',
    internal: true,
    children: [],
  },
]

import { Icon } from '../components/icons'
import { lazyRoute } from './lazy'
import { RouteIds } from './routes.constants'
import type { RouteItem } from './routes.types'

const userIcon = <Icon name='user' />
const employeeIcon = <Icon name='user' />
const alertIcon = <Icon name='exclamation-triangle' />
const homeIcon = <Icon name='home' />

export const appRoutes: RouteItem[] = [
  {
    id: RouteIds.DASHBOARD,
    name: 'Dashboard',
    title: 'Dashboard',
    icon: homeIcon,
    component: lazyRoute('dashboard', 'DashboardPage'),
    path: '/',
    hideSidebar: false,
    children: [],
  },
  {
    id: RouteIds.CLIENT,
    name: 'Clientes',
    title: 'Gestión de Clientes',
    icon: userIcon,
    component: lazyRoute('client-page', 'ClientPage'),
    path: '/clients',
    hideSidebar: false,
    children: [
      {
        id: RouteIds.CLIENT_FORM_NEW,
        name: 'Nuevo Cliente',
        title: 'Crear Nuevo Cliente',
        icon: userIcon,
        component: lazyRoute('client-form', 'ClientFormPage'),
        path: '/form/new',
        inheritPath: true,
        hideSidebar: true,
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
        hideSidebar: true,
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
        hideSidebar: true,
        children: [],
      },
    ],
  },
  {
    id: RouteIds.EMPLOYEES,
    name: 'Empleados',
    title: 'Gestión de Empleados',
    icon: employeeIcon,
    component: lazyRoute('employee-page', 'EmployeePage'),
    path: '/employees',
    hideSidebar: false,
    children: [
      {
        id: RouteIds.EMPLOYEE_FORM_NEW,
        name: 'Nuevo Empleado',
        title: 'Crear Nuevo Empleado',
        icon: userIcon,
        component: lazyRoute('employee-form', 'EmployeeForm'),
        path: '/form/new',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.EMPLOYEE_FORM_EDIT,
        name: 'Editar Empleado',
        title: 'Editar Empleado',
        icon: userIcon,
        component: lazyRoute('employee-form', 'EmployeeForm'),
        path: '/form/:employeeId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.EMPLOYEE_DETAIL,
        name: 'Detalle Empleado',
        title: 'Detalle del Empleado',
        icon: userIcon,
        component: lazyRoute('employee-detail', 'EmployeeDetail'),
        path: '/:employeeId',
        inheritPath: true,
        hideSidebar: true,
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
    hideSidebar: true,
    children: [],
  },
]

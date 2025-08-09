import { Icon } from '../components/icons'
import { lazyRoute } from './lazy'
import { RouteIds } from './routes.constants'
import type { RouteItem } from './routes.types'

const userIcon = <Icon name='user' />
const employeeIcon = <Icon name='user' />
const categoryIcon = <Icon name='tag' />
const activityIcon = <Icon name='briefcase' />
const productIcon = <Icon name='box' />
const stockIcon = <Icon name='boxes-stacked' />
const invoiceIcon = <Icon name='file-invoice-dollar' />
const alertIcon = <Icon name='exclamation-triangle' />
const calendarIcon = <Icon name='calendar' />
const homeIcon = <Icon name='home' />

export const appRoutes: RouteItem[] = [
  {
    id: RouteIds.APPOINTMENTS,
    name: 'Citas',
    title: 'Gestión de Citas',
    icon: calendarIcon,
    component: lazyRoute(
      () => import('../modules/appointment/appointment-page'),
      'AppointmentPage'
    ),
    path: '/appointments',
    hideSidebar: false,
    children: [
      {
        id: RouteIds.APPOINTMENT_FORM_NEW,
        name: 'Nueva Cita',
        title: 'Crear Nueva Cita',
        icon: calendarIcon,
        component: lazyRoute(
          () => import('../modules/appointment/appointment-form'),
          'AppointmentForm'
        ),
        path: '/form/new',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.APPOINTMENT_FORM_EDIT,
        name: 'Editar Cita',
        title: 'Editar Cita',
        icon: calendarIcon,
        component: lazyRoute(
          () => import('../modules/appointment/appointment-form'),
          'AppointmentForm'
        ),
        path: '/form/:appointmentId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.APPOINTMENT_DETAIL,
        name: 'Detalle Cita',
        title: 'Detalle de la Cita',
        icon: calendarIcon,
        component: lazyRoute(
          () => import('../modules/appointment/appointment-detail'),
          'AppointmentDetail'
        ),
        path: '/:appointmentId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
    ],
  },
  {
    id: RouteIds.INVOICES,
    name: 'Facturas',
    title: 'Gestión de Facturas',
    icon: invoiceIcon,
    component: lazyRoute(
      () => import('../modules/invoice/invoice-page'),
      'InvoicePage'
    ),
    path: '/invoices',
    hideSidebar: false,
    children: [
      {
        id: RouteIds.INVOICE_FORM_NEW,
        name: 'Nueva Factura',
        title: 'Crear Nueva Factura',
        icon: invoiceIcon,
        component: lazyRoute(
          () => import('../modules/invoice/invoice-form'),
          'InvoiceForm'
        ),
        path: '/form/new',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.INVOICE_FORM_EDIT,
        name: 'Editar Factura',
        title: 'Editar Factura',
        icon: invoiceIcon,
        component: lazyRoute(
          () => import('../modules/invoice/invoice-form'),
          'InvoiceForm'
        ),
        path: '/form/:invoiceId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.INVOICE_DETAIL,
        name: 'Detalle Factura',
        title: 'Detalle de la Factura',
        icon: invoiceIcon,
        component: lazyRoute(
          () => import('../modules/invoice/invoice-detail'),
          'InvoiceDetail'
        ),
        path: '/:invoiceId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
    ],
  },
  {
    id: RouteIds.DASHBOARD,
    name: 'Dashboard',
    title: 'Dashboard',
    icon: homeIcon,
    component: lazyRoute(() => import('../modules/dashboard'), 'DashboardPage'),
    path: '/',
    hideSidebar: false,
    children: [],
  },
  {
    id: RouteIds.CLIENT,
    name: 'Clientes',
    title: 'Gestión de Clientes',
    icon: userIcon,
    component: lazyRoute(
      () => import('../modules/client/client-page'),
      'ClientPage'
    ),
    path: '/clients',
    hideSidebar: false,
    children: [
      {
        id: RouteIds.CLIENT_FORM_NEW,
        name: 'Nuevo Cliente',
        title: 'Crear Nuevo Cliente',
        icon: userIcon,
        component: lazyRoute(
          () => import('../modules/client/client-form'),
          'ClientForm'
        ),
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
        component: lazyRoute(
          () => import('../modules/client/client-form'),
          'ClientForm'
        ),
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
        component: lazyRoute(
          () => import('../modules/client/client-detail'),
          'ClientDetail'
        ),
        path: '/:clientId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.CLIENT_INVOICES,
        name: 'Facturas del Cliente',
        title: 'Facturas del Cliente',
        icon: invoiceIcon,
        component: lazyRoute(
          () => import('../modules/client/client-invoices'),
          'ClientInvoicesPage'
        ),
        path: '/:clientId/invoices',
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
    component: lazyRoute(
      () => import('../modules/employee/employee-page'),
      'EmployeePage'
    ),
    path: '/employees',
    hideSidebar: false,
    children: [
      {
        id: RouteIds.EMPLOYEE_FORM_NEW,
        name: 'Nuevo Empleado',
        title: 'Crear Nuevo Empleado',
        icon: userIcon,
        component: lazyRoute(
          () => import('../modules/employee/employee-form'),
          'EmployeeForm'
        ),
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
        component: lazyRoute(
          () => import('../modules/employee/employee-form'),
          'EmployeeForm'
        ),
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
        component: lazyRoute(
          () => import('../modules/employee/employee-detail'),
          'EmployeeDetail'
        ),
        path: '/:employeeId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.EMPLOYEE_SERVICE_HISTORY,
        name: 'Historial de Servicios',
        title: 'Historial de Servicios por Empleado',
        icon: activityIcon,
        component: lazyRoute(
          () => import('../modules/employee/employee-service-history'),
          'EmployeeServiceHistoryPage'
        ),
        path: '/:employeeId/history',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
    ],
  },
  {
    id: RouteIds.CATEGORIES,
    name: 'Categorías',
    title: 'Gestión de Categorías',
    icon: categoryIcon,
    component: lazyRoute(
      () => import('../modules/category/category-page'),
      'CategoryPage'
    ),
    path: '/categories',
    hideSidebar: false,
    children: [
      {
        id: RouteIds.CATEGORY_FORM_NEW,
        name: 'Nueva Categoría',
        title: 'Crear Nueva Categoría',
        icon: categoryIcon,
        component: lazyRoute(
          () => import('../modules/category/category-form'),
          'CategoryForm'
        ),
        path: '/form/new',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.CATEGORY_FORM_EDIT,
        name: 'Editar Categoría',
        title: 'Editar Categoría',
        icon: categoryIcon,
        component: lazyRoute(
          () => import('../modules/category/category-form'),
          'CategoryForm'
        ),
        path: '/form/:categoryId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.CATEGORY_DETAIL,
        name: 'Detalle Categoría',
        title: 'Detalle de la Categoría',
        icon: categoryIcon,
        component: lazyRoute(
          () => import('../modules/category/category-detail'),
          'CategoryDetail'
        ),
        path: '/:categoryId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
    ],
  },
  {
    id: RouteIds.ACTIVITIES,
    name: 'Actividades',
    title: 'Gestión de Actividades',
    icon: activityIcon,
    component: lazyRoute(
      () => import('../modules/activity/activity-page'),
      'ActivityPage'
    ),
    path: '/activities',
    hideSidebar: false,
    children: [
      {
        id: RouteIds.ACTIVITY_FORM_NEW,
        name: 'Nueva Actividad',
        title: 'Crear Nueva Actividad',
        icon: activityIcon,
        component: lazyRoute(
          () => import('../modules/activity/activity-form'),
          'ActivityForm'
        ),
        path: '/form/new',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.ACTIVITY_FORM_EDIT,
        name: 'Editar Actividad',
        title: 'Editar Actividad',
        icon: activityIcon,
        component: lazyRoute(
          () => import('../modules/activity/activity-form'),
          'ActivityForm'
        ),
        path: '/form/:activityId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.ACTIVITY_DETAIL,
        name: 'Detalle Actividad',
        title: 'Detalle de la Actividad',
        icon: activityIcon,
        component: lazyRoute(
          () => import('../modules/activity/activity-detail'),
          'ActivityDetail'
        ),
        path: '/:activityId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
    ],
  },
  {
    id: RouteIds.STOCK,
    name: 'Stock',
    title: 'Gestión de Stock',
    icon: stockIcon,
    component: lazyRoute(
      () => import('../modules/stock/stock-page'),
      'StockPage'
    ),
    path: '/stock',
    hideSidebar: false,
    children: [
      {
        id: RouteIds.STOCK_MOVEMENTS,
        name: 'Movimientos por Producto',
        title: 'Movimientos por Producto',
        icon: stockIcon,
        component: lazyRoute(
          () => import('../modules/stock/stock-movement-page'),
          'StockMovementPage'
        ),
        path: '/:productId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
    ],
  },
  {
    id: RouteIds.PRODUCTS,
    name: 'Productos',
    title: 'Gestión de Productos',
    icon: productIcon,
    component: lazyRoute(
      () => import('../modules/product/product-page'),
      'ProductPage'
    ),
    path: '/products',
    hideSidebar: false,
    children: [
      {
        id: RouteIds.PRODUCT_FORM_NEW,
        name: 'Nuevo Producto',
        title: 'Crear Nuevo Producto',
        icon: productIcon,
        component: lazyRoute(
          () => import('../modules/product/product-form'),
          'ProductForm'
        ),
        path: '/form/new',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.PRODUCT_FORM_EDIT,
        name: 'Editar Producto',
        title: 'Editar Producto',
        icon: productIcon,
        component: lazyRoute(
          () => import('../modules/product/product-form'),
          'ProductForm'
        ),
        path: '/form/:productId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
      {
        id: RouteIds.PRODUCT_DETAIL,
        name: 'Detalle Producto',
        title: 'Detalle del Producto',
        icon: productIcon,
        component: lazyRoute(
          () => import('../modules/product/product-detail'),
          'ProductDetail'
        ),
        path: '/:productId',
        inheritPath: true,
        hideSidebar: true,
        children: [],
      },
    ],
  },
  {
    id: RouteIds.NOT_FOUND,
    name: '404',
    title: 'Página No Encontrada',
    icon: alertIcon,
    component: lazyRoute(() => import('../modules/not-found'), 'NotFoundPage'),
    path: '/404',
    hideSidebar: true,
    children: [],
  },
]

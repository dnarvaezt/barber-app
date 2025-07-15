import { Icon } from '../components'
import { HomePage, TechnicalDocumentationPage } from '../modules'
import { DatasetExplorer } from '../modules/dataset-explorer'
import type { RouteItem } from './routes.types'

export const appRoutes: RouteItem[] = [
  {
    id: 'home',
    name: 'Información',
    title: 'Información',
    icon: <Icon name='home' />,
    component: HomePage,
    path: '/',
    children: [],
  },
  {
    id: 'technical-documentation',
    name: 'Documentación Técnica',
    title: 'Documentación Técnica',
    icon: <Icon name='home' />,
    component: TechnicalDocumentationPage,
    path: '/technical-documentation',
    children: [],
  },
  {
    id: 'dataset-explorer',
    name: 'Explorador de Datasets',
    title: 'Explorador de Datasets',
    icon: <Icon name='fa-solid fa-database' />,
    component: DatasetExplorer,
    path: '/dataset-explorer',
    children: [],
  },
]

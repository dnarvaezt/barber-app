// ============================================================================
// ENTITY CONFIGURATION - Configuración centralizada para entidades
// ============================================================================

export interface EntityConfig {
  entityType: string
  displayName: string
  displayNamePlural: string
  routePath: string
  searchableFields: string[]
  sortableFields: Array<{
    key: string
    label: string
  }>
  defaultSortBy: string
  defaultSortOrder: 'asc' | 'desc'
  defaultPageSize: number
  pageSizeOptions: number[]
  validationRules: Record<string, any>
  permissions: {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
  }
}

// ============================================================================
// ENTITY CONFIGURATIONS - Configuraciones específicas por entidad
// ============================================================================

export const CLIENT_CONFIG: EntityConfig = {
  entityType: 'client',
  displayName: 'Cliente',
  displayNamePlural: 'Clientes',
  routePath: '/clients',
  searchableFields: ['name', 'phoneNumber', 'email'],
  sortableFields: [
    { key: 'name', label: 'Nombre' },
    { key: 'phoneNumber', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'birthDate', label: 'Fecha de Nacimiento' },
    { key: 'createdAt', label: 'Fecha de Creación' },
  ],
  defaultSortBy: 'name',
  defaultSortOrder: 'asc',
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  validationRules: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    phoneNumber: {
      required: true,
      pattern: /^[+]?[0-9\s\-()]{7,15}$/,
    },
    email: {
      required: false,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    birthDate: {
      required: true,
      type: 'date',
      maxDate: new Date(),
    },
  },
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
  },
}

export const EMPLOYEE_CONFIG: EntityConfig = {
  entityType: 'employee',
  displayName: 'Empleado',
  displayNamePlural: 'Empleados',
  routePath: '/employees',
  searchableFields: ['name', 'phoneNumber', 'email', 'position'],
  sortableFields: [
    { key: 'name', label: 'Nombre' },
    { key: 'phoneNumber', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'position', label: 'Cargo' },
    { key: 'birthDate', label: 'Fecha de Nacimiento' },
    { key: 'createdAt', label: 'Fecha de Creación' },
  ],
  defaultSortBy: 'name',
  defaultSortOrder: 'asc',
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  validationRules: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    phoneNumber: {
      required: true,
      pattern: /^[+]?[0-9\s\-()]{7,15}$/,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    position: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    birthDate: {
      required: true,
      type: 'date',
      maxDate: new Date(),
    },
  },
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: true,
  },
}

export const USER_CONFIG: EntityConfig = {
  entityType: 'user',
  displayName: 'Usuario',
  displayNamePlural: 'Usuarios',
  routePath: '/users',
  searchableFields: ['name', 'email', 'username'],
  sortableFields: [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'username', label: 'Usuario' },
    { key: 'createdAt', label: 'Fecha de Creación' },
  ],
  defaultSortBy: 'name',
  defaultSortOrder: 'asc',
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  validationRules: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    username: {
      required: true,
      minLength: 3,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9_]+$/,
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/,
    },
  },
  permissions: {
    create: true,
    read: true,
    update: true,
    delete: false, // Los usuarios no se pueden eliminar, solo desactivar
  },
}

// ============================================================================
// ENTITY CONFIG REGISTRY - Registro centralizado de configuraciones
// ============================================================================

export class EntityConfigRegistry {
  private static instance: EntityConfigRegistry
  private configs = new Map<string, EntityConfig>()

  private constructor() {
    this.registerConfig(CLIENT_CONFIG)
    this.registerConfig(EMPLOYEE_CONFIG)
    this.registerConfig(USER_CONFIG)
  }

  static getInstance(): EntityConfigRegistry {
    if (!EntityConfigRegistry.instance) {
      EntityConfigRegistry.instance = new EntityConfigRegistry()
    }
    return EntityConfigRegistry.instance
  }

  registerConfig(config: EntityConfig): void {
    this.configs.set(config.entityType, config)
  }

  getConfig(entityType: string): EntityConfig | undefined {
    return this.configs.get(entityType)
  }

  getAllConfigs(): EntityConfig[] {
    return Array.from(this.configs.values())
  }

  hasConfig(entityType: string): boolean {
    return this.configs.has(entityType)
  }

  clear(): void {
    this.configs.clear()
  }
}

// ============================================================================
// UTILITY FUNCTIONS - Funciones de utilidad para configuraciones
// ============================================================================

export function getEntityConfig(entityType: string): EntityConfig | undefined {
  return EntityConfigRegistry.getInstance().getConfig(entityType)
}

export function getAllEntityConfigs(): EntityConfig[] {
  return EntityConfigRegistry.getInstance().getAllConfigs()
}

export function hasEntityConfig(entityType: string): boolean {
  return EntityConfigRegistry.getInstance().hasConfig(entityType)
}

export function validateEntityConfig(config: EntityConfig): boolean {
  const requiredFields = [
    'entityType',
    'displayName',
    'displayNamePlural',
    'routePath',
    'searchableFields',
    'sortableFields',
    'defaultSortBy',
    'defaultSortOrder',
    'defaultPageSize',
    'pageSizeOptions',
    'validationRules',
    'permissions',
  ]

  return requiredFields.every(field => field in config)
}

export function createEntityConfig(
  partialConfig: Partial<EntityConfig>
): EntityConfig {
  const defaultConfig: EntityConfig = {
    entityType: '',
    displayName: '',
    displayNamePlural: '',
    routePath: '',
    searchableFields: [],
    sortableFields: [],
    defaultSortBy: 'name',
    defaultSortOrder: 'asc',
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
    validationRules: {},
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  }

  return { ...defaultConfig, ...partialConfig }
}

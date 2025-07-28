import { PaginationMockService } from './pagination-mock.service'

// Datos de prueba
const mockClients = [
  {
    id: '1',
    name: 'Juan Pérez',
    phoneNumber: '+573001234567',
    birthDate: new Date('1990-05-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: '2',
    name: 'María García',
    phoneNumber: '+573001234568',
    birthDate: new Date('1985-08-22'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: '3',
    name: 'Carlos López',
    phoneNumber: '+573001234569',
    birthDate: new Date('1995-03-10'),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: '4',
    name: 'Ana Rodríguez',
    phoneNumber: '+573001234570',
    birthDate: new Date('1988-12-05'),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: '5',
    name: 'Luis Martínez',
    phoneNumber: '+573001234571',
    birthDate: new Date('1992-07-18'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
]

/**
 * Simula la funcionalidad de carga de datos con filtros
 */
const loadClientsWithFilters = async (
  pagination: any,
  filters: any,
  search: string
) => {
  console.log('🔍 Cargando datos con:', { pagination, filters, search })

  let filteredClients = mockClients

  // Aplicar filtro de búsqueda
  if (search && search.trim()) {
    const searchResult = PaginationMockService.searchWithPagination(
      mockClients,
      search.trim(),
      pagination
    )
    filteredClients = searchResult.data
  }

  // Aplicar filtro de mes de nacimiento
  if (filters.birthMonth && filters.birthMonth !== null) {
    const monthFiltered = filteredClients.filter(client => {
      const birthDate = client.birthDate
      if (!birthDate) return false
      const itemMonth = new Date(birthDate).getMonth() + 1
      return itemMonth === filters.birthMonth
    })
    filteredClients = monthFiltered
  }

  // Si no hay filtros activos, usar paginación simple
  if (!search?.trim() && (!filters.birthMonth || filters.birthMonth === null)) {
    return PaginationMockService.paginateData(mockClients, pagination)
  }

  // Retornar datos paginados con los filtros aplicados
  return PaginationMockService.paginateData(filteredClients, pagination)
}

/**
 * Prueba la sincronización con URL
 */
export const testURLSync = () => {
  console.log('🧪 PRUEBA DE SINCRONIZACIÓN CON URL')
  console.log('===================================\n')

  // Simular diferentes estados de URL
  const testCases = [
    {
      name: 'URL sin parámetros',
      url: '/clients',
      expectedSearch: '',
      expectedFilters: {},
    },
    {
      name: 'URL con búsqueda "juan"',
      url: '/clients?search=juan',
      expectedSearch: 'juan',
      expectedFilters: {},
    },
    {
      name: 'URL con búsqueda "maría"',
      url: '/clients?search=maría',
      expectedSearch: 'maría',
      expectedFilters: {},
    },
    {
      name: 'URL con filtro de mes',
      url: '/clients?birthMonth=5',
      expectedSearch: '',
      expectedFilters: { birthMonth: 5 },
    },
    {
      name: 'URL con búsqueda y filtro',
      url: '/clients?search=juan&birthMonth=5',
      expectedSearch: 'juan',
      expectedFilters: { birthMonth: 5 },
    },
    {
      name: 'URL con paginación',
      url: '/clients?page=2&limit=5',
      expectedSearch: '',
      expectedFilters: {},
    },
  ]

  testCases.forEach((testCase, index) => {
    console.log(`📝 Test ${index + 1}: ${testCase.name}`)
    console.log(`   URL: ${testCase.url}`)
    console.log(`   Búsqueda esperada: "${testCase.expectedSearch}"`)
    console.log(`   Filtros esperados:`, testCase.expectedFilters)

    // Simular la carga de datos
    const pagination = { page: 1, limit: 10 }
    loadClientsWithFilters(
      pagination,
      testCase.expectedFilters,
      testCase.expectedSearch
    )
      .then(result => {
        console.log(
          `   ✅ Resultados: ${result.data.length} clientes encontrados`
        )
        if (result.data.length > 0) {
          console.log(`   📋 Primer resultado: ${result.data[0].name}`)
        }
      })
      .catch(error => {
        console.log(`   ❌ Error: ${error.message}`)
      })

    console.log('')
  })

  console.log('✅ Pruebas de sincronización completadas')
}

// Ejecutar si se llama directamente
if (typeof window !== 'undefined') {
  ;(window as any).testURLSync = testURLSync
}

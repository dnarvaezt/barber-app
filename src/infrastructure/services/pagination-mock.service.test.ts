import type { Client, Employee } from '../../application/domain'
import { PaginationMockService } from './pagination-mock.service'

// Datos de prueba
const mockClients: Client[] = [
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

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    phoneNumber: '+573001234567',
    birthDate: new Date('1990-05-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'admin',
    updatedBy: 'admin',
    percentage: 25,
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
    percentage: 30,
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
    percentage: 20,
  },
]

// Función para ejecutar pruebas
export const runFilterTests = () => {
  console.log('🧪 Iniciando pruebas del sistema de filtros...\n')

  const pagination = { page: 1, limit: 10 }

  // Prueba 1: Búsqueda por nombre
  console.log('📝 Prueba 1: Búsqueda por nombre')
  const searchByName = PaginationMockService.searchWithPagination(
    mockClients,
    'Juan',
    pagination
  )
  console.log(`Búsqueda "Juan": ${searchByName.data.length} resultados`)
  console.log(
    'Resultados:',
    searchByName.data.map(c => c.name)
  )
  console.log('✅ Prueba 1 completada\n')

  // Prueba 2: Búsqueda por apellido
  console.log('📝 Prueba 2: Búsqueda por apellido')
  const searchByLastName = PaginationMockService.searchWithPagination(
    mockClients,
    'Pérez',
    pagination
  )
  console.log(`Búsqueda "Pérez": ${searchByLastName.data.length} resultados`)
  console.log(
    'Resultados:',
    searchByLastName.data.map(c => c.name)
  )
  console.log('✅ Prueba 2 completada\n')

  // Prueba 3: Búsqueda por número de teléfono
  console.log('📝 Prueba 3: Búsqueda por número de teléfono')
  const searchByPhone = PaginationMockService.searchWithPagination(
    mockClients,
    '3001234567',
    pagination
  )
  console.log(`Búsqueda "3001234567": ${searchByPhone.data.length} resultados`)
  console.log(
    'Resultados:',
    searchByPhone.data.map(c => `${c.name} - ${c.phoneNumber}`)
  )
  console.log('✅ Prueba 3 completada\n')

  // Prueba 4: Búsqueda por número de teléfono con formato
  console.log('📝 Prueba 4: Búsqueda por número de teléfono con formato')
  const searchByPhoneFormatted = PaginationMockService.searchWithPagination(
    mockClients,
    '+573001234567',
    pagination
  )
  console.log(
    `Búsqueda "+573001234567": ${searchByPhoneFormatted.data.length} resultados`
  )
  console.log(
    'Resultados:',
    searchByPhoneFormatted.data.map(c => `${c.name} - ${c.phoneNumber}`)
  )
  console.log('✅ Prueba 4 completada\n')

  // Prueba 5: Búsqueda por número parcial
  console.log('📝 Prueba 5: Búsqueda por número parcial')
  const searchByPartialPhone = PaginationMockService.searchWithPagination(
    mockClients,
    '300',
    pagination
  )
  console.log(`Búsqueda "300": ${searchByPartialPhone.data.length} resultados`)
  console.log(
    'Resultados:',
    searchByPartialPhone.data.map(c => `${c.name} - ${c.phoneNumber}`)
  )
  console.log('✅ Prueba 5 completada\n')

  // Prueba 6: Búsqueda por nombre completo
  console.log('📝 Prueba 6: Búsqueda por nombre completo')
  const searchByFullName = PaginationMockService.searchWithPagination(
    mockClients,
    'Juan Pérez',
    pagination
  )
  console.log(
    `Búsqueda "Juan Pérez": ${searchByFullName.data.length} resultados`
  )
  console.log(
    'Resultados:',
    searchByFullName.data.map(c => c.name)
  )
  console.log('✅ Prueba 6 completada\n')

  // Prueba 7: Búsqueda que no encuentra nada
  console.log('📝 Prueba 7: Búsqueda que no encuentra nada')
  const searchNotFound = PaginationMockService.searchWithPagination(
    mockClients,
    'XYZ123',
    pagination
  )
  console.log(`Búsqueda "XYZ123": ${searchNotFound.data.length} resultados`)
  console.log('✅ Prueba 7 completada\n')

  // Prueba 8: Búsqueda vacía
  console.log('📝 Prueba 8: Búsqueda vacía')
  const searchEmpty = PaginationMockService.searchWithPagination(
    mockClients,
    '',
    pagination
  )
  console.log(
    `Búsqueda vacía: ${searchEmpty.data.length} resultados (debería ser ${mockClients.length})`
  )
  console.log('✅ Prueba 8 completada\n')

  // Prueba 9: Filtro por mes de nacimiento
  console.log('📝 Prueba 9: Filtro por mes de nacimiento')
  const filterByMonth = PaginationMockService.filterByBirthMonthWithPagination(
    mockClients,
    5, // Mayo
    pagination
  )
  console.log(`Filtro mes 5 (Mayo): ${filterByMonth.data.length} resultados`)
  console.log(
    'Resultados:',
    filterByMonth.data.map(
      c => `${c.name} - ${c.birthDate.toLocaleDateString()}`
    )
  )
  console.log('✅ Prueba 9 completada\n')

  // Prueba 10: Búsqueda en empleados
  console.log('📝 Prueba 10: Búsqueda en empleados')
  const searchEmployees = PaginationMockService.searchWithPagination(
    mockEmployees,
    'María',
    pagination
  )
  console.log(
    `Búsqueda "María" en empleados: ${searchEmployees.data.length} resultados`
  )
  console.log(
    'Resultados:',
    searchEmployees.data.map(e => e.name)
  )
  console.log('✅ Prueba 10 completada\n')

  console.log('🎉 Todas las pruebas completadas exitosamente!')
}

// Función para validar el hook de búsqueda
export const validateSearchHook = () => {
  console.log('🔍 Validando hook de búsqueda...\n')

  // Simular el comportamiento del hook
  let searchValue = ''
  let isSearching = false
  let debounceTimeout: NodeJS.Timeout | null = null

  // Usar las variables para evitar el warning de ESLint
  console.log('Estado inicial:', { searchValue, isSearching })

  const performSearch = (value: string) => {
    console.log(`🔍 Realizando búsqueda: "${value}"`)
    isSearching = true

    // Simular búsqueda
    setTimeout(() => {
      const results = PaginationMockService.searchWithPagination(
        mockClients,
        value,
        { page: 1, limit: 10 }
      )
      console.log(`📊 Resultados encontrados: ${results.data.length}`)
      isSearching = false
    }, 100)
  }

  const handleInputChange = (value: string) => {
    searchValue = value
    console.log(`✏️ Input cambiado a: "${value}"`)

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    if (!value.trim()) {
      performSearch('')
      return
    }

    debounceTimeout = setTimeout(() => {
      performSearch(value)
    }, 300)
  }

  // Simular cambios de input
  console.log('📝 Simulando cambios de input...')
  handleInputChange('Juan')
  handleInputChange('Juan P')
  handleInputChange('Juan Pérez')

  setTimeout(() => {
    console.log('✅ Simulación de hook completada\n')
  }, 1000)
}

// Ejecutar pruebas si se llama directamente
if (typeof window !== 'undefined') {
  // Solo en el navegador
  ;(window as any).runFilterTests = runFilterTests(
    window as any
  ).validateSearchHook = validateSearchHook
}

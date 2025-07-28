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
  {
    id: '6',
    name: 'Sofía Pérez',
    phoneNumber: '+573001234572',
    birthDate: new Date('1993-05-20'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: '7',
    name: 'Diego González',
    phoneNumber: '+573001234573',
    birthDate: new Date('1987-11-12'),
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
  {
    id: '8',
    name: 'Carmen Pérez',
    phoneNumber: '+573001234574',
    birthDate: new Date('1965-05-08'),
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
    createdBy: 'admin',
    updatedBy: 'admin',
  },
]

/**
 * Valida que el sistema de filtros esté funcionando correctamente
 */
export const validateFilterSystem = () => {
  console.log('🧪 VALIDACIÓN DEL SISTEMA DE FILTROS')
  console.log('=====================================\n')

  const pagination = { page: 1, limit: 50 }
  let allTestsPassed = true

  // Test 1: Búsqueda por nombre
  console.log('📝 Test 1: Búsqueda por nombre "Juan"')
  const test1 = PaginationMockService.searchWithPagination(
    mockClients,
    'Juan',
    pagination
  )
  const expected1 = 1 // Solo Juan Pérez
  if (test1.data.length === expected1) {
    console.log('✅ PASÓ - Encontrados:', test1.data.length, 'resultados')
    console.log(
      '   Resultados:',
      test1.data.map(c => c.name)
    )
  } else {
    console.log(
      '❌ FALLÓ - Esperados:',
      expected1,
      'Encontrados:',
      test1.data.length
    )
    allTestsPassed = false
  }
  console.log('')

  // Test 2: Búsqueda por apellido
  console.log('📝 Test 2: Búsqueda por apellido "Pérez"')
  const test2 = PaginationMockService.searchWithPagination(
    mockClients,
    'Pérez',
    pagination
  )
  const expected2 = 3 // Juan Pérez, Sofía Pérez, Carmen Pérez
  if (test2.data.length === expected2) {
    console.log('✅ PASÓ - Encontrados:', test2.data.length, 'resultados')
    console.log(
      '   Resultados:',
      test2.data.map(c => c.name)
    )
  } else {
    console.log(
      '❌ FALLÓ - Esperados:',
      expected2,
      'Encontrados:',
      test2.data.length
    )
    allTestsPassed = false
  }
  console.log('')

  // Test 3: Búsqueda por número de teléfono
  console.log('📝 Test 3: Búsqueda por número "3001234567"')
  const test3 = PaginationMockService.searchWithPagination(
    mockClients,
    '3001234567',
    pagination
  )
  const expected3 = 1 // Solo Juan Pérez
  if (test3.data.length === expected3) {
    console.log('✅ PASÓ - Encontrados:', test3.data.length, 'resultados')
    console.log(
      '   Resultados:',
      test3.data.map(c => `${c.name} - ${c.phoneNumber}`)
    )
  } else {
    console.log(
      '❌ FALLÓ - Esperados:',
      expected3,
      'Encontrados:',
      test3.data.length
    )
    allTestsPassed = false
  }
  console.log('')

  // Test 4: Búsqueda por número con formato
  console.log('📝 Test 4: Búsqueda por número con formato "+573001234567"')
  const test4 = PaginationMockService.searchWithPagination(
    mockClients,
    '+573001234567',
    pagination
  )
  const expected4 = 1 // Solo Juan Pérez
  if (test4.data.length === expected4) {
    console.log('✅ PASÓ - Encontrados:', test4.data.length, 'resultados')
    console.log(
      '   Resultados:',
      test4.data.map(c => `${c.name} - ${c.phoneNumber}`)
    )
  } else {
    console.log(
      '❌ FALLÓ - Esperados:',
      expected4,
      'Encontrados:',
      test4.data.length
    )
    allTestsPassed = false
  }
  console.log('')

  // Test 5: Búsqueda por número parcial
  console.log('📝 Test 5: Búsqueda por número parcial "300"')
  const test5 = PaginationMockService.searchWithPagination(
    mockClients,
    '300',
    pagination
  )
  const expected5 = 8 // Todos los clientes tienen números que empiezan con 300
  if (test5.data.length === expected5) {
    console.log('✅ PASÓ - Encontrados:', test5.data.length, 'resultados')
    console.log(
      '   Resultados:',
      test5.data.map(c => `${c.name} - ${c.phoneNumber}`)
    )
  } else {
    console.log(
      '❌ FALLÓ - Esperados:',
      expected5,
      'Encontrados:',
      test5.data.length
    )
    allTestsPassed = false
  }
  console.log('')

  // Test 6: Búsqueda por nombre completo
  console.log('📝 Test 6: Búsqueda por nombre completo "Juan Pérez"')
  const test6 = PaginationMockService.searchWithPagination(
    mockClients,
    'Juan Pérez',
    pagination
  )
  const expected6 = 1 // Solo Juan Pérez
  if (test6.data.length === expected6) {
    console.log('✅ PASÓ - Encontrados:', test6.data.length, 'resultados')
    console.log(
      '   Resultados:',
      test6.data.map(c => c.name)
    )
  } else {
    console.log(
      '❌ FALLÓ - Esperados:',
      expected6,
      'Encontrados:',
      test6.data.length
    )
    allTestsPassed = false
  }
  console.log('')

  // Test 7: Búsqueda que no encuentra nada
  console.log('📝 Test 7: Búsqueda que no encuentra nada "XYZ123"')
  const test7 = PaginationMockService.searchWithPagination(
    mockClients,
    'XYZ123',
    pagination
  )
  const expected7 = 0 // No debería encontrar nada
  if (test7.data.length === expected7) {
    console.log('✅ PASÓ - Encontrados:', test7.data.length, 'resultados')
  } else {
    console.log(
      '❌ FALLÓ - Esperados:',
      expected7,
      'Encontrados:',
      test7.data.length
    )
    allTestsPassed = false
  }
  console.log('')

  // Test 8: Búsqueda vacía
  console.log('📝 Test 8: Búsqueda vacía')
  const test8 = PaginationMockService.searchWithPagination(
    mockClients,
    '',
    pagination
  )
  const expected8 = 8 // Debería devolver todos los clientes
  if (test8.data.length === expected8) {
    console.log(
      '✅ PASÓ - Encontrados:',
      test8.data.length,
      'resultados (todos los clientes)'
    )
  } else {
    console.log(
      '❌ FALLÓ - Esperados:',
      expected8,
      'Encontrados:',
      test8.data.length
    )
    allTestsPassed = false
  }
  console.log('')

  // Test 9: Filtro por mes de nacimiento
  console.log('📝 Test 9: Filtro por mes de nacimiento (Mayo - mes 5)')
  const test9 = PaginationMockService.filterByBirthMonthWithPagination(
    mockClients,
    5,
    pagination
  )
  const expected9 = 3 // Juan Pérez (1990-05-15), Sofía Pérez (1993-05-20), Carmen Pérez (1965-05-08)
  if (test9.data.length === expected9) {
    console.log('✅ PASÓ - Encontrados:', test9.data.length, 'resultados')
    console.log(
      '   Resultados:',
      test9.data.map(c => `${c.name} - ${c.birthDate.toLocaleDateString()}`)
    )
  } else {
    console.log(
      '❌ FALLÓ - Esperados:',
      expected9,
      'Encontrados:',
      test9.data.length
    )
    allTestsPassed = false
  }
  console.log('')

  // Test 10: Búsqueda case-insensitive
  console.log('📝 Test 10: Búsqueda case-insensitive "juan"')
  const test10 = PaginationMockService.searchWithPagination(
    mockClients,
    'juan',
    pagination
  )
  const expected10 = 1 // Debería encontrar "Juan Pérez"
  if (test10.data.length === expected10) {
    console.log('✅ PASÓ - Encontrados:', test10.data.length, 'resultados')
    console.log(
      '   Resultados:',
      test10.data.map(c => c.name)
    )
  } else {
    console.log(
      '❌ FALLÓ - Esperados:',
      expected10,
      'Encontrados:',
      test10.data.length
    )
    allTestsPassed = false
  }
  console.log('')

  // Resumen final
  console.log('=====================================')
  if (allTestsPassed) {
    console.log('🎉 ¡TODAS LAS PRUEBAS PASARON!')
    console.log('✅ El sistema de filtros está funcionando correctamente')
  } else {
    console.log('❌ ALGUNAS PRUEBAS FALLARON')
    console.log('⚠️  El sistema de filtros necesita revisión')
  }
  console.log('=====================================')

  return allTestsPassed
}

// Ejecutar validación si se llama directamente
if (typeof window !== 'undefined') {
  ;(window as any).validateFilterSystem = validateFilterSystem
}

// ============================================================================
// INDEXEDDB MOCK - Mock completo de IndexedDB para tests
// ============================================================================

import { vi } from 'vitest'

// Mock de IndexedDB para tests
export function setupIndexedDBMock() {
  const mockDB = {
    objectStoreNames: ['activity_records'],
    transaction: vi.fn(),
    createObjectStore: vi.fn(),
  }

  const mockObjectStore = {
    add: vi.fn(),
    put: vi.fn(),
    get: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
    clear: vi.fn(),
    createIndex: vi.fn(),
    index: vi.fn(),
    openCursor: vi.fn(),
  }

  const mockIndex = {
    get: vi.fn(),
    getAll: vi.fn(),
    openCursor: vi.fn(),
  }

  const mockCursor = {
    value: null,
    continue: vi.fn(),
  }

  const mockTransaction = {
    objectStore: vi.fn().mockReturnValue(mockObjectStore),
  }

  const mockRequest = {
    result: mockDB,
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
    onupgradeneeded: vi.fn(),
  }

  const mockOpenRequest = {
    result: mockDB,
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
    onupgradeneeded: vi.fn(),
  }

  const mockAddRequest = {
    result: 'test-id',
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
  }

  const mockPutRequest = {
    result: 'test-id',
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
  }

  const mockGetRequest = {
    result: null,
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
  }

  const mockGetAllRequest = {
    result: [],
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
  }

  const mockDeleteRequest = {
    result: undefined,
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
  }

  const mockClearRequest = {
    result: undefined,
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
  }

  const mockCursorRequest = {
    result: null,
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
  }

  // Configurar mocks
  mockDB.transaction.mockReturnValue(mockTransaction)
  mockObjectStore.add.mockReturnValue(mockAddRequest)
  mockObjectStore.put.mockReturnValue(mockPutRequest)
  mockObjectStore.get.mockReturnValue(mockGetRequest)
  mockObjectStore.getAll.mockReturnValue(mockGetAllRequest)
  mockObjectStore.delete.mockReturnValue(mockDeleteRequest)
  mockObjectStore.clear.mockReturnValue(mockClearRequest)
  mockObjectStore.index.mockReturnValue(mockIndex)
  mockObjectStore.openCursor.mockReturnValue(mockCursorRequest)
  mockIndex.get.mockReturnValue(mockGetRequest)
  mockIndex.getAll.mockReturnValue(mockGetAllRequest)
  mockIndex.openCursor.mockReturnValue(mockCursorRequest)

  // Mock de indexedDB global
  const indexedDBMock = {
    open: vi.fn().mockReturnValue(mockOpenRequest),
    deleteDatabase: vi.fn().mockReturnValue(mockRequest),
  }

  // Configurar global indexedDB
  Object.defineProperty(global, 'indexedDB', {
    value: indexedDBMock,
    writable: true,
  })

  return {
    mockDB,
    mockObjectStore,
    mockIndex,
    mockTransaction,
    mockRequest,
    mockOpenRequest,
    mockAddRequest,
    mockPutRequest,
    mockGetRequest,
    mockGetAllRequest,
    mockDeleteRequest,
    mockClearRequest,
    mockCursorRequest,
    indexedDBMock,
  }
}

// Helper para simular éxito en requests
export function simulateSuccess(request: any, result: any = null) {
  request.result = result
  request.onsuccess?.()
}

// Helper para simular error en requests
export function simulateError(request: any, error: Error) {
  request.error = error
  request.onerror?.()
}

// Helper para configurar datos en el mock
export function setupMockData(mockObjectStore: any, data: any[]) {
  mockObjectStore.getAll.mockImplementation(() => ({
    result: data,
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
  }))
}

// Helper para configurar un registro específico
export function setupMockRecord(mockObjectStore: any, record: any) {
  mockObjectStore.get.mockImplementation((id: string) => ({
    result: record,
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
  }))
}

// Helper para configurar registro activo
export function setupMockActiveRecord(mockIndex: any, record: any) {
  mockIndex.get.mockImplementation((state: string) => ({
    result: state === 'active' ? record : null,
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
  }))
}

// Helper para configurar registros por estado
export function setupMockRecordsByState(mockIndex: any, records: any[]) {
  mockIndex.getAll.mockImplementation(() => ({
    result: records,
    error: null,
    onsuccess: vi.fn(),
    onerror: vi.fn(),
  }))
}

// Helper para configurar cursor
export function setupMockCursor(mockObjectStore: any, records: any[]) {
  let currentIndex = 0
  mockObjectStore.openCursor.mockImplementation(
    (range: any, direction: string = 'next') => ({
      result:
        currentIndex < records.length
          ? { value: records[currentIndex], continue: vi.fn() }
          : null,
      error: null,
      onsuccess: vi.fn(() => {
        if (currentIndex < records.length) {
          currentIndex++
        }
      }),
      onerror: vi.fn(),
    })
  )
}

// Helper para limpiar todos los mocks
export function clearIndexedDBMocks() {
  vi.clearAllMocks()
}

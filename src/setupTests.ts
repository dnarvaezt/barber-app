// ============================================================================
// SETUP TESTS - Configuración global para pruebas
// ============================================================================

import '@testing-library/jest-dom'
import { vi } from 'vitest'

// ============================================================================
// MOCKS GLOBALES
// ============================================================================

// Mock de console.log para evitar ruido en las pruebas
const originalConsoleLog = console.log
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  // Silenciar logs en pruebas
  console.log = vi.fn()
  console.error = vi.fn()
  console.warn = vi.fn()
})

afterAll(() => {
  // Restaurar console original
  console.log = originalConsoleLog
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// ============================================================================
// MOCKS DE DOM
// ============================================================================

// Mock de performance.now para pruebas de rendimiento
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
  },
  writable: true,
})

// Mock de setInterval y clearInterval
global.setInterval = vi.fn()
global.clearInterval = vi.fn()

// Mock de document.hidden
Object.defineProperty(document, 'hidden', {
  value: false,
  writable: true,
})

// Mock de window.focus y window.blur
Object.defineProperty(window, 'focus', {
  value: vi.fn(),
  writable: true,
})

Object.defineProperty(window, 'blur', {
  value: vi.fn(),
  writable: true,
})

// ============================================================================
// UTILIDADES DE PRUEBA
// ============================================================================

// Función helper para crear eventos DOM
export const createMockEvent = (type: string, options: any = {}) => {
  return {
    type,
    target: options.target || document.createElement('div'),
    timeStamp: Date.now(),
    ...options,
  } as Event
}

// Función helper para crear eventos de mouse
export const createMockMouseEvent = (type: string, options: any = {}) => {
  return {
    type,
    clientX: options.clientX || 0,
    clientY: options.clientY || 0,
    button: options.button || 0,
    target: options.target || document.createElement('div'),
    timeStamp: Date.now(),
    ...options,
  } as MouseEvent
}

// Función helper para crear eventos de teclado
export const createMockKeyboardEvent = (type: string, options: any = {}) => {
  return {
    type,
    key: options.key || 'Enter',
    code: options.code || 'Enter',
    ctrlKey: options.ctrlKey || false,
    shiftKey: options.shiftKey || false,
    altKey: options.altKey || false,
    metaKey: options.metaKey || false,
    target: options.target || document.createElement('input'),
    timeStamp: Date.now(),
    ...options,
  } as KeyboardEvent
}

// Función helper para crear eventos de foco
export const createMockFocusEvent = (type: string, options: any = {}) => {
  return {
    type,
    relatedTarget: options.relatedTarget || null,
    target: options.target || document.createElement('input'),
    timeStamp: Date.now(),
    ...options,
  } as FocusEvent
}

// Función helper para crear eventos táctiles
export const createMockTouchEvent = (type: string, options: any = {}) => {
  return {
    type,
    touches: options.touches || [],
    targetTouches: options.targetTouches || [],
    changedTouches: options.changedTouches || [],
    target: options.target || document.createElement('div'),
    timeStamp: Date.now(),
    ...options,
  } as TouchEvent
}

// ============================================================================
// EXPECTACIONES PERSONALIZADAS
// ============================================================================

// Expectación para verificar que un objeto es una instancia de TimeValueObject
expect.extend({
  toBeTimeValueObject(received: any) {
    const pass = received && typeof received.milliseconds === 'number'
    if (pass) {
      return {
        message: () => `expected ${received} not to be a TimeValueObject`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be a TimeValueObject`,
        pass: false,
      }
    }
  },
})

// Expectación para verificar que una fecha está en un rango
expect.extend({
  toBeWithinTimeRange(received: Date, start: Date, end: Date) {
    const pass =
      received.getTime() >= start.getTime() &&
      received.getTime() <= end.getTime()
    if (pass) {
      return {
        message: () => `expected ${received} not to be within time range`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected ${received} to be within time range ${start} - ${end}`,
        pass: false,
      }
    }
  },
})

// ============================================================================
// CONFIGURACIÓN DE TIMEOUT
// ============================================================================

// Aumentar timeout para pruebas que involucran timers
vi.setConfig({ testTimeout: 10000 })

// ============================================================================
// LIMPIEZA DESPUÉS DE CADA PRUEBA
// ============================================================================

afterEach(() => {
  // Limpiar todos los mocks
  vi.clearAllMocks()

  // Limpiar timers
  vi.clearAllTimers()

  // Limpiar event listeners
  document.removeEventListener = vi.fn()
  window.removeEventListener = vi.fn()
})

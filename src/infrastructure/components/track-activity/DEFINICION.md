# 🖥️ Sistema de Registro de Actividad del Usuario en Pestaña del Navegador

## 📋 Tabla de Contenidos

1. [🎯 Propósito y Objetivos](#-propósito-y-objetivos)
2. [📦 Conceptos Fundamentales](#-conceptos-fundamentales)
3. [🏆 Regla de Oro: Testabilidad y SOLID](#-regla-de-oro-testabilidad-y-solid)
4. [⏰ Especificación de Manejo de Tiempo](#-especificación-de-manejo-de-tiempo)
5. [🚦 Condiciones y Validaciones](#-condiciones-y-validaciones)
6. [🔁 Ciclo de Vida del Registro](#-ciclo-de-vida-del-registro)
7. [📤 Eventos del Sistema](#-eventos-del-sistema)
8. [⚙️ Comportamiento del Sistema](#-comportamiento-del-sistema)
9. [📐 Arquitectura Técnica](#-arquitectura-técnica)
10. [🧪 Desarrollo TDD](#-desarrollo-tdd)
11. [📋 Funciones de Gestión](#-funciones-de-gestión)
12. [🧪 Escenarios Soportados](#-escenarios-soportados)
13. [🖥️ Componente React Modal Informativo](#️-componente-react-modal-informativo)

---

## 🎯 Propósito y Objetivos

### 🎯 Propósito Principal

Desarrollar un sistema robusto para monitorear y registrar el tiempo de interacción del usuario en **una única pestaña activa** de una aplicación web. El objetivo es obtener registros precisos del comportamiento activo e inactivo del usuario, útiles para análisis de uso, control de atención o validación de sesiones.

### 🎯 Objetivos Específicos

- **Precisión:** Registros exactos del tiempo de actividad en segundos enteros
- **Confiabilidad:** Detección automática de múltiples pestañas y gestión de conflictos
- **Testabilidad:** 100% de funciones testeables con responsabilidad única
- **Escalabilidad:** Arquitectura limpia y principios SOLID
- **Performance:** Consumo mínimo de recursos del navegador

---

## 📦 Conceptos Fundamentales

### 🎯 ¿Qué es un Registro de Actividad?

Un **registro de actividad** es una unidad de tiempo monitoreada, compuesta por:

- `minimumTime`: Tiempo base requerido para validar un registro (en segundos, entero).
- `activeTime`: Tiempo acumulado desde el inicio hasta la última interacción del usuario (en segundos, entero).
- `idleTime`: Tiempo desde la última interacción hasta el momento de revisión (en segundos, entero).
- `totalTime`: Suma de `minimumTime + activeTime + idleTime` (en segundos, entero).

**⚠️ Regla Crítica de Tiempo:** Todos los tiempos se manejan exclusivamente en **segundos como números enteros**, sin decimales ni fracciones.

### 🎯 Estados del Registro

```typescript
enum ActivityState {
  CREATED = 'CREATED', // Registro creado pero no iniciado
  ACTIVE = 'ACTIVE', // Registro activo y monitoreando
  SUSPENDED = 'SUSPENDED', // Registro suspendido temporalmente
  FINISHED = 'FINISHED', // Registro finalizado definitivamente
}
```

### 🎯 Razones de Finalización

```typescript
enum FinishReason {
  MULTIPLE_TABS = 'MULTIPLE_TABS', // Múltiples pestañas detectadas
  IDLE_TIMEOUT = 'IDLE_TIMEOUT', // Tiempo de inactividad excedido
  TAB_CHANGE = 'TAB_CHANGE', // Cambio de pestaña
  EXPLICIT_CLOSE = 'EXPLICIT_CLOSE', // Cierre explícito
}
```

---

## 🏆 Regla de Oro: Testabilidad y SOLID

### 🎯 Principio Fundamental

**TODA función y clase debe ser testeable y tener una única responsabilidad, aplicando estrictamente los principios SOLID.**

### ✅ Criterios Obligatorios de Testabilidad

#### 1. **Responsabilidad Única (SRP)**

```typescript
// ✅ CORRECTO: Una función, una responsabilidad
class ActivityRecordValidator {
  validateMinimumTime(record: ActivityRecord): boolean {
    return record.activeTime >= record.minimumTime
  }

  validateTimeIntegrity(record: ActivityRecord): boolean {
    return (
      Number.isInteger(record.activeTime) &&
      Number.isInteger(record.minimumTime)
    )
  }
}

// ❌ INCORRECTO: Múltiples responsabilidades
class ActivityRecordManager {
  validateAndSaveAndNotify(record: ActivityRecord): void {
    // Validar, guardar y notificar en una sola función
  }
}
```

#### 2. **Inyección de Dependencias (DIP)**

```typescript
// ✅ CORRECTO: Dependencias inyectadas
class ActivityRecordService {
  constructor(
    private repository: ActivityRecordRepository,
    private validator: ActivityRecordValidator,
    private eventBus: ActivityEventBus
  ) {}

  async createRecord(data: CreateRecordData): Promise<ActivityRecord> {
    const record = new ActivityRecord(data)

    if (!this.validator.validate(record)) {
      throw new ActivityRecordException('Invalid record')
    }

    await this.repository.save(record)
    await this.eventBus.publish('activity.started', record)

    return record
  }
}
```

#### 3. **Funciones Puras y Determinísticas**

```typescript
// ✅ CORRECTO: Función pura y testeable
class TimeCalculator {
  static calculateTotalTime(activeTime: number, idleTime: number): number {
    return activeTime + idleTime
  }

  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}
```

### 🎯 Aplicación de SOLID en Funciones

#### 1. **Single Responsibility Principle (SRP)**

```typescript
// ✅ CORRECTO: Cada función tiene una responsabilidad
class ActivityRecordCalculator {
  calculateActiveTime(startTime: Date, endTime: Date): number {
    return Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
  }

  calculateIdleTime(lastActivity: Date, currentTime: Date): number {
    return Math.floor((currentTime.getTime() - lastActivity.getTime()) / 1000)
  }

  calculateTotalTime(activeTime: number, idleTime: number): number {
    return activeTime + idleTime
  }
}
```

#### 2. **Open/Closed Principle (OCP)**

```typescript
// ✅ CORRECTO: Extensible sin modificar
interface ValidationStrategy {
  validate(record: ActivityRecord): boolean
}

class MinimumTimeValidationStrategy implements ValidationStrategy {
  validate(record: ActivityRecord): boolean {
    return record.activeTime >= record.minimumTime
  }
}

class TimeIntegrityValidationStrategy implements ValidationStrategy {
  validate(record: ActivityRecord): boolean {
    return (
      Number.isInteger(record.activeTime) &&
      Number.isInteger(record.minimumTime)
    )
  }
}

class ActivityRecordValidator {
  constructor(private strategies: ValidationStrategy[]) {}

  validate(record: ActivityRecord): boolean {
    return this.strategies.every(strategy => strategy.validate(record))
  }
}
```

### 🚫 Reglas Prohibidas

#### 1. **Funciones No Testeables**

```typescript
// ❌ PROHIBIDO: Funciones no testeables
class ActivityRecordService {
  async createRecord(data: CreateRecordData): Promise<ActivityRecord> {
    // Dependencias hardcodeadas
    const repository = new IndexedDBRepository()
    const validator = new ActivityRecordValidator()

    // Efectos secundarios
    console.log('Creating record...')
    localStorage.setItem('lastRecord', JSON.stringify(data))

    // Lógica compleja no separable
    const record = new ActivityRecord(data)
    if (
      record.activeTime >= record.minimumTime &&
      Number.isInteger(record.activeTime) &&
      Number.isInteger(record.minimumTime)
    ) {
      await repository.save(record)
      return record
    } else {
      throw new Error('Invalid record')
    }
  }
}
```

### ✅ Criterios de Validación

#### 1. **Checklist de Testabilidad**

- [ ] ¿La función/clase tiene una única responsabilidad?
- [ ] ¿Las dependencias están inyectadas?
- [ ] ¿La función es pura (sin efectos secundarios)?
- [ ] ¿Es fácil escribir tests unitarios?
- [ ] ¿Se pueden usar mocks para las dependencias?
- [ ] ¿La función es determinística?
- [ ] ¿Sigue los principios SOLID?

#### 2. **Criterios de Aceptación**

- **100% de funciones testeables**
- **100% de clases con responsabilidad única**
- **100% de aplicación de principios SOLID**
- **0% de dependencias hardcodeadas**
- **0% de efectos secundarios en funciones puras**

---

## ⏰ Especificación de Manejo de Tiempo

### 🎯 Reglas Obligatorias de Tiempo

1. **Unidad de Medida:** Todos los tiempos se manejan exclusivamente en **segundos**.
2. **Tipo de Datos:** Todos los tiempos deben ser **números enteros** (sin decimales).
3. **Precisión:** No se permiten fracciones de segundo en ningún cálculo.
4. **Redondeo:** Los tiempos se redondean hacia abajo al segundo más cercano.

### 📊 Campos de Tiempo en Segundos

```typescript
interface ActivityRecord {
  minimumTime: number // Segundos enteros (ej: 5, 10, 60)
  activeTime: number // Segundos enteros (ej: 0, 15, 3600)
  idleTime: number // Segundos enteros (ej: 0, 30, 120)
  totalTime: number // Segundos enteros (suma de los anteriores)
  maxIdleTime: number // Segundos enteros (ej: 300, 600)
}
```

### 🎨 Formato de Visualización

```typescript
// Función de conversión de segundos a formato HH:MM:SS
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Ejemplos:
formatTime(5) // "00:00:05"
formatTime(65) // "00:01:05"
formatTime(3661) // "01:01:01"
formatTime(7325) // "02:02:05"
```

### ✅ Validaciones de Tiempo

```typescript
// Validar que un tiempo sea entero en segundos
function isValidTimeInSeconds(time: number): boolean {
  return Number.isInteger(time) && time >= 0
}

// Validar que todos los tiempos de un registro sean enteros
function validateRecordTimes(record: ActivityRecord): boolean {
  return (
    isValidTimeInSeconds(record.minimumTime) &&
    isValidTimeInSeconds(record.activeTime) &&
    isValidTimeInSeconds(record.idleTime) &&
    isValidTimeInSeconds(record.totalTime)
  )
}
```

---

## 🚦 Condiciones y Validaciones

### 🚦 Condiciones para Iniciar un Registro

Un registro solo puede iniciar si se cumplen simultáneamente:

- La pestaña está **activa y visible**.
- Ocurre al menos uno de los siguientes eventos:
  - El usuario realiza una **acción válida** (clic, scroll, entrada de texto, etc.).
  - La página ha sido completamente cargada.
  - Un script o proceso solicita explícitamente el inicio.

### ✅ Validación de un Registro

Un registro se considera **válido** solo si ha acumulado un tiempo igual o superior al `minimumTime` (en segundos, entero).

### ⛔ Suspensión y Finalización

#### 🚫 Suspensión por Múltiples Pestañas

**Comportamiento crítico:** Cuando el usuario tiene múltiples pestañas abiertas de la misma aplicación en el navegador, el sistema debe **detener inmediatamente** el registro de actividad en todas las pestañas excepto la activa.

#### ⏸️ Comportamiento de Finalización

Cuando se detectan múltiples pestañas:

1. **Pestaña Activa:** Mantiene el registro activo y continúa monitoreando.
2. **Pestañas Inactivas:**
   - **Finalizan inmediatamente** su registro de actividad.
   - Emiten evento `activity.finished` con razón `MULTIPLE_TABS`.
   - Detienen todos los timers y listeners de actividad.
   - Marcan el registro como `FINISHED` (no se puede reanudar).
   - Eliminan el registro del almacenamiento local.

#### 🚫 Finalización Definitiva (Sin Reanudación)

**Regla crítica:** Los registros **NO se pueden reanudar** una vez finalizados. Si un registro se finaliza por cualquier motivo, al regresar a la pestaña se debe iniciar un **nuevo registro completamente**.

### ⏰ Suspensión por Inactividad

Un registro entra en suspensión si:

- El usuario supera el `maxIdleTime` permitido (tiempo máximo de inactividad en segundos, entero).

### 🏁 Finalización Definitiva

**Comportamiento crítico:** Los registros se **finalizan definitivamente** (no se pueden reanudar) cuando:

- Se alcanza el `maxIdleTime` por inactividad prolongada.
- El usuario cambia a otra pestaña de la misma aplicación.
- Se cierra explícitamente la pestaña.
- Se cierra el navegador.

---

## 🔁 Ciclo de Vida del Registro

1. **Inicio:** Se dispara por evento (interacción, carga o script).
2. **Seguimiento:** Se actualiza periódicamente mientras esté activo.
3. **Suspensión/Finalización:** Por inactividad, cambio de pestaña o cierre.

---

## 📤 Eventos del Sistema

### 📋 Eventos Emitidos

- `activity.started`: Nuevo registro iniciado.
- `activity.updated`: Actualización periódica del registro.
- `activity.finished`: Registro finalizado por inactividad o cierre.
- `activity.suspended`: Registro suspendido por cambio de pestaña o inactividad prolongada.
- `activity.multiple_tabs_detected`: Se detectaron múltiples pestañas de la misma aplicación.
- `activity.tab_switched`: Cambio de pestaña activa detectado.
- `activity.new_record_started`: Nuevo registro iniciado después de finalización previa.
- `tab.focus_changed`: Cambio en el estado de foco de la pestaña.
- `tab.visibility_changed`: Cambio en la visibilidad de la pestaña.
- `browser.activity_changed`: Cambio en la actividad del browser.
- `tab.state_updated`: Actualización completa del estado de la pestaña.

### 📋 Información de Eventos

Todos los eventos incluyen:

- **Timestamp:** Momento exacto del evento.
- **Tab ID:** Identificador único de la pestaña.
- **Reason:** Razón específica del evento (para suspensiones).
- **Active Tabs Count:** Número de pestañas activas detectadas.
- **Record State:** Estado actual del registro.
- **Tab Focus State:** Estado de foco de la pestaña (`FOCUSED` | `BLURRED`).
- **Tab Visibility State:** Estado de visibilidad de la pestaña (`VISIBLE` | `HIDDEN`).
- **Browser Active State:** Estado de actividad del browser (`ACTIVE` | `INACTIVE`).

---

## ⚙️ Comportamiento del Sistema

### 🎯 Principio de Pestaña Única Activa

- **Regla fundamental:** Solo se permite **un registro activo por aplicación** en todo el navegador.
- **Detección automática:** El sistema detecta automáticamente cuando hay múltiples pestañas abiertas.
- **Suspensión inmediata:** Al detectar múltiples pestañas, todas excepto la activa suspenden su registro.

### 🔄 Gestión de Múltiples Pestañas

#### ✅ Pestaña Activa

- Mantiene el registro de actividad activo.
- Continúa monitoreando interacciones del usuario.
- Emite eventos de actualización periódica.

#### ⏸️ Pestañas Inactivas

- Suspenden inmediatamente su registro de actividad.
- Detienen todos los timers y listeners.
- Marcan su registro como `SUSPENDED`.
- No consumen recursos de monitoreo.

#### 🔄 Transiciones de Estado

- **Al cambiar de pestaña:** La nueva pestaña activa inicia un **nuevo registro** si el anterior se finalizó.
- **Al cerrar pestañas:** La pestaña restante inicia un **nuevo registro** si el anterior se finalizó.
- **Al abrir nueva pestaña:** Se finaliza el registro en la pestaña anterior.

### 💾 Persistencia y Recuperación

- Los registros se persisten temporalmente en IndexedDB.
- Al iniciar, el sistema recupera registros pendientes y valida su integridad.
- **Limpieza automática:** Registros suspendidos por múltiples pestañas se limpian automáticamente.
- **Recuperación inteligente:** Solo se recuperan registros válidos y no conflictivos.

### 👁️ Visibilidad de Registros Activos

**Regla de Visibilidad:**

- ✅ **Solo la pestaña activa** puede mostrar registros activos
- ❌ **Las pestañas inactivas** NO muestran registros activos
- 🔄 **Sincronización automática** del estado de visibilidad entre pestañas

### 🚀 Optimización de Recursos

- **Consumo cero:** El sistema no consume recursos cuando no hay registro activo.
- **Detección eficiente:** Uso de APIs nativas del navegador para detección de pestañas.
- **Comunicación ligera:** BroadcastChannel para sincronización entre pestañas.

### 🎯 Estado de Foco y Actividad del Browser

El sistema monitorea constantemente el estado de foco y actividad de la pestaña para garantizar registros precisos:

#### 📱 Estados de Foco de Pestaña

- **`FOCUSED`:** La pestaña tiene el foco del navegador y está activa.
- **`BLURRED`:** La pestaña ha perdido el foco del navegador.

#### 👁️ Estados de Visibilidad de Pestaña

- **`VISIBLE`:** La pestaña es visible para el usuario.
- **`HIDDEN`:** La pestaña está oculta (cambio de pestaña, minimización, etc.).

#### 🌐 Estados de Actividad del Browser

- **`ACTIVE`:** El browser está activo y la pestaña está enfocada y visible.
- **`INACTIVE`:** El browser está inactivo o la pestaña no está enfocada/visible.

#### 📊 Variables de Estado Disponibles

```typescript
interface TabState {
  isFocused: boolean // true si la pestaña tiene foco
  isVisible: boolean // true si la pestaña es visible
  isBrowserActive: boolean // true si el browser está activo
  focusState: 'FOCUSED' | 'BLURRED'
  visibilityState: 'VISIBLE' | 'HIDDEN'
  browserActiveState: 'ACTIVE' | 'INACTIVE'
  lastFocusChange: Date // Último cambio de foco
  lastVisibilityChange: Date // Último cambio de visibilidad
  totalFocusTime: number // Tiempo total con foco (en segundos, entero)
  totalVisibleTime: number // Tiempo total visible (en segundos, entero)
}
```

---

## 📐 Arquitectura Técnica

### 🛠️ Stack Tecnológico

#### ✅ Tecnologías Obligatorias

- **Lenguaje:** TypeScript 5.x (strict mode)
- **Testing:** Vitest + React Testing Library
- **Arquitectura:** Hexagonal (Ports & Adapters) + Clean Architecture
- **Patrones:** SOLID, DDD, Clean Code, TDD
- **Persistencia:** IndexedDB (local, controlada)
- **Eventos:** Event Bus Pattern (desacoplado)
- **Monitoreo:** Browser APIs nativas (Page Visibility, Focus, etc.)

### 🏗️ Arquitectura Hexagonal (Ports & Adapters)

#### 🔌 Puertos (Interfaces)

**Puertos de Entrada (Input Ports):**

```typescript
// Application Layer - Use Cases
interface StartActivityRecordUseCase {
  execute(event: ActivityEvent): Promise<ActivityRecord>
}

interface UpdateActivityRecordUseCase {
  execute(
    recordId: string,
    updates: Partial<ActivityRecord>
  ): Promise<ActivityRecord>
}

interface FinishActivityRecordUseCase {
  execute(recordId: string, reason: FinishReason): Promise<void>
}
```

**Puertos de Salida (Output Ports):**

```typescript
// Domain Layer - Repository Interface
interface ActivityRecordRepository {
  save(record: ActivityRecord): Promise<void>
  findById(id: string): Promise<ActivityRecord | null>
  findActiveRecord(): Promise<ActivityRecord | null>
  delete(id: string): Promise<void>
  purgeInvalidRecords(): Promise<number>
}

// Domain Layer - Event Bus Interface
interface ActivityEventBus {
  publish(event: string, data: any): Promise<void>
  subscribe(event: string, handler: Function): void
  unsubscribe(event: string, handler: Function): void
}
```

### 🎯 Patrones de Diseño Obligatorios

#### 🏭 Patrones Creacionales

**1. Factory Pattern:**

```typescript
// Domain Layer - ActivityRecord Factory
class ActivityRecordFactory {
  static create(params: CreateActivityRecordParams): ActivityRecord {
    return new ActivityRecord({
      id: this.generateId(),
      tabId: params.tabId,
      minimumTime: params.minimumTime || 5, // En segundos, entero (5 segundos)
      createdAt: new Date(),
      state: ActivityState.CREATED,
    })
  }

  private static generateId(): string {
    return `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
```

**2. Builder Pattern:**

```typescript
// Domain Layer - ActivityRecord Builder
class ActivityRecordBuilder {
  private record: Partial<ActivityRecord> = {}

  withTabId(tabId: string): ActivityRecordBuilder {
    this.record.tabId = tabId
    return this
  }

  withMinimumTime(minimumTime: number): ActivityRecordBuilder {
    // Validar que sea un entero positivo en segundos
    if (!Number.isInteger(minimumTime) || minimumTime < 0) {
      throw new Error('minimumTime debe ser un entero positivo en segundos')
    }
    this.record.minimumTime = minimumTime
    return this
  }

  build(): ActivityRecord {
    return ActivityRecordFactory.create(
      this.record as CreateActivityRecordParams
    )
  }
}
```

#### 🎭 Patrones de Comportamiento

**1. Observer Pattern (Event Bus):**

```typescript
// Domain Layer - Event Bus Implementation
class ActivityEventBusImpl implements ActivityEventBus {
  private handlers: Map<string, Function[]> = new Map()

  async publish(event: string, data: any): Promise<void> {
    const handlers = this.handlers.get(event) || []
    await Promise.all(handlers.map(handler => handler(data)))
  }

  subscribe(event: string, handler: Function): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }
    this.handlers.get(event)!.push(handler)
  }

  unsubscribe(event: string, handler: Function): void {
    const handlers = this.handlers.get(event) || []
    const index = handlers.indexOf(handler)
    if (index > -1) {
      handlers.splice(index, 1)
    }
  }
}
```

**2. Strategy Pattern:**

```typescript
// Domain Layer - Validation Strategies
interface ValidationStrategy {
  validate(record: ActivityRecord): boolean
}

class MinimumTimeValidationStrategy implements ValidationStrategy {
  validate(record: ActivityRecord): boolean {
    return (
      Number.isInteger(record.activeTime) &&
      Number.isInteger(record.minimumTime) &&
      record.activeTime >= record.minimumTime
    )
  }
}

class TabFocusValidationStrategy implements ValidationStrategy {
  validate(record: ActivityRecord): boolean {
    return document.hasFocus() && !document.hidden
  }
}

// Application Layer - Validator Service
class ActivityValidator {
  private strategies: ValidationStrategy[] = []

  addStrategy(strategy: ValidationStrategy): void {
    this.strategies.push(strategy)
  }

  validate(record: ActivityRecord): boolean {
    return this.strategies.every(strategy => strategy.validate(record))
  }
}
```

### 📦 Estructura de Carpetas por Arquitectura

```
src/
├── domain/                          # 🏗️ Capa de Dominio
│   ├── entities/                    # Entidades de negocio
│   │   ├── activity-record.ts
│   │   └── activity-event.ts
│   ├── value-objects/               # Objetos de valor
│   │   ├── activity-state.ts
│   │   └── finish-reason.ts
│   ├── repositories/                # Interfaces de repositorios
│   │   └── activity-record.repository.ts
│   ├── services/                    # Servicios de dominio
│   │   └── activity-validator.ts
│   └── events/                      # Eventos de dominio
│       └── activity-event-bus.ts
├── application/                     # ⚙️ Capa de Aplicación
│   ├── use-cases/                   # Casos de uso
│   │   ├── start-activity-record.use-case.ts
│   │   ├── update-activity-record.use-case.ts
│   │   └── finish-activity-record.use-case.ts
│   ├── commands/                    # Comandos
│   │   ├── start-record.command.ts
│   │   └── finish-record.command.ts
│   ├── services/                    # Servicios de aplicación
│   │   └── activity-record.service.ts
│   └── factories/                   # Factories
│       └── activity-record.factory.ts
└── infrastructure/                  # 🔌 Capa de Infraestructura
    ├── repositories/                # Implementaciones de repositorios
    │   ├── activity-record-indexeddb.repository.ts
    │   └── activity-record-memory.repository.ts
    ├── monitors/                    # Monitores de eventos
    │   └── browser-activity.monitor.ts
    ├── adapters/                    # Adaptadores de APIs
    │   ├── browser-api.adapter.ts
    │   └── indexeddb.adapter.ts
    ├── components/                  # Componentes React
    │   ├── activity-tracker/
    │   └── activity-provider/
    └── di/                         # Inyección de dependencias
        └── activity.container.ts
```

---

## 🧪 Desarrollo TDD

### 🎯 Metodología TDD (Test-Driven Development)

El desarrollo de este sistema debe seguir **estrictamente** la metodología TDD:

1. **Red (Red):** Escribir un test que falle
2. **Green (Green):** Escribir el código mínimo para que el test pase
3. **Refactor (Refactor):** Mejorar el código manteniendo los tests pasando

### 🧪 Cobertura Obligatoria del 100%

**Capa de Aplicación (Application Layer):**

- **Servicios:** 100% de métodos y lógica de negocio
- **Use Cases:** 100% de flujos de aplicación
- **Commands:** 100% de comandos y handlers
- **Validators:** 100% de validaciones y reglas

**Capa de Infraestructura (Infrastructure Layer):**

- **Repositorios:** 100% de operaciones CRUD
- **Monitores:** 100% de detección de eventos
- **Adaptadores:** 100% de adaptación de APIs
- **Componentes React:** 100% de renderizado e interacciones

### 🧪 Ejemplos de Tests por Capa

**Tests de Dominio (Domain Layer):**

```typescript
describe('ActivityRecord', () => {
  describe('validation', () => {
    it('should be valid when active time exceeds minimum time', () => {
      const record = new ActivityRecord({
        minimumTime: 5, // En segundos, entero
        activeTime: 6, // En segundos, entero
      })

      expect(record.isValid()).toBe(true)
    })

    it('should be invalid when active time is below minimum time', () => {
      const record = new ActivityRecord({
        minimumTime: 5, // En segundos, entero
        activeTime: 3, // En segundos, entero
      })

      expect(record.isValid()).toBe(false)
    })

    it('should validate that times are integers', () => {
      const record = new ActivityRecord({
        minimumTime: 5, // En segundos, entero
        activeTime: 5.5, // Con decimales - debe fallar
      })

      expect(record.isValid()).toBe(false)
    })
  })
})
```

**Tests de Aplicación (Application Layer):**

```typescript
describe('StartActivityRecordUseCase', () => {
  let useCase: StartActivityRecordUseCase
  let mockRepository: MockActivityRecordRepository
  let mockEventBus: MockActivityEventBus

  beforeEach(() => {
    mockRepository = new MockActivityRecordRepository()
    mockEventBus = new MockActivityEventBus()
    useCase = new StartActivityRecordUseCase(mockRepository, mockEventBus)
  })

  it('should create and persist new record', async () => {
    const result = await useCase.execute(ActivityEvent.USER_INTERACTION)

    expect(result).toBeDefined()
    expect(mockRepository.save).toHaveBeenCalledWith(result)
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      'activity.started',
      result
    )
  })
})
```

### 🚀 Scripts de Desarrollo

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:tdd": "vitest --watch --reporter=verbose",
    "test:ci": "vitest --run --coverage",
    "build": "vite build",
    "build:check": "npm run build && npm run test:ci",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 📋 Funciones de Gestión de Registros

### 🔍 Obtener Listado de Registros

**Función:** `getActivityRecords(options?: GetRecordsOptions)`

```typescript
interface GetRecordsOptions {
  state?: ActivityState | ActivityState[] // Filtrar por estado
  dateRange?: { start: Date; end: Date } // Filtrar por rango de fechas
  limit?: number // Límite de registros
  offset?: number // Paginación
  sortBy?: 'createdAt' | 'updatedAt' | 'totalTime' // Ordenamiento
  sortOrder?: 'asc' | 'desc' // Dirección del ordenamiento
  includeInvalid?: boolean // Incluir registros inválidos
}

interface GetRecordsResult {
  records: ActivityRecord[]
  total: number
  hasMore: boolean
  summary: {
    totalRecords: number
    validRecords: number
    invalidRecords: number
    totalActiveTime: number // En segundos, entero
    totalIdleTime: number // En segundos, entero
  }
}
```

### 🧹 Purgar Registros Inválidos

**Función:** `purgeInvalidRecords(options?: PurgeOptions)`

```typescript
interface PurgeOptions {
  dryRun?: boolean // Solo simular, no eliminar
  minTimeThreshold?: number // Tiempo mínimo para considerar válido (en segundos, entero)
  maxAge?: number // Edad máxima en días
  states?: ActivityState[] // Estados específicos a purgar
  includeActive?: boolean // Incluir registros activos
}

interface PurgeResult {
  purgedCount: number
  purgedRecords: ActivityRecord[]
  freedSpace: number // Espacio liberado en bytes
  summary: {
    totalBefore: number
    totalAfter: number
    invalidRemoved: number
    expiredRemoved: number
    orphanedRemoved: number
  }
}
```

### 🗑️ Eliminar Registros Específicos

**Función:** `deleteActivityRecords(ids: string | string[], options?: DeleteOptions)`

```typescript
interface DeleteOptions {
  force?: boolean // Forzar eliminación incluso si está activo
  cascade?: boolean // Eliminar registros relacionados
  backup?: boolean // Crear backup antes de eliminar
}

interface DeleteResult {
  deletedCount: number
  deletedIds: string[]
  failedIds: string[]
  errors: Array<{ id: string; reason: string }>
  summary: {
    activeRecordsDeleted: number
    suspendedRecordsDeleted: number
    finishedRecordsDeleted: number
    invalidRecordsDeleted: number
  }
}
```

### 📊 Obtener Estadísticas de Registros

**Función:** `getActivityStatistics(options?: StatisticsOptions)`

```typescript
interface StatisticsOptions {
  dateRange?: { start: Date; end: Date }
  groupBy?: 'day' | 'week' | 'month' | 'hour'
  includeInvalid?: boolean
}

interface ActivityStatistics {
  totalRecords: number
  validRecords: number
  invalidRecords: number
  averageActiveTime: number // En segundos, entero
  averageIdleTime: number // En segundos, entero
  totalActiveTime: number // En segundos, entero
  totalIdleTime: number // En segundos, entero
  recordsByState: Record<ActivityState, number>
  recordsByDate: Array<{ date: string; count: number; totalTime: number }> // totalTime en segundos, entero
  peakActivityHours: Array<{ hour: number; count: number }>
  averageSessionDuration: number // En segundos, entero
  completionRate: number // Porcentaje de registros completados
}
```

---

## 🧪 Escenarios Soportados

### 📋 Escenarios Básicos

- Registro iniciado por carga automática o acción del usuario.
- Recuperación de registros pendientes tras recarga.
- Descarte automático de registros inválidos.
- Eliminación de registros huérfanos al iniciar.
- Activación manual por scripts de terceros.
- Desactivación temporal por pérdida de foco o visibilidad.

### 🔄 Escenarios de Múltiples Pestañas

#### 📱 Escenario 1: Apertura de Nueva Pestaña

1. Usuario tiene una pestaña activa con registro en curso.
2. Usuario abre nueva pestaña de la misma aplicación.
3. **Resultado:** Registro en primera pestaña se suspende inmediatamente.
4. **Resultado:** Nueva pestaña inicia su propio registro.

#### 🔄 Escenario 2: Cambio Entre Pestañas

1. Usuario tiene múltiples pestañas abiertas.
2. Usuario cambia de pestaña activa.
3. **Resultado:** Pestaña anterior finaliza su registro definitivamente.
4. **Resultado:** Nueva pestaña activa inicia un **nuevo registro** desde cero.

#### ❌ Escenario 3: Cierre de Pestañas

1. Usuario tiene múltiples pestañas abiertas.
2. Usuario cierra una pestaña inactiva.
3. **Resultado:** No hay cambio en el registro activo.
4. Usuario cierra la pestaña activa.
5. **Resultado:** Pestaña restante inicia un **nuevo registro** desde cero.

#### 🆕 Escenario 4: Recarga de Pestaña

1. Usuario tiene múltiples pestañas con registros finalizados.
2. Usuario recarga una pestaña inactiva.
3. **Resultado:** Sistema detecta múltiples pestañas y finaliza registros en pestañas inactivas.
4. **Resultado:** Solo la pestaña activa mantiene registro activo.

#### 🔄 Escenario 5: Recuperación Post-Cierre

1. Usuario cierra todas las pestañas excepto una.
2. Usuario abre nueva pestaña de la aplicación.
3. **Resultado:** Sistema detecta múltiples pestañas y finaliza registro en pestaña anterior.
4. **Resultado:** Solo la pestaña activa mantiene registro activo.

---

## 🖥️ Componente React Modal Informativo

### 🎯 Propósito del Componente

El sistema debe incluir un **componente React modal flotante** que proporcione información completa y en tiempo real sobre el estado del sistema de registro de actividad. Este componente debe ser **informativo, no interactivo**, y mostrar toda la información disponible del sistema.

### 🎨 Especificación del Modal

#### 📱 Características del Modal

- **Tipo:** Modal flotante (overlay) con backdrop
- **Posición:** Centrado en pantalla con z-index alto
- **Comportamiento:** Mostrar/ocultar mediante prop o hook
- **Responsive:** Adaptable a diferentes tamaños de pantalla
- **Accesibilidad:** Cumplir estándares WCAG 2.1
- **Tema:** Consistente con el sistema de diseño de la aplicación

#### 🎛️ Controles del Modal

```typescript
interface ActivityModalProps {
  isOpen: boolean // Estado de visibilidad
  onClose: () => void // Función para cerrar
  showAdvancedInfo?: boolean // Mostrar información técnica detallada
  autoRefresh?: boolean // Actualización automática cada 5 segundos
  refreshInterval?: number // Intervalo de actualización en ms
  position?: 'center' | 'top-right' | 'bottom-right' // Posición del modal
  size?: 'small' | 'medium' | 'large' // Tamaño del modal
}
```

### 📊 Información a Mostrar

#### 🎯 Información Principal (Siempre Visible)

**1. Estado de Actividad Actual**

```typescript
interface ActivityStatusInfo {
  currentState: ActivityState // CREATED | ACTIVE | SUSPENDED | FINISHED
  isActive: boolean // ¿Hay registro activo?
  isVisible: boolean // ¿La pestaña es visible?
  isFocused: boolean // ¿La pestaña tiene foco?
  isBrowserActive: boolean // ¿El browser está activo?
  activeTabId: string // ID de la pestaña activa
  totalActiveTabs: number // Total de pestañas abiertas
}
```

**2. Tiempos del Registro Actual**

```typescript
interface CurrentRecordTimes {
  activeTime: number // Tiempo activo (en segundos, entero)
  idleTime: number // Tiempo inactivo (en segundos, entero)
  totalTime: number // Tiempo total (en segundos, entero)
  minimumTime: number // Tiempo mínimo requerido (en segundos, entero)
  maxIdleTime: number // Tiempo máximo de inactividad (en segundos, entero)
  formattedActiveTime: string // Formato HH:MM:SS
  formattedIdleTime: string // Formato HH:MM:SS
  formattedTotalTime: string // Formato HH:MM:SS
  progressPercentage: number // Porcentaje de progreso (0-100)
}
```

**3. Información de Pestañas**

```typescript
interface TabInformation {
  currentTabId: string // ID de la pestaña actual
  isCurrentTabActive: boolean // ¿Es la pestaña activa?
  totalTabsInApp: number // Total de pestañas de la app
  otherTabsCount: number // Otras pestañas abiertas
  tabFocusState: 'FOCUSED' | 'BLURRED'
  tabVisibilityState: 'VISIBLE' | 'HIDDEN'
  browserActiveState: 'ACTIVE' | 'INACTIVE'
}
```

#### 🔧 Información Avanzada (Opcional)

**4. Estadísticas de Memoria**

```typescript
interface MemoryStatistics {
  totalRecordsInMemory: number // Total de registros en memoria
  activeRecordsCount: number // Registros activos
  suspendedRecordsCount: number // Registros suspendidos
  finishedRecordsCount: number // Registros finalizados
  invalidRecordsCount: number // Registros inválidos
  memoryUsageBytes: number // Uso de memoria en bytes
  storageQuota: number // Cuota de almacenamiento disponible
  storageUsagePercentage: number // Porcentaje de uso del almacenamiento
}
```

**5. Información Técnica Detallada**

```typescript
interface TechnicalInformation {
  lastActivityTimestamp: Date // Última actividad detectada
  lastFocusChange: Date // Último cambio de foco
  lastVisibilityChange: Date // Último cambio de visibilidad
  sessionStartTime: Date // Inicio de la sesión actual
  uptime: number // Tiempo de funcionamiento (en segundos, entero)
  eventCount: number // Total de eventos procesados
  errorCount: number // Total de errores
  lastError?: string // Último error ocurrido
  performanceMetrics: {
    averageEventProcessingTime: number // Tiempo promedio de procesamiento
    memoryLeaksDetected: boolean // ¿Se detectaron memory leaks?
    cpuUsagePercentage: number // Uso de CPU estimado
  }
}
```

**6. Historial de Eventos Recientes**

```typescript
interface RecentEvent {
  timestamp: Date
  eventType: string
  description: string
  severity: 'info' | 'warning' | 'error'
  data?: any
}

interface EventHistory {
  recentEvents: RecentEvent[] // Últimos 10 eventos
  totalEventsToday: number // Total de eventos hoy
  eventsByType: Record<string, number> // Eventos agrupados por tipo
}
```

### 🎨 Diseño Visual del Modal

#### 📱 Layout del Modal

```scss
.activity-modal {
  @apply fixed inset-0 z-50 flex items-center justify-center;

  &__backdrop {
    @apply absolute inset-0 bg-black bg-opacity-50;
  }

  &__content {
    @apply relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto;
  }

  &__header {
    @apply flex items-center justify-between p-6 border-b border-gray-200;
  }

  &__body {
    @apply p-6 space-y-6;
  }

  &__footer {
    @apply flex items-center justify-end p-6 border-t border-gray-200 space-x-3;
  }
}
```

#### 🎯 Secciones de Información

**1. Header con Estado Principal**

```tsx
<div className='activity-modal__header'>
  <div className='flex items-center space-x-3'>
    <div className={`w-3 h-3 rounded-full ${getStatusColor(activityState)}`} />
    <h2 className='text-xl font-semibold'>
      Estado de Actividad: {getStatusLabel(activityState)}
    </h2>
  </div>
  <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
    <XIcon className='w-6 h-6' />
  </button>
</div>
```

**2. Información de Tiempo**

```tsx
<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
  <div className='bg-blue-50 p-4 rounded-lg'>
    <h3 className='text-sm font-medium text-blue-900'>Tiempo Activo</h3>
    <p className='text-2xl font-bold text-blue-700'>{formattedActiveTime}</p>
  </div>
  <div className='bg-yellow-50 p-4 rounded-lg'>
    <h3 className='text-sm font-medium text-yellow-900'>Tiempo Inactivo</h3>
    <p className='text-2xl font-bold text-yellow-700'>{formattedIdleTime}</p>
  </div>
  <div className='bg-green-50 p-4 rounded-lg'>
    <h3 className='text-sm font-medium text-green-900'>Tiempo Total</h3>
    <p className='text-2xl font-bold text-green-700'>{formattedTotalTime}</p>
  </div>
</div>
```

**3. Barra de Progreso**

```tsx
<div className='space-y-2'>
  <div className='flex justify-between text-sm'>
    <span>Progreso del registro</span>
    <span>{progressPercentage}%</span>
  </div>
  <div className='w-full bg-gray-200 rounded-full h-2'>
    <div
      className='bg-blue-600 h-2 rounded-full transition-all duration-300'
      style={{ width: `${progressPercentage}%` }}
    />
  </div>
</div>
```

**4. Información de Pestañas**

```tsx
<div className='grid grid-cols-2 gap-4'>
  <div className='space-y-2'>
    <h3 className='text-sm font-medium'>Estado de Pestaña</h3>
    <div className='space-y-1 text-sm'>
      <div className='flex justify-between'>
        <span>Foco:</span>
        <span className={isFocused ? 'text-green-600' : 'text-red-600'}>
          {isFocused ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      <div className='flex justify-between'>
        <span>Visibilidad:</span>
        <span className={isVisible ? 'text-green-600' : 'text-red-600'}>
          {isVisible ? 'Visible' : 'Oculta'}
        </span>
      </div>
      <div className='flex justify-between'>
        <span>Browser:</span>
        <span className={isBrowserActive ? 'text-green-600' : 'text-red-600'}>
          {isBrowserActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>
    </div>
  </div>
  <div className='space-y-2'>
    <h3 className='text-sm font-medium'>Pestañas Abiertas</h3>
    <div className='space-y-1 text-sm'>
      <div className='flex justify-between'>
        <span>Total:</span>
        <span>{totalActiveTabs}</span>
      </div>
      <div className='flex justify-between'>
        <span>Esta app:</span>
        <span>{totalTabsInApp}</span>
      </div>
      <div className='flex justify-between'>
        <span>Otras:</span>
        <span>{otherTabsCount}</span>
      </div>
    </div>
  </div>
</div>
```

### 🔧 Hook Personalizado para el Modal

```typescript
interface UseActivityModalReturn {
  isOpen: boolean
  activityData: ActivityModalData
  openModal: () => void
  closeModal: () => void
  toggleModal: () => void
  refreshData: () => void
  isLoading: boolean
  error: string | null
}

interface ActivityModalData {
  status: ActivityStatusInfo
  times: CurrentRecordTimes
  tabs: TabInformation
  memory: MemoryStatistics
  technical: TechnicalInformation
  events: EventHistory
}

// Hook de uso
const useActivityModal = (options?: {
  autoRefresh?: boolean
  refreshInterval?: number
  showAdvancedInfo?: boolean
}): UseActivityModalReturn => {
  // Implementación del hook
}
```

### 🧪 Tests del Componente

```typescript
describe('ActivityModal', () => {
  it('should display current activity status', () => {
    render(<ActivityModal isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText(/Estado de Actividad/)).toBeInTheDocument()
    expect(screen.getByText(/Tiempo Activo/)).toBeInTheDocument()
    expect(screen.getByText(/Tiempo Inactivo/)).toBeInTheDocument()
  })

  it('should show tab information', () => {
    render(<ActivityModal isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText(/Estado de Pestaña/)).toBeInTheDocument()
    expect(screen.getByText(/Pestañas Abiertas/)).toBeInTheDocument()
  })

  it('should display memory statistics when advanced info is enabled', () => {
    render(
      <ActivityModal
        isOpen={true}
        onClose={jest.fn()}
        showAdvancedInfo={true}
      />
    )

    expect(screen.getByText(/Registros en Memoria/)).toBeInTheDocument()
    expect(screen.getByText(/Uso de Almacenamiento/)).toBeInTheDocument()
  })

  it('should auto-refresh data when enabled', () => {
    jest.useFakeTimers()

    render(
      <ActivityModal
        isOpen={true}
        onClose={jest.fn()}
        autoRefresh={true}
        refreshInterval={5000}
      />
    )

    // Verificar que los datos se actualizan automáticamente
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    // Verificar que se llamó la función de actualización
    expect(mockRefreshData).toHaveBeenCalled()
  })
})
```

### 📋 Integración con el Sistema

#### 🔌 Provider del Modal

```typescript
// ActivityModalProvider.tsx
interface ActivityModalProviderProps {
  children: React.ReactNode;
  defaultOptions?: {
    autoRefresh?: boolean;
    refreshInterval?: number;
    showAdvancedInfo?: boolean;
  };
}

const ActivityModalProvider: React.FC<ActivityModalProviderProps> = ({
  children,
  defaultOptions = {}
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalOptions, setModalOptions] = useState(defaultOptions)

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const contextValue = useMemo(() => ({
    isModalOpen,
    openModal,
    closeModal,
    modalOptions,
    setModalOptions
  }), [isModalOpen, modalOptions])

  return (
    <ActivityModalContext.Provider value={contextValue}>
      {children}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={closeModal}
        {...modalOptions}
      />
    </ActivityModalContext.Provider>
  )
}
```

#### 🎯 Uso en la Aplicación

```typescript
// En cualquier componente
const { openModal, closeModal } = useActivityModal()

// Botón para abrir el modal
<button
  onClick={openModal}
  className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
>
  <ActivityIcon className="w-6 h-6" />
</button>
```

### 🎯 Funcionalidades Adicionales

#### 📊 Exportación de Datos

- **Exportar a JSON:** Descargar datos actuales del modal
- **Exportar a CSV:** Descargar historial de eventos
- **Screenshot:** Capturar estado actual del modal

#### 🔔 Notificaciones

- **Notificaciones push:** Alertas sobre cambios de estado
- **Sonidos:** Feedback auditivo para eventos importantes
- **Vibración:** Feedback táctil en dispositivos móviles

#### 🎨 Personalización

- **Temas:** Modo claro/oscuro
- **Colores:** Personalización de colores de estado
- **Tamaños:** Diferentes tamaños de modal
- **Posiciones:** Diferentes posiciones en pantalla

---

## 📝 Licencia y Contribución

Este sistema está desarrollado siguiendo las mejores prácticas de arquitectura limpia y está diseñado para ser modular, escalable y mantenible.

Para contribuir:

1. Sigue los principios de **Clean Architecture**.
2. Mantén la **separación de responsabilidades**.
3. Escribe **tests unitarios** para nueva funcionalidad.
4. Documenta los **cambios importantes**.
5. Usa **TypeScript** estrictamente.
6. Sigue las **convecciones de nomenclatura**.
7. **Siempre escribe tests primero** (TDD).
8. **Mantén 100% de cobertura** en capas de aplicación e infraestructura.

---

**Desarrollado con ❤️ siguiendo principios de arquitectura limpia, Domain-Driven Design y Test-Driven Development.**

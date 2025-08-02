# 🖥️ Sistema de Registro de Actividad del Usuario

## 📋 Descripción

El **Sistema de Registro de Actividad del Usuario** es una solución completa para monitorear y registrar la actividad del usuario en una pestaña del navegador. Implementado siguiendo **arquitectura hexagonal**, **Domain-Driven Design (DDD)** y **principios SOLID**, proporciona un seguimiento preciso del tiempo de interacción, inactividad y estadísticas de uso.

## 🎯 Características Principales

### ✅ Funcionalidades Core

- **Monitoreo en tiempo real** de interacciones del usuario
- **Registro de tiempos** (activo, inactivo, total)
- **Detección de inactividad** con timeout configurable
- **Gestión de estados** (activo, suspendido, finalizado)
- **Eventos de pestaña** (visibilidad, foco)
- **Estadísticas detalladas** de uso

### 🔧 Configuración Flexible

- **Tiempo mínimo** para validar registros
- **Tiempo máximo de inactividad** personalizable
- **Intervalo de actualización** configurable
- **Eventos habilitados** selectivos
- **Tipos de interacción** configurables

### 📊 Eventos Soportados

- **Clics del mouse** (click, mousedown, mouseup)
- **Pulsaciones de teclado** (keydown, keyup)
- **Interacciones con formularios** (input, change)
- **Scroll de página** (scroll)
- **Eventos táctiles** (touchstart, touchmove, touchend)
- **Cambios de foco** (focus, blur)
- **Movimiento del mouse** (mousemove)
- **Cambios de visibilidad** (visibilitychange)
- **Cambios de foco de pestaña** (focus, blur)

## 🏗️ Arquitectura

### 📁 Estructura del Proyecto

```
src/
├── application/
│   └── domain/
│       └── track-activity/
│           ├── track-activity.model.ts          # Modelos y interfaces
│           ├── track-activity.service.ts        # Servicios de dominio
│           ├── track-activity.validator.ts      # Validaciones
│           ├── track-activity.factory.ts        # Factories
│           ├── track-activity.repository.memory.ts # Repositorio en memoria
│           ├── track-activity.event.bus.ts      # Bus de eventos
│           ├── track-activity.exceptions.ts     # Excepciones
│           └── index.ts                         # Exportaciones
└── infrastructure/
    └── components/
        └── track-activity/
            ├── track-activity.monitor.ts        # Monitor principal
            ├── track-activity.hook.ts           # Hook de React
            ├── track-activity.provider.tsx      # Provider de React
            ├── track-activity.component.tsx     # Componente UI
            ├── track-activity.scss              # Estilos
            ├── track-activity.example.tsx       # Ejemplos de uso
            └── index.ts                         # Exportaciones
```

### 🧩 Patrones de Diseño

- **Arquitectura Hexagonal** (Ports & Adapters)
- **Domain-Driven Design (DDD)**
- **Patrón Observer** (Event Bus)
- **Patrón Factory** (Creación de objetos)
- **Patrón Repository** (Acceso a datos)
- **Patrón Command** (Operaciones)
- **Patrón Validator** (Validaciones)
- **Value Objects** (Tiempos, estados)

## 🚀 Uso Básico

### 1. Configuración Básica

```tsx
import { TrackActivityProvider, TrackActivityComponent } from './track-activity'

function App() {
  return (
    <TrackActivityProvider autoStart={true}>
      <TrackActivityComponent
        showControls={true}
        showStats={true}
        showConfiguration={false}
        showDebugInfo={false}
      />
    </TrackActivityProvider>
  )
}
```

### 2. Configuración Personalizada

```tsx
import { TrackActivityProvider, TrackActivityComponent } from './track-activity'
import { TimeValueObject } from './domain'

function App() {
  return (
    <TrackActivityProvider
      autoStart={true}
      configuration={{
        minimumTime: TimeValueObject.fromSeconds(5),
        maxIdleTime: TimeValueObject.fromMinutes(30),
        updateInterval: TimeValueObject.fromSeconds(1),
      }}
      options={{
        onActivityStarted: record =>
          console.log('🟢 Actividad iniciada:', record.id),
        onActivityUpdated: record =>
          console.log('🔄 Actividad actualizada:', record.id),
        onActivityFinished: record =>
          console.log('🔴 Actividad finalizada:', record.id),
        onError: error => console.error('❌ Error:', error),
      }}
    >
      <TrackActivityComponent />
    </TrackActivityProvider>
  )
}
```

### 3. Uso con Hooks

```tsx
import {
  useTrackActivityContext,
  useTrackActivityMonitoring,
} from './track-activity'

function MyComponent() {
  const { state, actions } = useTrackActivityContext()
  const { isMonitoring, startMonitoring, stopMonitoring } =
    useTrackActivityMonitoring()

  return (
    <div>
      <p>Monitoreando: {isMonitoring ? '✅ Sí' : '❌ No'}</p>
      <button onClick={startMonitoring}>Iniciar</button>
      <button onClick={stopMonitoring}>Detener</button>
    </div>
  )
}
```

## ⚙️ Configuración

### Configuraciones Predefinidas

```typescript
// Desarrollo
{
  minimumTime: TimeValueObject.fromSeconds(2),
  maxIdleTime: TimeValueObject.fromMinutes(5),
  updateInterval: TimeValueObject.fromSeconds(1)
}

// Producción
{
  minimumTime: TimeValueObject.fromSeconds(10),
  maxIdleTime: TimeValueObject.fromMinutes(60),
  updateInterval: TimeValueObject.fromSeconds(5)
}

// Testing
{
  minimumTime: TimeValueObject.fromSeconds(1),
  maxIdleTime: TimeValueObject.fromMinutes(1),
  updateInterval: TimeValueObject.fromSeconds(0.5)
}
```

### Opciones de Configuración

| Propiedad             | Tipo                | Descripción                            | Valor por Defecto       |
| --------------------- | ------------------- | -------------------------------------- | ----------------------- |
| `minimumTime`         | `TimeValueObject`   | Tiempo mínimo para validar un registro | 5 segundos              |
| `maxIdleTime`         | `TimeValueObject`   | Tiempo máximo de inactividad           | 30 minutos              |
| `updateInterval`      | `TimeValueObject`   | Intervalo de actualización             | 1 segundo               |
| `enabledEvents`       | `EventType[]`       | Eventos habilitados                    | Todos los eventos       |
| `enabledInteractions` | `InteractionType[]` | Interacciones habilitadas              | Todas las interacciones |

## 📊 Estados del Sistema

### Estados de Actividad

- **`INACTIVE`** - No hay registro activo
- **`ACTIVE`** - Registro activo y monitoreando
- **`SUSPENDED`** - Registro suspendido temporalmente
- **`FINISHED`** - Registro finalizado

### Estados de Pestaña

- **`isTabVisible`** - Pestaña visible/oculta
- **`isTabFocused`** - Pestaña enfocada/sin foco

## 🎯 Eventos del Sistema

### Eventos de Ciclo de Vida

```typescript
// Inicio de actividad
'activity.started'

// Actualización de actividad
'activity.updated'

// Finalización de actividad
'activity.finished'

// Suspensión de actividad
'activity.suspended'

// Reanudación de actividad
'activity.resumed'
```

### Eventos de Interacción

```typescript
// Interacción del usuario detectada
'user.interaction.detected'

// Timeout de inactividad alcanzado
'idle.timeout.reached'

// Cambio de visibilidad de pestaña
'tab.visibility.changed'

// Cambio de foco de pestaña
'tab.focus.changed'
```

## 🔧 API del Sistema

### Hooks Disponibles

```typescript
// Hook principal
useTrackActivityContext()

// Hooks específicos
useTrackActivityState()
useTrackActivityActions()
useTrackActivityServices()
useTrackActivityMonitoring()
useTrackActivityConfiguration()
useTrackActivityStats()
useTrackActivityRecords()
useTrackActivityEvents()
useTrackActivityWithCallbacks()
useTrackActivityDebug()
```

### Acciones Disponibles

```typescript
// Control de monitoreo
startMonitoring()
stopMonitoring()

// Configuración
updateConfiguration(config)

// Registros
getActiveRecord()
getAllRecords()
clearRecords()

// Estadísticas
getStats()
```

## 📈 Estadísticas Disponibles

```typescript
interface ActivityStats {
  totalRecords: number
  totalActiveTime: TimeValueObject
  totalIdleTime: TimeValueObject
  averageSessionTime: TimeValueObject
  longestSession: TimeValueObject
  shortestSession: TimeValueObject
}
```

## 🎨 Personalización de UI

### Props del Componente

```typescript
interface TrackActivityComponentProps {
  showDebugInfo?: boolean // Mostrar información de debug
  showControls?: boolean // Mostrar controles
  showStats?: boolean // Mostrar estadísticas
  showConfiguration?: boolean // Mostrar configuración
  className?: string // Clases CSS adicionales
  style?: React.CSSProperties // Estilos inline
}
```

### Variables CSS Personalizables

```scss
:root {
  // Colores de estado
  --activity-state-active: #10b981;
  --activity-state-suspended: #f59e0b;
  --activity-state-finished: #ef4444;
  --activity-state-inactive: #6b7280;

  // Colores de monitoreo
  --activity-monitoring-active: #10b981;
  --activity-monitoring-inactive: #6b7280;

  // Colores de pestaña
  --activity-tab-visible: #10b981;
  --activity-tab-hidden: #ef4444;
  --activity-tab-focused: #10b981;
  --activity-tab-unfocused: #f59e0b;

  // Colores de botones
  --activity-button-start: #10b981;
  --activity-button-stop: #ef4444;
  --activity-button-clear: #f59e0b;
  --activity-button-details: #3b82f6;
}
```

## 🧪 Ejemplos de Uso

### Ejemplo Básico

```tsx
import { TrackActivityProvider, TrackActivityComponent } from './track-activity'

export function BasicExample() {
  return (
    <TrackActivityProvider autoStart={true}>
      <TrackActivityComponent
        showControls={true}
        showStats={true}
        showConfiguration={false}
        showDebugInfo={false}
      />
    </TrackActivityProvider>
  )
}
```

### Ejemplo con Configuración Personalizada

```tsx
import { TrackActivityProvider, TrackActivityComponent } from './track-activity'
import { TimeValueObject } from './domain'

export function CustomExample() {
  return (
    <TrackActivityProvider
      autoStart={true}
      configuration={{
        minimumTime: TimeValueObject.fromSeconds(3),
        maxIdleTime: TimeValueObject.fromMinutes(5),
        updateInterval: TimeValueObject.fromSeconds(2),
      }}
      options={{
        onActivityStarted: record => {
          console.log('🟢 Actividad iniciada:', record.id)
        },
        onActivityUpdated: record => {
          console.log('🔄 Actividad actualizada:', record.id)
        },
        onActivityFinished: record => {
          console.log('🔴 Actividad finalizada:', record.id)
        },
        onError: error => {
          console.error('❌ Error en track activity:', error)
        },
      }}
    >
      <TrackActivityComponent
        showControls={true}
        showStats={true}
        showConfiguration={true}
        showDebugInfo={true}
      />
    </TrackActivityProvider>
  )
}
```

### Ejemplo con Hooks Personalizados

```tsx
import {
  useTrackActivityContext,
  useTrackActivityMonitoring,
} from './track-activity'

export function HooksExample() {
  const { state, actions } = useTrackActivityContext()
  const { isMonitoring, startMonitoring, stopMonitoring } =
    useTrackActivityMonitoring()

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>Ejemplo con Hooks</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Estado del monitoreo */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Estado del Monitoreo</h3>
          <p>Monitoreando: {isMonitoring ? '✅ Sí' : '❌ No'}</p>
          <div className='mt-4 space-y-2'>
            <button
              onClick={startMonitoring}
              disabled={isMonitoring}
              className='bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50'
            >
              Iniciar Monitoreo
            </button>
            <button
              onClick={stopMonitoring}
              disabled={!isMonitoring}
              className='bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50 ml-2'
            >
              Detener Monitoreo
            </button>
          </div>
        </div>

        {/* Acciones */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Acciones</h3>
          <div className='space-y-2'>
            <button
              onClick={actions.clearRecords}
              className='bg-yellow-500 text-white px-4 py-2 rounded w-full'
            >
              Limpiar Registros
            </button>
            <button
              onClick={() => actions.getStats().then(console.log)}
              className='bg-blue-500 text-white px-4 py-2 rounded w-full'
            >
              Obtener Estadísticas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 🔍 Debugging

### Información de Debug

```tsx
import { useTrackActivityDebug } from './track-activity'

function DebugComponent() {
  const { debugInfo, debugActions } = useTrackActivityDebug()

  return (
    <div>
      <h3>Información de Debug</h3>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>

      <button onClick={debugActions.logState}>Log Estado</button>
      <button onClick={debugActions.logActiveRecord}>
        Log Registro Activo
      </button>
      <button onClick={debugActions.logStats}>Log Estadísticas</button>
      <button onClick={debugActions.logConfiguration}>Log Configuración</button>
    </div>
  )
}
```

## 🚨 Manejo de Errores

### Excepciones Disponibles

```typescript
// Excepciones de registro
ActivityRecordNotFoundException
ActivityRecordAlreadyExistsException
ActivityRecordInvalidStateException

// Excepciones de configuración
ActivityConfigurationInvalidException

// Excepciones de eventos
ActivityEventInvalidException

// Excepciones de monitoreo
ActivityMonitoringNotStartedException
ActivityMonitoringAlreadyStartedException

// Excepciones de tiempo
ActivityTimeValueInvalidException

// Excepciones del bus de eventos
ActivityEventBusNotInitializedException
```

### Ejemplo de Manejo de Errores

```tsx
<TrackActivityProvider
  options={{
    onError: error => {
      console.error('Error en track activity:', error)

      // Notificar al usuario
      if (error.name === 'ActivityMonitoringAlreadyStartedException') {
        alert('El monitoreo ya está activo')
      } else if (error.name === 'ActivityConfigurationInvalidException') {
        alert('Configuración inválida')
      }
    },
  }}
>
  <TrackActivityComponent />
</TrackActivityProvider>
```

## 📋 Requisitos Técnicos

### Dependencias

- **React** 18+
- **TypeScript** 4.9+
- **SCSS** (para estilos)
- **Tailwind CSS** (opcional, para utilidades)

### Navegadores Soportados

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### APIs del Navegador Utilizadas

- **DOM Events** (click, keydown, scroll, etc.)
- **Page Visibility API** (document.visibilityState)
- **Window Focus API** (window.focus, window.blur)
- **setInterval** (para actualizaciones periódicas)

## 🔧 Desarrollo

### Estructura de Desarrollo

```bash
# Estructura recomendada para desarrollo
src/
├── application/
│   └── domain/
│       └── track-activity/
│           ├── __tests__/                    # Tests unitarios
│           ├── __mocks__/                    # Mocks para testing
│           └── ...
└── infrastructure/
    └── components/
        └── track-activity/
            ├── __tests__/                    # Tests de componentes
            ├── __stories__/                  # Storybook stories
            └── ...
```

### Testing

```typescript
// Ejemplo de test unitario
import { ActivityRecordService } from './track-activity.service'
import { ActivityRecordMemoryRepository } from './track-activity.repository.memory'

describe('ActivityRecordService', () => {
  let service: ActivityRecordService
  let repository: ActivityRecordMemoryRepository

  beforeEach(() => {
    repository = new ActivityRecordMemoryRepository()
    service = new ActivityRecordService(repository, eventBus, validator, config)
  })

  it('should start a new record', async () => {
    const record = await service.startRecord(EventType.USER_INTERACTION)
    expect(record.state).toBe(ActivityState.ACTIVE)
  })
})
```

## 📝 Licencia

Este sistema está desarrollado siguiendo las mejores prácticas de arquitectura limpia y está diseñado para ser modular, escalable y mantenible.

## 🤝 Contribución

Para contribuir al desarrollo de este sistema:

1. Sigue los principios de **Clean Architecture**
2. Mantén la **separación de responsabilidades**
3. Escribe **tests unitarios** para nueva funcionalidad
4. Documenta los **cambios importantes**
5. Usa **TypeScript** estrictamente
6. Sigue las **convenciones de nomenclatura**

---

**Desarrollado con ❤️ siguiendo principios de arquitectura limpia y Domain-Driven Design.**

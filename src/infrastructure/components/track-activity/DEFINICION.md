# 🖥️ Sistema de Registro de Actividad del Usuario en Pestaña del Navegador

## 🎯 Propósito

Desarrollar un sistema robusto para monitorear y registrar el tiempo de interacción del usuario en **una única pestaña activa** de una aplicación web. El objetivo es obtener registros precisos del comportamiento activo e inactivo del usuario, útiles para análisis de uso, control de atención o validación de sesiones.

---

## 📦 ¿Qué es un Registro de Actividad?

Un **registro de actividad** es una unidad de tiempo monitoreada, compuesta por:

- `minimumTime`: Tiempo base requerido para validar un registro.
- `activeTime`: Tiempo acumulado desde el inicio hasta la última interacción del usuario.
- `idleTime`: Tiempo desde la última interacción hasta el momento de revisión.
- `totalTime`: Suma de `minimumTime + activeTime + idleTime`.

---

## 🚦 Condiciones para Iniciar un Registro

Un registro solo puede iniciar si se cumplen simultáneamente:

- La pestaña está **activa y visible**.
- Ocurre al menos uno de los siguientes eventos:
  - El usuario realiza una **acción válida** (clic, scroll, entrada de texto, etc.).
  - La página ha sido completamente cargada.
  - Un script o proceso solicita explícitamente el inicio.

---

## ✅ Validación de un Registro

Un registro se considera **válido** solo si ha acumulado un tiempo igual o superior al `minimumTime`.

---

## ⛔ Suspensión y Finalización

- **Suspensión:**
  Un registro entra en suspensión si:
  - El usuario supera el `maxIdleTime` permitido (tiempo máximo de inactividad).
  - El usuario abre otra pestaña de la misma aplicación en el navegador.

  En ambos casos, el sistema detiene el monitoreo y evita seguir registrando actividad.

- **Finalización:**
  Ocurre cuando se alcanza el `maxIdleTime` o por cierre explícito. El registro se marca como finalizado y se emite el evento correspondiente.

---

## 🔁 Ciclo de Vida del Registro

1. **Inicio:** Se dispara por evento (interacción, carga o script).
2. **Seguimiento:** Se actualiza periódicamente mientras esté activo.
3. **Suspensión/Finalización:** Por inactividad, cambio de pestaña o cierre.

---

## 📤 Eventos Emitidos

- `activity.started`: Nuevo registro iniciado.
- `activity.updated`: Actualización periódica del registro.
- `activity.finished`: Registro finalizado por inactividad o cierre.
- `activity.suspended`: Registro suspendido por cambio de pestaña o inactividad prolongada.
- `activity.resumed`: Reanudación de un registro suspendido.

Todos los eventos incluyen información relevante del estado del registro y pueden ser suscritos por otros componentes de la aplicación.

---

## ⚙️ Comportamiento del Sistema

- Solo se permite **un registro activo por aplicación/pestaña**.
- Si hay múltiples pestañas abiertas, solo una puede estar en monitoreo activo.
- El sistema **no consume recursos** si no hay registro activo.
- Los registros se persisten temporalmente en IndexedDB para resiliencia ante recargas o cierres inesperados.
- Al iniciar, el sistema recupera registros pendientes y valida su integridad.

---

## 🧠 Reglas de Negocio Clave

- El sistema debe ser **autosuficiente** y desacoplado, siguiendo principios SOLID y arquitectura hexagonal.
- Los eventos del sistema deben ser **observables** y permitir integración con otros módulos.
- La reanudación de actividad después de una finalización genera un **nuevo registro**.
- El sistema debe soportar **auto-limpieza** de registros finalizados o permitir gestión manual.

---

## 💾 Persistencia Temporal

- Los registros activos se guardan en IndexedDB.
- Al iniciar, se recuperan registros no finalizados y se validan.
- Registros que no cumplen con `minimumTime` se eliminan automáticamente.
- Se evita dejar registros huérfanos o inconsistentes entre sesiones.

---

## 📐 Especificación Técnica

- **Lenguaje:** TypeScript
- **Arquitectura:** Hexagonal (Domain + Application + Infrastructure)
- **Principios:** SOLID, DDD, Clean Code
- **Persistencia:** IndexedDB (local, controlada)
- **Control de actividad:** Solo una pestaña activa puede generar registros
- **Eventos:** Emitidos al iniciar, actualizar, suspender o finalizar un registro
- **Consumo de recursos:** Cero cuando no hay registro activo
- **Configuración:** Extensible, permite auto-limpieza o gestión manual

---

## 🧪 Escenarios Soportados

- Registro iniciado por carga automática o acción del usuario.
- Recuperación de registros pendientes tras recarga.
- Descarte automático de registros inválidos.
- Eliminación de registros huérfanos al iniciar.
- Activación manual por scripts de terceros.
- Desactivación temporal por pérdida de foco o visibilidad.

---

## 🧪 Desarrollo TDD y Cobertura de Tests

### 🎯 Metodología TDD (Test-Driven Development)

El desarrollo de este sistema debe seguir **estrictamente** la metodología TDD:

1. **Red (Red):** Escribir un test que falle
2. **Green (Green):** Escribir el código mínimo para que el test pase
3. **Refactor (Refactor):** Mejorar el código manteniendo los tests pasando

### 📊 Requisitos de Cobertura

**Cobertura obligatoria del 100%** en las siguientes capas:

#### ✅ Capa de Aplicación (Application Layer)

- **Cobertura requerida:** 100%
- **Componentes a cubrir:**
  - Servicios (`ActivityRecordService`, `ActivityEventService`, `ActivityConfigurationService`)
  - Factories (`ActivityRecordFactory`, `ActivityEventFactory`)
  - Validators (`ActivityValidator`)
  - Event Bus (`ActivityEventBus`)
  - Repositorios (`ActivityRecordMemoryRepository`, `ActivityRecordIndexedDBRepository`)
  - Excepciones (todas las excepciones de dominio)

#### ✅ Capa de Infraestructura (Infrastructure Layer)

- **Cobertura requerida:** 100%
- **Componentes a cubrir:**
  - Monitor (`ActivityMonitor`)
  - Utilidades (`formatActivityTime`, `getActivityStateColor`, etc.)
  - Componentes React (hooks, providers, componentes)
  - Servicios de recuperación (`ActivityRecoveryService`)

### 🧪 Tipos de Tests Requeridos

#### ✅ Tests Unitarios

- **Cobertura:** 100% de funciones y métodos
- **Enfoque:** Lógica de negocio, validaciones, cálculos
- **Herramientas:** Vitest, Jest, o similar

#### ✅ Tests de Integración

- **Cobertura:** Flujos completos entre capas
- **Enfoque:** Interacción entre servicios, repositorios y monitor
- **Herramientas:** Mocks y stubs para dependencias externas

#### ✅ Tests de Componentes

- **Cobertura:** Componentes React y hooks
- **Enfoque:** Renderizado, interacciones, estado
- **Herramientas:** React Testing Library

### 📋 Criterios de Aceptación para Tests

1. **Tests deben ser legibles:** Nombres descriptivos y estructura clara
2. **Tests deben ser independientes:** No dependencias entre tests
3. **Tests deben ser rápidos:** Ejecución en menos de 1 segundo por test
4. **Tests deben ser determinísticos:** Mismo resultado siempre
5. **Tests deben cubrir casos edge:** Valores límite, errores, excepciones

### 🔧 Configuración de Tests

```typescript
// Ejemplo de estructura de test TDD
describe('ActivityRecordService', () => {
  describe('startRecord', () => {
    it('should create a new record when no active record exists', async () => {
      // Arrange
      const repository = new MockRepository()
      const eventBus = new MockEventBus()
      const service = new ActivityRecordService(repository, eventBus)

      // Act
      const record = await service.startRecord(EventType.USER_INTERACTION)

      // Assert
      expect(record).toBeDefined()
      expect(record.state).toBe(ActivityState.ACTIVE)
      expect(eventBus.publishActivityStarted).toHaveBeenCalledWith(record)
    })
  })
})
```

### 📊 Métricas de Cobertura

- **Statements:** 100% en capas de aplicación e infraestructura
- **Branches:** 100% de ramas de código cubiertas
- **Functions:** 100% de funciones testeadas
- **Lines:** 100% de líneas de código ejecutadas

### 🚫 Excepciones a la Cobertura

Solo se permiten excepciones en:

- **Configuraciones:** Archivos de configuración
- **Tipos:** Definiciones de tipos TypeScript
- **Index files:** Archivos de exportación
- **Error boundaries:** Manejo de errores no controlados

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

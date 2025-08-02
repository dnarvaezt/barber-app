// ============================================================================
// TRACK ACTIVITY EXAMPLE - Ejemplo de uso del sistema
// ============================================================================

import { TimeValueObject } from '../application'
import { TrackActivityComponent, TrackActivityProvider } from './index'
import {
  useTrackActivityContext,
  useTrackActivityEvents,
  useTrackActivityMonitoring,
  useTrackActivityStats,
} from './track-activity.hooks'

// ============================================================================
// EJEMPLO BÁSICO
// ============================================================================

export function TrackActivityBasicExample() {
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

// ============================================================================
// EJEMPLO CON CONFIGURACIÓN PERSONALIZADA
// ============================================================================

export function TrackActivityCustomExample() {
  return (
    <TrackActivityProvider
      autoStart={true}
      configuration={{
        minimumTime: TimeValueObject.fromSeconds(3), // 3 segundos
        maxIdleTime: TimeValueObject.fromMinutes(5), // 5 minutos
        updateInterval: TimeValueObject.fromSeconds(2), // 2 segundos
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

// ============================================================================
// EJEMPLO CON HOOKS PERSONALIZADOS
// ============================================================================

export function TrackActivityHooksExample() {
  return (
    <TrackActivityProvider autoStart={true}>
      <TrackActivityHooksComponent />
    </TrackActivityProvider>
  )
}

function TrackActivityHooksComponent() {
  const { actions } = useTrackActivityContext()
  const { isMonitoring, startMonitoring, stopMonitoring } =
    useTrackActivityMonitoring()
  const { activeRecord } = useTrackActivityEvents()
  const { stats } = useTrackActivityStats()

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

        {/* Registro activo */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Registro Activo</h3>
          {activeRecord ? (
            <div>
              <p>
                <strong>ID:</strong> {activeRecord.id}
              </p>
              <p>
                <strong>Estado:</strong> {activeRecord.state}
              </p>
              <p>
                <strong>Tiempo Activo:</strong>{' '}
                {activeRecord.activeTime.seconds}s
              </p>
              <p>
                <strong>Tiempo Inactivo:</strong>{' '}
                {activeRecord.idleTime.seconds}s
              </p>
            </div>
          ) : (
            <p className='text-gray-500'>No hay registro activo</p>
          )}
        </div>

        {/* Estadísticas */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Estadísticas</h3>
          <p>
            <strong>Total de Registros:</strong> {stats.totalRecords}
          </p>
          <p>
            <strong>Tiempo Promedio:</strong> {stats.averageSessionTime.seconds}
            s
          </p>
          <p>
            <strong>Sesión Más Larga:</strong> {stats.longestSession.seconds}s
          </p>
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

// ============================================================================
// EJEMPLO INTEGRADO EN UNA APLICACIÓN
// ============================================================================

export function TrackActivityIntegratedExample() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Barber App - Sistema de Actividad
            </h1>
            <div className='text-sm text-gray-500'>
              Monitoreo de actividad del usuario
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <TrackActivityProvider
          autoStart={true}
          configuration={{
            minimumTime: TimeValueObject.fromSeconds(5), // 5 segundos
            maxIdleTime: TimeValueObject.fromMinutes(10), // 10 minutos
            updateInterval: TimeValueObject.fromSeconds(1), // 1 segundo
          }}
          options={{
            onActivityStarted: record => {
              console.log('🎯 Nueva sesión iniciada:', record.id)
            },
            onActivityFinished: record => {
              console.log(
                '🏁 Sesión finalizada:',
                record.id,
                'Duración:',
                record.totalTime.seconds,
                's'
              )
            },
          }}
        >
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Panel principal */}
            <div className='lg:col-span-2'>
              <TrackActivityComponent
                showControls={true}
                showStats={true}
                showConfiguration={false}
                showDebugInfo={false}
              />
            </div>

            {/* Panel lateral */}
            <div className='space-y-6'>
              <div className='bg-white overflow-hidden shadow rounded-lg'>
                <div className='px-4 py-5 sm:p-6'>
                  <h3 className='text-lg leading-6 font-medium text-gray-900'>
                    Información del Sistema
                  </h3>
                  <div className='mt-2 max-w-xl text-sm text-gray-500'>
                    <p>
                      Este sistema monitorea la actividad del usuario en tiempo
                      real, registrando interacciones, tiempos de inactividad y
                      estadísticas de uso.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white overflow-hidden shadow rounded-lg'>
                <div className='px-4 py-5 sm:p-6'>
                  <h3 className='text-lg leading-6 font-medium text-gray-900'>
                    Eventos Detectados
                  </h3>
                  <div className='mt-2 text-sm text-gray-500'>
                    <ul className='space-y-1'>
                      <li>✅ Clics del mouse</li>
                      <li>✅ Pulsaciones de teclas</li>
                      <li>✅ Scroll de página</li>
                      <li>✅ Interacciones con formularios</li>
                      <li>✅ Cambios de foco</li>
                      <li>✅ Cambios de visibilidad</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TrackActivityProvider>
      </main>
    </div>
  )
}

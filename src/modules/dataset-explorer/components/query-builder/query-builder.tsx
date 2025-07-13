import { useState } from 'react'
import { Icon } from '../../../../components'
import './query-builder.scss'

import type { Dataset, Query } from '../../use-dataset-explorer'
interface QueryBuilderProps {
  dataset: Dataset
  queries: Query[]
  onAddQuery: (query: string) => void
  onExecuteQuery: (queryId: string) => void
  isLoading: boolean
}

export const QueryBuilder = ({
  dataset,
  queries,
  onAddQuery,
  onExecuteQuery,
  isLoading,
}: QueryBuilderProps) => {
  const [newQuery, setNewQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newQuery.trim()) {
      onAddQuery(newQuery)
      setNewQuery('')
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className='query-builder'>
      <div className='query-builder__header'>
        <h2 className='query-builder__title'>Constructor de Consultas</h2>
        <p className='query-builder__description'>
          Escribe consultas para filtrar y explorar tu dataset
        </p>
      </div>

      <form onSubmit={handleSubmit} className='query-builder__form'>
        <div className='query-builder__input-group'>
          <input
            type='text'
            value={newQuery}
            onChange={e => setNewQuery(e.target.value)}
            placeholder='Escribe tu consulta aquí... (ej: "Madrid" para buscar en Madrid)'
            className='query-builder__input'
            disabled={isLoading}
          />
          <button
            type='submit'
            className='query-builder__submit-button'
            disabled={!newQuery.trim() || isLoading}
          >
            <Icon name='fa-solid fa-search' />
            <span>Agregar Consulta</span>
          </button>
        </div>
      </form>

      <div className='query-builder__queries'>
        <h3 className='query-builder__queries-title'>Consultas Guardadas</h3>

        {queries.length === 0 ? (
          <div className='query-builder__empty'>
            <Icon name='fa-solid fa-search' />
            <p>No hay consultas guardadas. Crea tu primera consulta arriba.</p>
          </div>
        ) : (
          <div className='query-builder__queries-list'>
            {queries.map(query => (
              <div key={query.id} className='query-builder__query-item'>
                <div className='query-builder__query-header'>
                  <h4 className='query-builder__query-name'>{query.name}</h4>
                  <div className='query-builder__query-actions'>
                    <button
                      onClick={() => onExecuteQuery(query.id)}
                      disabled={isLoading}
                      className='query-builder__execute-button'
                    >
                      <Icon name='fa-solid fa-play' />
                      <span>Ejecutar</span>
                    </button>
                  </div>
                </div>

                <div className='query-builder__query-content'>
                  <p className='query-builder__query-text'>{query.query}</p>

                  {query.executedAt && (
                    <div className='query-builder__query-meta'>
                      <span className='query-builder__query-date'>
                        Ejecutada: {formatDate(query.executedAt)}
                      </span>
                      {query.result && (
                        <span className='query-builder__query-results'>
                          Resultados: {query.result.length} filas
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {query.result && query.result.length > 0 && (
                  <div className='query-builder__results'>
                    <h5 className='query-builder__results-title'>
                      Resultados:
                    </h5>
                    <div className='query-builder__results-table'>
                      <table className='query-builder__table'>
                        <thead>
                          <tr>
                            {dataset.columns.map(column => (
                              <th key={column} className='query-builder__th'>
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {query.result.slice(0, 5).map((row, index) => (
                            <tr key={index} className='query-builder__tr'>
                              {dataset.columns.map(column => (
                                <td key={column} className='query-builder__td'>
                                  {String(row[column] || '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {query.result.length > 5 && (
                        <p className='query-builder__results-more'>
                          Mostrando 5 de {query.result.length} resultados
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

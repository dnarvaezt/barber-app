import { useCallback, useState } from 'react'
import { DefaultDataset } from './dataset.data'

export interface DatasetRow {
  [key: string]: string | number | boolean
}

export interface Dataset {
  data: DatasetRow[]
  columns: string[]
  name: string
  totalRows: number
}

export interface Query {
  id: string
  name: string
  query: string
  result?: DatasetRow[]
  executedAt?: Date
}

export interface QueryResult {
  data: DatasetRow[]
  totalRows: number
  executionTime: number
}

// Función helper para convertir cualquier array de objetos a Dataset
const convertToDataset = (data: unknown[], name: string): Dataset => {
  if (data.length === 0) {
    return {
      data: [],
      columns: [],
      name,
      totalRows: 0,
    }
  }

  // Verificar que el primer elemento sea un objeto
  const firstItem = data[0]
  if (typeof firstItem !== 'object' || firstItem === null) {
    throw new Error('Los datos deben ser un array de objetos')
  }

  // Extraer columnas del primer objeto
  const columns = Object.keys(firstItem as Record<string, unknown>)

  // Convertir cada objeto a DatasetRow
  const datasetRows: DatasetRow[] = data.map(item => {
    if (typeof item !== 'object' || item === null) {
      throw new Error('Todos los elementos deben ser objetos')
    }

    const row = item as Record<string, unknown>
    const convertedRow: DatasetRow = {}

    columns.forEach(column => {
      const value = row[column]
      // Convertir valores complejos a string para compatibilidad
      if (typeof value === 'object' && value !== null) {
        convertedRow[column] = JSON.stringify(value)
      } else {
        convertedRow[column] = String(value)
      }
    })
    return convertedRow
  })

  return {
    data: datasetRows,
    columns,
    name,
    totalRows: datasetRows.length,
  }
}

export const useDatasetExplorer = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [queries, setQueries] = useState<Query[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDefaultDataset = useCallback(() => {
    const convertedDataset = convertToDataset(DefaultDataset, 'Empleados')
    setDataset(convertedDataset)
    setError(null)
  }, [])

  const uploadDataset = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())

      if (lines.length < 2) {
        throw new Error(
          'El archivo debe contener al menos una fila de encabezados y una fila de datos'
        )
      }

      const headers = lines[0].split(',').map(h => h.trim())
      const data: DatasetRow[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const row: DatasetRow = {}

        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })

        data.push(row)
      }

      const newDataset: Dataset = {
        name: file.name.replace(/\.[^/.]+$/, ''),
        columns: headers,
        data,
        totalRows: data.length,
      }

      setDataset(newDataset)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar el archivo'
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función para cargar cualquier array de objetos
  const loadDataset = useCallback((data: unknown[], name: string) => {
    const convertedDataset = convertToDataset(data, name)
    setDataset(convertedDataset)
    setError(null)
  }, [])

  const clearDataset = useCallback(() => {
    setDataset(null)
    setQueries([])
    setError(null)
  }, [])

  const addQuery = useCallback(
    (query: string) => {
      if (!query.trim()) return

      const newQuery: Query = {
        id: Date.now().toString(),
        name: `Consulta ${queries.length + 1}`,
        query: query.trim(),
      }

      setQueries(prev => [...prev, newQuery])
    },
    [queries.length]
  )

  const executeQuery = useCallback(
    async (queryId: string) => {
      if (!dataset) return

      setIsLoading(true)
      setError(null)

      try {
        const query = queries.find(q => q.id === queryId)
        if (!query) throw new Error('Consulta no encontrada')

        // Simulación de ejecución de consulta
        await new Promise(resolve => setTimeout(resolve, 500))

        // Filtrado simple basado en el texto de la consulta
        const queryText = query.query.toLowerCase()
        const filteredData = dataset.data.filter(row => {
          return Object.values(row).some(value =>
            String(value).toLowerCase().includes(queryText)
          )
        })

        const result: QueryResult = {
          data: filteredData,
          totalRows: filteredData.length,
          executionTime: 500,
        }

        // Actualizar la consulta con el resultado
        setQueries(prev =>
          prev.map(q =>
            q.id === queryId
              ? { ...q, result: result.data, executedAt: new Date() }
              : q
          )
        )
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al ejecutar la consulta'
        )
      } finally {
        setIsLoading(false)
      }
    },
    [dataset, queries]
  )

  return {
    dataset,
    queries,
    isLoading,
    error,
    loadDefaultDataset,
    loadDataset,
    uploadDataset,
    addQuery,
    executeQuery,
    clearDataset,
  }
}

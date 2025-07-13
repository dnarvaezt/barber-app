import { useState } from 'react'
import './dataset-viewer.scss'

import type { Dataset } from '../../use-dataset-explorer'
interface DatasetViewerProps {
  dataset: Dataset
}

export const DatasetViewer = ({ dataset }: DatasetViewerProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const totalPages = Math.ceil(dataset.totalRows / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = dataset.data.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className='dataset-viewer'>
      <div className='dataset-viewer__header'>
        <h2 className='dataset-viewer__title'>{dataset.name}</h2>
        <div className='dataset-viewer__stats'>
          <span className='dataset-viewer__stat'>
            <strong>{dataset.totalRows}</strong> filas
          </span>
          <span className='dataset-viewer__stat'>
            <strong>{dataset.columns.length}</strong> columnas
          </span>
        </div>
      </div>

      <div className='dataset-viewer__table-container'>
        <table className='dataset-viewer__table'>
          <thead className='dataset-viewer__thead'>
            <tr>
              {dataset.columns.map(column => (
                <th key={column} className='dataset-viewer__th'>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='dataset-viewer__tbody'>
            {currentData.map((row, index) => (
              <tr key={startIndex + index} className='dataset-viewer__tr'>
                {dataset.columns.map(column => (
                  <td key={column} className='dataset-viewer__td'>
                    {String(row[column] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className='dataset-viewer__pagination'>
          <button
            className='dataset-viewer__page-button'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          <div className='dataset-viewer__page-info'>
            Página {currentPage} de {totalPages}
          </div>

          <button
            className='dataset-viewer__page-button'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

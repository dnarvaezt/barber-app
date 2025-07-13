import { useRef } from 'react'
import { Icon } from '../../../../components'
import './dataset-uploader.scss'

import type { ChangeEvent } from 'react'
interface DatasetUploaderProps {
  onUpload: (file: File) => void
  onLoadDefault: () => void
  onClear: () => void
  isLoading: boolean
  hasDataset: boolean
}

export const DatasetUploader = ({
  onUpload,
  onLoadDefault,
  onClear,
  isLoading,
  hasDataset,
}: DatasetUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='dataset-uploader'>
      <div className='dataset-uploader__header'>
        <h2 className='dataset-uploader__title'>Cargar Dataset</h2>
        <p className='dataset-uploader__description'>
          Sube un archivo CSV o usa el dataset de ejemplo para comenzar a
          explorar
        </p>
      </div>

      <div className='dataset-uploader__actions'>
        <button
          className='dataset-uploader__button dataset-uploader__button--primary'
          onClick={handleUploadClick}
          disabled={isLoading}
        >
          <Icon name='fa-solid fa-upload' />
          <span>Subir Archivo CSV</span>
        </button>

        <button
          className='dataset-uploader__button dataset-uploader__button--secondary'
          onClick={onLoadDefault}
          disabled={isLoading}
        >
          <Icon name='fa-solid fa-database' />
          <span>Cargar Dataset de Ejemplo</span>
        </button>

        {hasDataset && (
          <button
            className='dataset-uploader__button dataset-uploader__button--danger'
            onClick={onClear}
            disabled={isLoading}
          >
            <Icon name='fa-solid fa-trash' />
            <span>Limpiar Dataset</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='.csv'
        onChange={handleFileChange}
        className='dataset-uploader__file-input'
      />

      {isLoading && (
        <div className='dataset-uploader__loading'>
          <div className='dataset-uploader__spinner'></div>
          <span>Cargando dataset...</span>
        </div>
      )}
    </div>
  )
}

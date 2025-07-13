import { useEffect } from 'react'
import { useLayout } from '../../components'
import { DatasetUploader, DatasetViewer, QueryBuilder } from './components'
import './dataset-explorer.scss'
import { useDatasetExplorer } from './use-dataset-explorer'

export const DatasetExplorer = () => {
  const { setHeaderTitle, setHeaderActions } = useLayout()
  const {
    dataset,
    queries,
    isLoading,
    error,
    loadDefaultDataset,
    uploadDataset,
    addQuery,
    executeQuery,
    clearDataset,
  } = useDatasetExplorer()

  useEffect(() => {
    setHeaderTitle('Explorador de Datasets')
    setHeaderActions(undefined)
  }, [setHeaderTitle, setHeaderActions])

  return (
    <div className='dataset-explorer'>
      <div className='dataset-explorer__content'>
        <div className='dataset-explorer__section'>
          <DatasetUploader
            onUpload={uploadDataset}
            onLoadDefault={loadDefaultDataset}
            onClear={clearDataset}
            isLoading={isLoading}
            hasDataset={!!dataset}
          />
        </div>

        {error && (
          <div className='dataset-explorer__error'>
            <p className='dataset-explorer__error-message'>{error}</p>
          </div>
        )}

        {dataset && (
          <>
            <div className='dataset-explorer__section'>
              <DatasetViewer dataset={dataset} />
            </div>

            <div className='dataset-explorer__section'>
              <QueryBuilder
                dataset={dataset}
                queries={queries}
                onAddQuery={addQuery}
                onExecuteQuery={executeQuery}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

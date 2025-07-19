import { JSONList } from './components/json-list'
import { DatasetExplorerContext } from './dataset-explorer.context'
import { useDatasetExplorer } from './dataset-explorer.hook'
import './dataset-explorer.scss'
import { DefaultDataset } from './utils'

export const DatasetExplorer = () => {
  const datasetExplorer = useDatasetExplorer({ initialData: DefaultDataset })
  const { data } = datasetExplorer

  return (
    <DatasetExplorerContext.Provider value={datasetExplorer}>
      <div className='dataset-explorer'>
        <div className='dataset-explorer__content'>
          <div className='dataset-explorer__data'>
            <JSONList items={data} />
          </div>
          <div className='dataset-explorer__editor'></div>
          <div></div>
        </div>
      </div>
    </DatasetExplorerContext.Provider>
  )
}

import { useState } from 'react'

export interface DatasetExplorerHook {
  data: any[]
  updateData: (data: any[]) => void
}

export const useDatasetExplorer = ({
  initialData,
}: {
  initialData: any[]
}): DatasetExplorerHook => {
  const [data, setData] = useState<any[]>(initialData)

  const updateData = (newData: any[]) => {
    setData(newData)
  }

  return {
    data,
    updateData,
  }
}

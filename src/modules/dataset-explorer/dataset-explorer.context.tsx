import { createContext } from 'react'
import { type DatasetExplorerHook } from './dataset-explorer.hook'

export const DatasetExplorerContext = createContext<
  DatasetExplorerHook | undefined
>(undefined)

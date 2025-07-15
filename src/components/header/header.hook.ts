import { useLayout } from '../layout/layout.hook'

export const useHeader = () => {
  const { headerTitle, headerVisible, headerActions, toggleSidebar } =
    useLayout()

  return {
    headerTitle,
    headerVisible,
    headerActions,
    toggleSidebar,
  }
}

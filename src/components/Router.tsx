import { BrowserRouter } from 'react-router-dom'
import { useBasePath } from '../hooks'

interface RouterProps {
  children: React.ReactNode
}

export const Router: React.FC<RouterProps> = ({ children }) => {
  const basePath = useBasePath()

  return (
    <BrowserRouter basename={basePath === '/' ? undefined : basePath}>
      {children}
    </BrowserRouter>
  )
}

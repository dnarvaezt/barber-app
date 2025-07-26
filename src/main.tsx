import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app.tsx'
import './infrastructure/assets/styles/main.scss'
import './infrastructure/components/icons/icon.init.ts'
import { config } from './infrastructure/config/environment.ts'

const children: React.ReactNode = (() => {
  return (
    <StrictMode>
      <BrowserRouter basename={config.basePath}>
        <App />
      </BrowserRouter>
    </StrictMode>
  )
})()

createRoot(document.getElementById('root')!).render(children)

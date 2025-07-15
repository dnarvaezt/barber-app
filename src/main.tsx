import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app.tsx'
import './assets/styles/main.scss'
import './components/icons/icon.init'
import { config } from './config/environment'

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

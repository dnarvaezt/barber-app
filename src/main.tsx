import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app.tsx'
import './assets/styles/main.scss'

const children: React.ReactNode = (() => {
  return (
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  )
})()

createRoot(document.getElementById('root')!).render(children)

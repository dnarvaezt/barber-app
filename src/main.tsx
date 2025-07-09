import './application/assets/styles/main.scss'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './application/modules/app/app.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

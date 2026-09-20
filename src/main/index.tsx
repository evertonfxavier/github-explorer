import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { Router } from '@/main/routes/router'

const container = document.getElementById('root') as HTMLElement

createRoot(container).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)

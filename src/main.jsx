import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'   
import './index.css'
import App from './presentation/App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>        {/* ← envuelve App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
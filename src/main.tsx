import { scan } from 'react-scan'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './lib/i18n'
import './index.css'

if (import.meta.env.DEV && typeof navigator !== 'undefined' && !navigator.webdriver) {
  scan({
    enabled: true,
    log: true,
  })
}

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

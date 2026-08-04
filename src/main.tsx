import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './lib/i18n'
import './index.css'

if (import.meta.env.DEV) {
  import('react-scan').then(({ scan }) => {
    scan({
      enabled: true,
      log: true,
    })
  })
}

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

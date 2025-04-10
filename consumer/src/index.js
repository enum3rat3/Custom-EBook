import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ToastContainer } from 'react-toastify'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import KeyClock from './config/KeyClock'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  
    <ReactKeycloakProvider authClient={KeyClock}>
      <App />
      <ToastContainer autoClose={3000} />
    </ReactKeycloakProvider>

)



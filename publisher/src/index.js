import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ToastContainer } from 'react-toastify'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import KeyClock from './Config/KeyClock'
import { Provider } from 'react-redux'
import Store from './Store/Store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={Store}>
    <ReactKeycloakProvider authClient={KeyClock}>
      <App />
      <ToastContainer autoClose={3000} />
    </ReactKeycloakProvider>
  </Provider>
)

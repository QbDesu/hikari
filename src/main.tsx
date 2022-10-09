import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { MQTTProvider } from './mqtt-wrapper/Context'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MQTTProvider url="wss://test.mosquitto.org:8081">
      <App />
    </MQTTProvider>
  </React.StrictMode>
)

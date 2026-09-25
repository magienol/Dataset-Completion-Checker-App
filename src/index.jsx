import { AppRuntimeProvider } from '@dhis2/app-runtime'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const config = {
    baseUrl: '..',
    // Fallback only for standalone mounts. The DHIS2 app shell uses the
    // server's own API version so 2.40–2.43.1.0 SNAPSHOT instances work.
    apiVersion: 40,
}

createRoot(document.getElementById('root')).render(
    <AppRuntimeProvider config={config}>
        <App />
    </AppRuntimeProvider>
)

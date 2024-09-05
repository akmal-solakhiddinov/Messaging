import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AuthProvider from './context/authContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import SystemProvider from './context/systemContext.tsx'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* <SystemProvider> */}
        <App />
        {/* </SystemProvider> */}
      </AuthProvider>
    </QueryClientProvider >
  </StrictMode>,
)

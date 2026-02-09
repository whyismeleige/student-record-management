import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' 
import { AuthProvider } from '@/context/AuthContext'
import App from './App.jsx'
import './index.css' 

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("FATAL ERROR: Cannot find div with id='root' in index.html");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>,
  )
}
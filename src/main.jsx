import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { HomeDataProvider } from './context/HomeDataContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <HomeDataProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </HomeDataProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)

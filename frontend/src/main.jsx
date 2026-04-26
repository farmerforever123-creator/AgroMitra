import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Preloader from './components/Preloader.jsx'
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Preloader>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </Preloader>
  </StrictMode>,
)
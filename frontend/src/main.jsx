import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import './i18n.js'
import App from './App.jsx'
import Preloader from './components/Preloader.jsx'
<<<<<<< HEAD
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Preloader>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </Preloader>
=======
import { LanguageProvider } from './context/LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <LanguageProvider>
        <Preloader>
          <App />
        </Preloader>
      </LanguageProvider>
    </Router>
>>>>>>> f04a6ef (last updated code)
  </StrictMode>,
)
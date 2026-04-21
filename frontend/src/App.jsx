import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Register from './pages/Register'
import BuyerLogin from './pages/BuyerLogin'
import SellerLogin from './pages/SellerLogin'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/buyer-login" element={<BuyerLogin />} />
            <Route path="/seller-login" element={<SellerLogin />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
        
      </div>
    </Router>
  )
}

export default App
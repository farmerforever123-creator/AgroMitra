import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import Contact from './pages/Contact.jsx'
import Register from './pages/Register.jsx'
import BuyerLogin from './pages/BuyerLogin.jsx'
import SellerLogin from './pages/SellerLogin.jsx'
import Chatbot from "./components/Chatbot";
import Cart from './pages/Cart.jsx'
import "./components/landing.css";
import SellerDashboard from "./pages/SellerDashboard";

function App() {
  return (
    <>
      <Router>
        <div className="app-shell">

          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/buyer-login" element={<BuyerLogin />} />
              <Route path="/seller-login" element={<SellerLogin />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
            </Routes>
          </main>

          <Footer />

        </div>
      </Router>
      
      <Chatbot />
    </>
  );
}

export default App
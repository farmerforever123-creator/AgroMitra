import React from 'react'
import { Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <>
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
          </Routes>
        </main>

        <Footer />

      </div>

      <Chatbot />
    </>
  );
}

export default App;
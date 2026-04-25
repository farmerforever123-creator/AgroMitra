import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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
import Checkout from './pages/Checkout.jsx'
import CategoryProducts from './pages/CategoryProducts.jsx'
import Payment from './pages/Payment.jsx'
import Addresses from './pages/Addresses.jsx'
import MyOrders from './pages/MyOrders.jsx'
import Profile from './pages/Profile.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'
import SellerDashboard from "./pages/SellerDashboard";
import "./components/landing.css";

// Routes that have their own full-screen layout (no public navbar/footer)
const STANDALONE_ROUTES = ['/seller-dashboard'];

function AppShell() {
  const location = useLocation();
  const isStandalone = STANDALONE_ROUTES.includes(location.pathname);

  return (
    <>
      {!isStandalone && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/category/:categorySlug" element={<CategoryProducts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
        </Routes>
      </main>

      {!isStandalone && <Footer />}

      <Chatbot />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App
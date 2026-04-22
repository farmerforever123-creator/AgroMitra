import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, ShoppingCart, Search, Menu, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchCartCount()

    function handleCartUpdated() {
      fetchCartCount()
    }

    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLoginOpen(false)
      }
    }

    window.addEventListener('cartUpdated', handleCartUpdated)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function fetchCartCount() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setCartCount(0)
      return
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('buyer_id', user.id)

    if (error) {
      setCartCount(0)
      return
    }

    const total = (data || []).reduce((sum, item) => sum + item.quantity, 0)
    setCartCount(total)
  }

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
      isActive
        ? 'text-green-700 bg-green-50 shadow-sm'
        : 'text-slate-600 hover:text-green-700 hover:bg-white/80'
    }`

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4 pt-3">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-white/85 border border-white/70 shadow rounded-3xl px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shadow-sm">
                <span className="text-2xl">🌾</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-700 leading-none">
                  AgroMitra
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Buyer &amp; Seller Marketplace
                </p>
              </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="w-full relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search products, seeds, fertilizers..."
                  className="w-full h-14 rounded-full border border-slate-200 bg-white/90 pl-12 pr-4 outline-none focus:border-green-500 transition"
                />
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-2 relative">
              <NavLink to="/products" className={navLinkClass}>
                Products
              </NavLink>

              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLoginOpen((prev) => !prev)}
                  className="px-4 py-2 rounded-full font-semibold text-slate-600 hover:text-green-700 hover:bg-white/80 transition inline-flex items-center gap-2"
                >
                  Login
                  <ChevronDown size={16} />
                </button>

                {loginOpen && (
                  <div className="absolute top-14 right-0 w-56 rounded-2xl border border-slate-100 bg-white shadow-lg p-2">
                    <Link
                      to="/buyer-login"
                      onClick={() => setLoginOpen(false)}
                      className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-green-50 hover:text-green-700"
                    >
                      Buyer Login
                    </Link>

                    <Link
                      to="/seller-login"
                      onClick={() => setLoginOpen(false)}
                      className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-green-50 hover:text-green-700"
                    >
                      Seller Login
                    </Link>
                  </div>
                )}
              </div>

              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>

              <Link
                to="/cart"
                className="relative ml-2 w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center shadow hover:bg-green-700 transition"
              >
                <ShoppingCart size={22} />
                <span className="absolute -top-1 -right-1 min-w-[24px] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
            </nav>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {mobileOpen && (
            <div className="lg:hidden mt-4 border-t pt-4">
              <div className="mb-4 relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full h-12 rounded-full border border-slate-200 bg-white pl-12 pr-4 outline-none focus:border-green-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <NavLink
                  to="/products"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Products
                </NavLink>

                <NavLink
                  to="/contact"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </NavLink>

                <Link
                  to="/buyer-login"
                  className="px-4 py-2 rounded-full font-semibold text-slate-600 hover:text-green-700 hover:bg-white/80"
                  onClick={() => setMobileOpen(false)}
                >
                  Buyer Login
                </Link>

                <Link
                  to="/seller-login"
                  className="px-4 py-2 rounded-full font-semibold text-slate-600 hover:text-green-700 hover:bg-white/80"
                  onClick={() => setMobileOpen(false)}
                >
                  Seller Login
                </Link>

                <NavLink
                  to="/register"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </NavLink>

                <Link
                  to="/cart"
                  className="px-4 py-2 rounded-full font-semibold bg-green-600 text-white flex items-center justify-between"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>Cart</span>
                  <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-bold">
                    {cartCount}
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
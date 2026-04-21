import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Wheat,
  ChevronDown,
  ShoppingBag,
} from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [search, setSearch] = useState('')

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
      isActive
        ? 'text-green-700 bg-green-50 shadow-sm'
        : 'text-slate-600 hover:text-green-700 hover:bg-white/80'
    }`

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4 pt-3">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-white/85 border border-white/70 shadow-[0_12px_40px_rgba(0,0,0,0.08)] rounded-2xl px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 via-green-50 to-green-100 flex items-center justify-center shadow-inner">
                <Wheat className="text-green-700" size={26} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
                  AgroMitra
                </h1>
                <p className="text-[11px] text-slate-400 font-medium -mt-1">
                  Buyer & Seller Marketplace
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex flex-1 max-w-xl mx-4">
              <div className="w-full relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, seeds, fertilizers..."
                  className="w-full h-14 rounded-full border border-slate-200/80 bg-white/70 pl-12 pr-5 text-slate-700 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400 shadow-inner"
                />
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-2 relative">
              <NavLink to="/products" className={navLinkClass}>
                <span className="inline-flex items-center gap-2">
                  <ShoppingBag size={18} />
                  Products
                </span>
              </NavLink>

              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>

              <div className="relative">
                <button
                  onClick={() => setLoginOpen((prev) => !prev)}
                  className="px-4 py-2 rounded-full font-semibold text-slate-600 hover:text-green-700 hover:bg-white/80 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <User size={18} />
                  Login
                  <ChevronDown size={16} />
                </button>

                {loginOpen && (
                  <div className="absolute top-14 right-0 w-56 rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-2">
                    <Link
                      to="/buyer-login"
                      onClick={() => setLoginOpen(false)}
                      className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium"
                    >
                      Buyer
                    </Link>

                    <Link
                      to="/seller-login"
                      onClick={() => setLoginOpen(false)}
                      className="block px-4 py-3 rounded-xl text-slate-700 hover:bg-green-50 hover:text-green-700 font-medium"
                    >
                      Seller
                    </Link>
                  </div>
                )}
              </div>

              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>

              <button className="relative ml-2 w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-green-200 hover:scale-105 transition">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                  0
                </span>
              </button>
            </nav>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div className="lg:hidden mt-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full h-12 rounded-full border border-slate-200 bg-white pl-12 pr-4 outline-none focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>

          {mobileOpen && (
            <div className="lg:hidden mt-4 border-t border-slate-100 pt-4 grid grid-cols-1 gap-3">
              <Link
                to="/products"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl bg-slate-50 hover:bg-green-50 px-4 py-3 text-slate-700 font-semibold"
              >
                Products
              </Link>

              <Link
                to="/buyer-login"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl bg-slate-50 hover:bg-green-50 px-4 py-3 text-slate-700 font-semibold"
              >
                Buyer Login
              </Link>

              <Link
                to="/seller-login"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl bg-slate-50 hover:bg-green-50 px-4 py-3 text-slate-700 font-semibold"
              >
                Seller Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl bg-slate-50 hover:bg-green-50 px-4 py-3 text-slate-700 font-semibold"
              >
                Register
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl bg-slate-50 hover:bg-green-50 px-4 py-3 text-slate-700 font-semibold"
              >
                Contact
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
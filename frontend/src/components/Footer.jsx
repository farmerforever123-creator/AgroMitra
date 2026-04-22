import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-green-700">AgroMitra</h3>
          <p className="text-sm text-gray-500">
            Buyer &amp; Seller Marketplace
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-green-600">
            Home
          </Link>
          <Link to="/products" className="hover:text-green-600">
            Products
          </Link>
          <Link to="/contact" className="hover:text-green-600">
            Contact
          </Link>
          <Link to="/register" className="hover:text-green-600">
            Register
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          © 2026 AgroMitra. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
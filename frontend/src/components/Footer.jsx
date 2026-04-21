import React from 'react'
import { Link } from 'react-router-dom'
import { Wheat, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="px-4 pb-4 pt-10 bg-transparent">
      <div className="max-w-7xl mx-auto rounded-[32px] bg-slate-950 text-white overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
        <div className="grid lg:grid-cols-4 gap-8 p-8 sm:p-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Wheat size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">AgroMitra</h3>
                <p className="text-sm text-white/60">Modern farm marketplace</p>
              </div>
            </div>
            <p className="text-white/70 leading-7">
              A premium agriculture commerce platform for buyers and sellers.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <div className="space-y-3 text-white/70">
              <Link to="/" className="block hover:text-white">Home</Link>
              <Link to="/products" className="block hover:text-white">Products</Link>
              <Link to="/buyer" className="block hover:text-white">Buyer</Link>
              <Link to="/seller" className="block hover:text-white">Seller</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <div className="space-y-3 text-white/70">
              <Link to="/contact" className="block hover:text-white">Contact</Link>
              <Link to="/login" className="block hover:text-white">Login</Link>
              <Link to="/register" className="block hover:text-white">Register</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-white/70">
              <p className="flex items-center gap-2"><Phone size={16} /> +91 98765 43210</p>
              <p className="flex items-center gap-2"><Mail size={16} /> support@agromitra.com</p>
              <p className="flex items-center gap-2"><MapPin size={16} /> Agriland, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-8 py-4 text-center text-white/50 text-sm">
          © 2026 AgroMitra. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
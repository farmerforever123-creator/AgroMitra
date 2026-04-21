import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Store } from 'lucide-react'

export default function SellerLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('Seller login:', formData)
  }

  return (
    <section className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden border border-green-100">
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-slate-900 via-green-900 to-emerald-700 p-10 text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
            <Store size={30} />
          </div>
          <h2 className="text-4xl font-bold mb-4">Seller Login</h2>
          <p className="text-white/85 text-lg leading-8">
            Login as a seller to manage products, inventory, and your AgroMitra business.
          </p>
        </div>

        <div className="flex items-center justify-center px-6 sm:px-10 py-10 sm:py-14">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
                Seller Access
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                Welcome Seller
              </h1>
              <p className="text-slate-500 text-base">
                Sign in to manage your products and grow your store.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seller@example.com"
                    className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-14 outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="w-4 h-4 accent-green-600 rounded"
                  />
                  Remember me
                </label>

                <a href="#" className="font-semibold text-green-600 hover:text-green-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold text-lg shadow-lg shadow-green-200 transition-all"
              >
                Seller Sign in
              </button>
            </form>

            <p className="mt-6 text-center text-slate-500">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
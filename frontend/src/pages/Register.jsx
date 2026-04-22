import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          phone: formData.phone,
          role: formData.role,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const userId = data.user?.id

    if (userId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        })
        .eq('id', userId)

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }
    }

    setSuccess('Registration successful. You can now login.')
    setLoading(false)

    setTimeout(() => {
      if (formData.role === 'buyer') {
        navigate('/buyer-login')
      } else {
        navigate('/seller-login')
      }
    }, 1200)
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-stretch">
        <div className="hidden lg:flex rounded-3xl overflow-hidden relative min-h-[680px] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80"
            alt="Register"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/60 to-black/50" />
          <div className="relative z-10 p-10 flex flex-col justify-end text-white">
            <span className="inline-flex w-fit px-4 py-2 rounded-full bg-white/15 border border-white/20 text-sm font-medium mb-5">
              Join AgroMitra
            </span>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Start buying or selling with confidence
            </h1>
            <p className="text-lg text-green-50/90 leading-8 max-w-xl">
              Create your AgroMitra account to explore products as a buyer or
              manage and sell agricultural inventory as a seller.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl shadow-sm mb-5">
              ✨
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Create Account
            </h2>
            <p className="text-slate-500 mt-3">
              Register as a buyer or seller and continue with AgroMitra.
            </p>
          </div>

          {error ? (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mb-5 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-green-700 text-sm">
              {success}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                className="w-full h-14 rounded-2xl border border-slate-200 px-4 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full h-14 rounded-2xl border border-slate-200 px-4 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  className="w-full h-14 rounded-2xl border border-slate-200 px-4 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className="w-full h-14 rounded-2xl border border-slate-200 px-4 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Register As
                </label>
                <select
                  name="role"
                  className="w-full h-14 rounded-2xl border border-slate-200 px-4 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition bg-white"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="buyer">Buyer</option>
                  <option value="farmer">Seller</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition shadow-sm"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/buyer-login" className="text-green-700 font-semibold hover:underline">
              Buyer Login
            </Link>
            {' '}or{' '}
            <Link to="/seller-login" className="text-green-700 font-semibold hover:underline">
              Seller Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
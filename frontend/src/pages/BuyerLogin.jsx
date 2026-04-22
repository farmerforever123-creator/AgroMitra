import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function BuyerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const userId = data.user.id

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    if (profile.role !== 'buyer') {
      setError('This account is not a buyer account.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    setLoading(false)
    navigate('/products')
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-stretch">
        <div className="hidden lg:flex rounded-3xl overflow-hidden relative min-h-[620px] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1400&q=80"
            alt="Buyer login"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/55 to-black/55" />
          <div className="relative z-10 p-10 flex flex-col justify-end text-white">
            <span className="inline-flex w-fit px-4 py-2 rounded-full bg-white/15 border border-white/20 text-sm font-medium mb-5">
              Buyer Access
            </span>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Buy smarter with AgroMitra
            </h1>
            <p className="text-lg text-green-50/90 leading-8 max-w-xl">
              Browse trusted products, manage your cart, and purchase seeds,
              fertilizers, tools, and fresh farm items with a clean buying flow.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl shadow-sm mb-5">
              🛒
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Buyer Login
            </h2>
            <p className="text-slate-500 mt-3">
              Login to explore products and manage your cart.
            </p>
          </div>

          {error ? (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="buyer@example.com"
                className="w-full h-14 rounded-2xl border border-slate-200 px-4 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full h-14 rounded-2xl border border-slate-200 px-4 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition shadow-sm"
            >
              {loading ? 'Logging in...' : 'Login as Buyer'}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            Need a new account?{' '}
            <Link to="/register" className="text-green-700 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
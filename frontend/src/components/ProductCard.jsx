import React from 'react'
import { ShoppingCart } from 'lucide-react'

export default function ProductCard({
  image,
  name,
  price,
  category,
  unit,
  stock,
}) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_14px_50px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_70px_rgba(16,185,129,0.18)] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-green-50/40 pointer-events-none" />

      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {category && (
          <div className="absolute left-4 top-4 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md text-green-700 text-xs font-bold shadow-sm">
            {category}
          </div>
        )}

        <div className="absolute right-4 top-4 px-3 py-1.5 rounded-full bg-slate-900/75 backdrop-blur-md text-white text-xs font-semibold">
          {stock > 0 ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>

      <div className="relative p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-2 min-h-[56px] line-clamp-2">
          {name}
        </h3>

        <div className="flex items-center justify-between mb-5">
          <p className="text-2xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
            ₹{price}
            {unit ? <span className="text-sm text-slate-400 font-semibold"> / {unit}</span> : null}
          </p>

          <span className="text-sm font-medium text-slate-500">
            Stock: {stock}
          </span>
        </div>

        <button className="w-full h-12 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all duration-300">
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
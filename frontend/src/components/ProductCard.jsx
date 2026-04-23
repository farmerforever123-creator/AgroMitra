import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false)

  const productImage =
    product?.product_images?.[0]?.image_url ||
    product?.image_url ||
    product?.image ||
    'https://picsum.photos/300/300'

  async function handleAddToCart() {
    setAdding(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert('Please login as buyer first.')
        setAdding(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'buyer') {
        alert('Only buyer can add products to cart.')
        setAdding(false)
        return
      }

      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('buyer_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle()

      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)
      } else {
        await supabase.from('cart_items').insert({
          buyer_id: user.id,
          product_id: product.id,
          quantity: 1,
        })
      }

      window.dispatchEvent(new Event('cartUpdated'))
      alert('Product added to cart')
    } catch {
      alert('Something went wrong while adding to cart.')
    }

    setAdding(false)
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition">
      <img
        src={productImage}
        alt={product?.name || 'Product'}
        className="w-full h-60 object-cover"
      />

      <div className="p-5">
        <h2 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-2">
          {product?.name}
        </h2>

        {product?.description ? (
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        ) : null}

        <p className="text-green-600 font-bold text-2xl">
          ₹{product?.price ?? 0}
        </p>

        <p className="text-sm text-slate-500 mt-2">
          Stock: {product?.stock_quantity ?? product?.stock ?? 0}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-5 w-full bg-green-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-green-700 transition disabled:opacity-70"
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false)

  const productImage =
    product?.product_images?.[0]?.image_url ||
    product?.image_url ||
    'https://picsum.photos/300/300'

  async function handleAddToCart() {
    setAdding(true)

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
      await supabase
        .from('cart_items')
        .insert({
          buyer_id: user.id,
          product_id: product.id,
          quantity: 1,
        })
    }

    window.dispatchEvent(new Event('cartUpdated'))
    alert('Product added to cart')
    setAdding(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={productImage}
        alt={product?.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{product?.name}</h2>

        <p className="text-green-600 font-bold text-lg">
          ₹{product?.price}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Stock: {product?.stock_quantity ?? 0}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
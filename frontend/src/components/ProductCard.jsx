<<<<<<< HEAD
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './landing.css'
=======
import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false)

<<<<<<< HEAD
  const image =
    product?.product_images?.find((img) => img.is_primary)?.image_url ||
    product?.product_images?.[0]?.image_url ||
    product?.image_url ||
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&q=80'
=======
  const productImage =
    product?.product_images?.[0]?.image_url ||
    product?.image_url ||
    product?.image ||
    'https://picsum.photos/300/300'
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82

  async function handleAddToCart() {
    setAdding(true)

    try {
<<<<<<< HEAD
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        alert('Please login as buyer first.')
=======
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
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
        return
      }

      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
<<<<<<< HEAD
        .eq('user_id', user.id)
=======
        .eq('buyer_id', user.id)
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
        .eq('product_id', product.id)
        .maybeSingle()

      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)
      } else {
        await supabase.from('cart_items').insert({
<<<<<<< HEAD
          user_id: user.id,
=======
          buyer_id: user.id,
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
          product_id: product.id,
          quantity: 1,
        })
      }

<<<<<<< HEAD
      alert('Added to cart')
    } catch (error) {
      alert(error.message || 'Add to cart failed')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="shop-card">
      <div className="shop-img-box">
        <img src={image} alt={product?.name || 'Product'} />

        <button onClick={handleAddToCart} disabled={adding}>
          {adding ? '...' : 'ADD'}
        </button>
      </div>

      <div className="shop-info">
        <div className="shop-price">
          <span>₹{product?.price || 0}</span>
          <del>₹{Number(product?.price || 0) + 100}</del>
        </div>

        <p className="shop-off">₹50 OFF</p>

        <h3>{product?.name}</h3>

        <p className="shop-pack">
          1 pack ({product?.stock_quantity || 0} {product?.unit || 'pack'})
        </p>

        <span className="shop-tag">
          {product?.categories?.name || 'Agriculture'}
        </span>

        <p className="shop-rating">⭐ 4.8</p>
=======
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
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
      </div>
    </div>
  )
}
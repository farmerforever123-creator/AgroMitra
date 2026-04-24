import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './landing.css'

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false)

  const image =
    product?.product_images?.find((img) => img.is_primary)?.image_url ||
    product?.product_images?.[0]?.image_url ||
    product?.image_url ||
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&q=80'

  async function handleAddToCart() {
    setAdding(true)

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        alert('Please login as buyer first.')
        return
      }

      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle()

      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)
      } else {
        await supabase.from('cart_items').insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        })
      }

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
      </div>
    </div>
  )
}
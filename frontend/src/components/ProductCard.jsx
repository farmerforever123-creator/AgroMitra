import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../context/LanguageContext'
import './landing.css'

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()

  const image =
    product?.image ||
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&q=80'

  async function handleAddToCart(e) {
    e.stopPropagation() // Prevent navigating when clicking Add to Cart
    setAdding(true)

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        alert('Please login as buyer first.')
        return
      }

      const { data: existingItem } = await supabase
        .from('cart')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle()

      if (existingItem) {
        await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)
      } else {
        await supabase.from('cart').insert({
          user_id: user.id,
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          quantity: 1,
          image: image,
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
    <div className="shop-card" onClick={() => {
      console.log("NAVIGATING TO:", `/product/${product.id}`);
      navigate(`/product/${product.id}`);
    }} style={{ cursor: 'pointer' }}>
      <div className="shop-img-box">
        <img src={image} alt={product?.name || 'Product'} />

        <button onClick={handleAddToCart} disabled={adding}>
          {adding ? '...' : t('productsPage.addToCart') || 'ADD'}
        </button>
      </div>

      <div className="shop-info">
        <div className="shop-price">
          <span>₹{product?.price || 0} / {product?.unit || 'piece'}</span>
          <del>₹{Number(product?.price || 0) + 100}</del>
        </div>

        <p className="shop-off">₹50 OFF</p>

        <h3>{product?.name}</h3>

        <p className="shop-pack">
          1 pack ({product?.stock || 0} in stock)
        </p>

        <span className="shop-tag">
          {product?.category || 'Agriculture'}
        </span>

        <p className="shop-rating">⭐ 4.8</p>
      </div>
    </div>
  )
}
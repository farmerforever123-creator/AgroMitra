import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../components/landing.css'

export default function Cart() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCart()
  }, [])

  async function fetchCart() {
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      setMessage('Please login to view your cart.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        products (
          id,
          name,
          price,
          unit,
          description,
          product_images (
            image_url,
            is_primary
          )
        )
      `)
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setMessage(error.message)
    } else {
      setItems(data || [])
    }

    setLoading(false)
  }

  async function updateQuantity(cartId, currentQty, type) {
    const newQty = type === 'inc' ? currentQty + 1 : currentQty - 1

    if (newQty < 1) return

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', cartId)

    if (error) {
      alert(error.message)
      return
    }

    fetchCart()
  }

  async function removeItem(cartId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartId)

    if (error) {
      alert(error.message)
      return
    }

    fetchCart()
  }

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + Number(item.products?.price || 0) * item.quantity
    }, 0)
  }, [items])

  if (loading) {
    return <div className="cart-loading">Loading cart...</div>
  }

  return (
    <section className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <span>Shopping Cart</span>
          <h1>Your Cart Items</h1>
          <p>Review your selected products before placing order.</p>
        </div>

        {message && <div className="cart-message">{message}</div>}

        {items.length === 0 ? (
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <p>Add products from marketplace to see them here.</p>
            <Link to="/products">Explore Products</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-list">
              {items.map((item) => {
                const product = item.products
                const image =
                  product?.product_images?.find((img) => img.is_primary)
                    ?.image_url ||
                  product?.product_images?.[0]?.image_url ||
                  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80'

                const subtotal = Number(product?.price || 0) * item.quantity

                return (
                  <div className="cart-item-card" key={item.id}>
                    <img src={image} alt={product?.name} />

                    <div className="cart-item-info">
                      <h3>{product?.name}</h3>
                      <p>{product?.description || 'Fresh agricultural product'}</p>

                      <div className="cart-price-row">
                        <strong>₹{product?.price}</strong>
                        <span>/ {product?.unit || 'unit'}</span>
                      </div>

                      <div className="cart-quantity-row">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity, 'dec')
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity, 'inc')
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">
                      <p>Subtotal</p>
                      <h3>₹{subtotal}</h3>

                      <button onClick={() => removeItem(item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Total Items</span>
                <strong>{items.length}</strong>
              </div>

              <div className="summary-row">
                <span>Total Quantity</span>
                <strong>
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </strong>
              </div>

              <div className="summary-row total">
                <span>Total Amount</span>
                <strong>₹{totalAmount}</strong>
              </div>

              <button className="checkout-btn">
                Proceed to Checkout
              </button>

              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
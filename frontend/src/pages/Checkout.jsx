import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../components/landing.css'

export default function Checkout() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [address, setAddress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    init()
  }, [])

  async function init() {
    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()
    const currentUser = userData?.user

    if (!currentUser) {
      navigate('/buyer-login')
      return
    }
    setUser(currentUser)

    // Load cart
    const { data: cartData, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        products (
          id,
          name,
          price,
          unit,
          stock_quantity,
          product_images ( image_url, is_primary )
        )
      `)
      .eq('buyer_id', currentUser.id)
      .order('created_at', { ascending: false })

    if (cartError) {
      setError(cartError.message)
      setLoading(false)
      return
    }

    if (!cartData || cartData.length === 0) {
      navigate('/cart')
      return
    }

    setItems(cartData)

    // Load default address, fallback to most recent
    const { data: addrData } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('is_default', true)
      .maybeSingle()

    if (addrData) {
      setAddress(addrData)
    } else {
      const { data: anyAddr } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (anyAddr) setAddress(anyAddr)
    }

    setLoading(false)
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.products?.price || 0) * item.quantity,
    0
  )
  const deliveryFee = subtotal > 0 ? 49 : 0
  const grandTotal = subtotal + deliveryFee

  // Stock warnings
  const stockWarnings = items.filter(
    (item) =>
      item.products?.stock_quantity != null &&
      item.quantity > item.products.stock_quantity
  )

  function handleContinue() {
    if (!address) {
      setError('Please add or select a delivery address before continuing.')
      return
    }
    if (stockWarnings.length > 0) {
      setError('Some items exceed available stock. Please update your cart.')
      return
    }
    setError('')

    // Pass order data via sessionStorage — payment method chosen on /payment
    const orderData = {
      items: items.map((i) => ({
        cartId: i.id,
        productId: i.products?.id,
        productName: i.products?.name,
        price: Number(i.products?.price || 0),
        quantity: i.quantity,
      })),
      addressId: address.id,
      addressLabel: `${address.full_name}, ${address.address_line1}, ${address.city} – ${address.pincode}`,
      subtotal,
      deliveryFee,
      grandTotal,
      buyerId: user.id,
    }
    sessionStorage.setItem('agromitra_order', JSON.stringify(orderData))
    navigate('/payment')
  }

  if (loading) {
    return <div className="checkout-loading">Loading checkout...</div>
  }

  return (
    <section className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <span>Checkout</span>
          <h1>Complete Your Order</h1>
          <p>Review your items and select a delivery address.</p>
        </div>

        {error && <div className="checkout-error">{error}</div>}

        <div className="checkout-layout">
          {/* Left column */}
          <div className="checkout-left">
            {/* Order Summary */}
            <div className="checkout-card">
              <h2 className="checkout-card-title">🛒 Order Summary</h2>
              <div className="checkout-items">
                {items.map((item) => {
                  const product = item.products
                  const image =
                    product?.product_images?.find((i) => i.is_primary)?.image_url ||
                    product?.product_images?.[0]?.image_url ||
                    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80'
                  const isOverStock =
                    product?.stock_quantity != null &&
                    item.quantity > product.stock_quantity

                  return (
                    <div
                      className={`checkout-item${isOverStock ? ' checkout-item--warn' : ''}`}
                      key={item.id}
                    >
                      <img src={image} alt={product?.name} className="checkout-item-img" />
                      <div className="checkout-item-info">
                        <strong>{product?.name}</strong>
                        <span>
                          ₹{product?.price} / {product?.unit || 'unit'} × {item.quantity}
                        </span>
                        {isOverStock && (
                          <span className="checkout-stock-warn">
                            ⚠ Only {product.stock_quantity} available
                          </span>
                        )}
                      </div>
                      <div className="checkout-item-subtotal">
                        ₹{(Number(product?.price || 0) * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="checkout-totals">
                <div className="checkout-total-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="checkout-total-row checkout-grand">
                  <span>Grand Total</span>
                  <strong>₹{grandTotal}</strong>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <h2 className="checkout-card-title">📍 Delivery Address</h2>
                <Link to="/addresses" className="checkout-change-btn">
                  {address ? 'Change' : 'Add Address'}
                </Link>
              </div>

              {address ? (
                <div className="checkout-address-box">
                  <strong>{address.full_name}</strong>
                  <span>{address.phone}</span>
                  <p>
                    {address.address_line1}
                    {address.address_line2 ? `, ${address.address_line2}` : ''}
                    <br />
                    {address.city}, {address.state} – {address.pincode}
                    <br />
                    {address.country}
                  </p>
                  {address.is_default && (
                    <span className="checkout-default-badge">Default</span>
                  )}
                </div>
              ) : (
                <div className="checkout-no-address">
                  <p>No delivery address found.</p>
                  <Link to="/addresses" className="checkout-add-addr-btn">
                    + Add Address
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: sticky price summary */}
          <div className="checkout-right">
            <div className="checkout-sticky-summary">
              <h2>Price Details</h2>
              <div className="summary-rows">
                <div className="checkout-total-row">
                  <span>Items ({items.length})</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Delivery</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="checkout-total-row checkout-grand">
                  <span>Total Payable</span>
                  <strong>₹{grandTotal}</strong>
                </div>
              </div>

              <button
                className="checkout-place-btn"
                onClick={handleContinue}
                disabled={!address || stockWarnings.length > 0}
              >
                Continue to Payment →
              </button>

              {!address && (
                <p className="checkout-addr-warning">
                  ⚠ Please add a delivery address to continue.
                </p>
              )}

              <Link to="/cart" className="checkout-back-link">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

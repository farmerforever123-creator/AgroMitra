import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()

    function handleCartUpdated() {
      fetchCart()
    }

    window.addEventListener('cartUpdated', handleCartUpdated)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated)
    }
  }, [])

  async function fetchCart() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setCart([])
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
          image_url
        )
      `)
      .eq('buyer_id', user.id)

    if (error) {
      setCart([])
      setLoading(false)
      return
    }

    setCart(data || [])
    setLoading(false)
  }

  async function updateQuantity(cartItemId, currentQty, type) {
    const newQty = type === 'increase' ? currentQty + 1 : currentQty - 1

    if (newQty < 1) return

    await supabase
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', cartItemId)

    window.dispatchEvent(new Event('cartUpdated'))
  }

  async function removeItem(cartItemId) {
    await supabase.from('cart_items').delete().eq('id', cartItemId)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.products?.price || 0
      return sum + price * item.quantity
    }, 0)
  }, [cart])

  if (loading) {
    return <div className="p-8 text-lg">Loading cart...</div>
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Your Cart
          </h1>
          <p className="text-slate-500 mt-2">
            Review your selected products before checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center text-3xl mb-5">
              🛒
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-slate-500">
              Add some products from the products page.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.35fr,0.65fr] gap-8">
            <div className="space-y-5">
              {cart.map((item) => {
                const product = item.products || {}

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-5"
                  >
                    <img
                      src={
                        product.image_url || 'https://via.placeholder.com/300'
                      }
                      alt={product.name || 'Product'}
                      className="w-full sm:w-32 h-32 object-cover rounded-2xl"
                    />

                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-slate-900">
                        {product.name}
                      </h2>

                      <p className="text-green-600 font-bold text-xl mt-2">
                        ₹{product.price}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div className="flex items-center bg-slate-100 rounded-2xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity, 'decrease')
                            }
                            className="px-4 py-2 hover:bg-slate-200 text-lg"
                          >
                            -
                          </button>

                          <span className="px-4 font-semibold text-slate-800">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity, 'increase')
                            }
                            className="px-4 py-2 hover:bg-slate-200 text-lg"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="px-4 py-2 rounded-2xl bg-red-500 text-white hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm text-slate-500">Subtotal</p>
                      <p className="text-xl font-bold text-slate-900 mt-1">
                        ₹{(product.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm h-fit sticky top-24">
              <h2 className="text-2xl font-semibold text-slate-900 mb-5">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Items</span>
                  <span>{cart.length}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Total Quantity</span>
                  <span>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
              </div>

              <div className="border-t mt-6 pt-6 flex justify-between text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                type="button"
                className="w-full mt-6 bg-green-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name),
        product_images(image_url, is_primary, sort_order)
      `)
      .eq('is_active', true)
      .eq('is_approved', true)

    if (error) {
      console.error(error)
      setError(error.message)
      setLoading(false)
      return
    }

    setProducts(data || [])
    setLoading(false)
  }

  const categories = useMemo(() => {
    const names = products
      .map((p) => p.categories?.name)
      .filter(Boolean)

    return ['All', ...new Set(names)]
  }, [products])

  const filteredProducts = useMemo(() => {
    let data = [...products]

    if (category !== 'All') {
      data = data.filter((item) => item.categories?.name === category)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.categories?.name?.toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case 'priceLowToHigh':
        data.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case 'priceHighToLow':
        data.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case 'nameAZ':
        data.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    return data
  }, [products, category, search, sortBy])

  if (loading) {
    return <div className="p-8 text-lg">Loading products...</div>
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Products</h1>

        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-green-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-green-500"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-green-500"
            >
              <option value="default">Sort By</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="nameAZ">Name: A to Z</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Showing <span className="font-semibold text-green-700">{filteredProducts.length}</span> products
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
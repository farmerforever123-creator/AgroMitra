<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import '../components/landing.css'
=======
import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
<<<<<<< HEAD
  const [search, setSearch] = useState('')
=======
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
<<<<<<< HEAD

    const { data, error } = await supabase
=======
    setError('')

    const { data, error: fetchError } = await supabase
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
      .from('products')
      .select(`
        *,
        categories(name),
<<<<<<< HEAD
        product_images(image_url, is_primary)
=======
        product_images(image_url, is_primary, sort_order)
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
      `)
      .eq('is_active', true)
      .eq('is_approved', true)

<<<<<<< HEAD
    if (!error) setProducts(data || [])

    setLoading(false)
  }

  const filteredProducts = useMemo(() => {
    let data = [...products]

    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.categories?.name?.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'low') {
      data.sort((a, b) => Number(a.price) - Number(b.price))
    }

    if (sortBy === 'high') {
      data.sort((a, b) => Number(b.price) - Number(a.price))
    }

    return data
  }, [products, search, sortBy])

  const groupedProducts = useMemo(() => {
    const groups = {}

    filteredProducts.forEach((product) => {
      const category = product.categories?.name || 'Agriculture'

      if (!groups[category]) {
        groups[category] = []
      }

      groups[category].push(product)
    })

    return groups
  }, [filteredProducts])

  if (loading) {
    return <div className="products-loading">Loading products...</div>
  }

  return (
    <section className="products-page-pro">
      <div className="products-container-pro">
        <div className="products-hero-mini">
          <div>
            <span>AgroMitra Marketplace</span>
            <h1>Fresh Products for Smart Farming</h1>
            <p>Explore seeds, fertilizers, tools, vegetables and more.</p>
          </div>

          <div className="products-controls-pro">
            <input
              type="text"
              placeholder="Search products or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Sort</option>
              <option value="low">Price Low to High</option>
              <option value="high">Price High to Low</option>
            </select>
          </div>
        </div>

        {Object.keys(groupedProducts).length === 0 ? (
          <div className="products-empty-pro">
            <h2>No products found</h2>
            <p>Try another search keyword.</p>
          </div>
        ) : (
          Object.entries(groupedProducts).map(([category, items]) => (
            <div className="category-product-section" key={category}>
              <div className="category-section-head">
                <h2>{category}</h2>
                <span>See All ›</span>
              </div>

              <div className="shop-products-row">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
=======
    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    setProducts(data || [])
    setLoading(false)
  }

  const categories = useMemo(() => {
    const names = products.map((p) => p.categories?.name).filter(Boolean)
    return ['All', ...new Set(names)]
  }, [products])

  const filteredProducts = useMemo(() => {
    let data = [...products]

    if (category !== 'All') {
      data = data.filter((item) => item.categories?.name === category)
    }

    if (search.trim()) {
      const query = search.toLowerCase()
      data = data.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.categories?.name?.toLowerCase().includes(query),
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
        <div className="mb-8">
          <span className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
            Marketplace
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
            Explore Products
          </h1>
          <p className="mt-2 text-slate-500">
            Browse approved agricultural products from AgroMitra.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-5 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-green-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-green-500 bg-white"
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
              className="w-full h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-green-500 bg-white"
            >
              <option value="default">Sort By</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="nameAZ">Name: A to Z</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-green-700">
              {filteredProducts.length}
            </span>{' '}
            products
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center">
            <p className="text-slate-600">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
        )}
      </div>
    </section>
  )
}
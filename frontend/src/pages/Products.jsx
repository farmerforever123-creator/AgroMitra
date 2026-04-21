import React, { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { PRODUCTS, CATEGORIES } from '../data/productsData'

export default function Products() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  const filteredProducts = useMemo(() => {
    let data = [...PRODUCTS]

    if (category !== 'All') {
      data = data.filter((item) => item.category === category)
    }

    if (search.trim()) {
      const query = search.toLowerCase()
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      )
    }

    switch (sortBy) {
      case 'priceLowToHigh':
        data.sort((a, b) => a.price - b.price)
        break
      case 'priceHighToLow':
        data.sort((a, b) => b.price - a.price)
        break
      case 'nameAZ':
        data.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    return data
  }, [search, category, sortBy])

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 px-4 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[32px] bg-gradient-to-r from-slate-900 via-green-900 to-emerald-700 p-8 sm:p-10 text-white shadow-[0_20px_80px_rgba(0,0,0,0.12)] mb-8">
          <p className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-sm font-semibold mb-4">
            AgroMitra Products
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Explore 200+ premium farm products
          </h1>
          <p className="text-white/85 text-lg max-w-3xl">
            Seeds, fertilizers, tools, pesticides, irrigation, fruits and vegetables — all in one place.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[28px] p-5 sm:p-6 shadow-[0_16px_60px_rgba(0,0,0,0.07)] mb-8">
          <div className="grid lg:grid-cols-3 gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product or category..."
              className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400"
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400"
            >
              <option value="default">Sort By</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="nameAZ">Name: A to Z</option>
            </select>
          </div>

          <div className="mt-5 text-sm text-slate-500">
            Showing <span className="font-semibold text-green-700">{filteredProducts.length}</span> products
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              category={product.category}
              unit={product.unit}
              stock={product.stock}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
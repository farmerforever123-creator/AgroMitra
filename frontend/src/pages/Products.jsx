import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import '../components/landing.css'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name),
        product_images(image_url, is_primary)
      `)
      .eq('is_active', true)
      .eq('is_approved', true)

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
        )}
      </div>
    </section>
  )
}
import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '@/types/ecommerce';
import { EcommerceHeader } from '@/components/ecommerce/EcommerceHeader';
import { ProductFilters } from '@/components/ecommerce/ProductFilters';
import { ProductGrid } from '@/components/ecommerce/ProductGrid';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { ProductDetailModal } from '@/components/ecommerce/ProductDetailModal';
import { mockProducts, filterProducts } from '@/lib/products';
import api from '@/lib/api';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [products, setProducts] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [itemsPerPage] = useState<number>(12)
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)

  const buildParams = (p: number) => {
    const params: Record<string, unknown> = { page: p, itemsPerPage }
    if (searchTerm) params.q = searchTerm
    if (filters.category && filters.category !== 'All Categories') params.category = filters.category
    if (filters.inStock !== undefined) params.inStock = filters.inStock
    if (filters.onSale !== undefined) params.onSale = filters.onSale
    if (filters.priceRange) {
      params.minPrice = filters.priceRange[0]
      params.maxPrice = filters.priceRange[1]
    }
    if (filters.minRating) params.minRating = filters.minRating
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder
    return params
  }

  const fetchProducts = async (opts: { append?: boolean } = {}) => {
    setLoading(true)
    const targetPage = opts.append ? page + 1 : 1
    try {
      const res = await api.get('/products', { params: buildParams(targetPage) })
      const data = res.data || {}
      const items = data.items || []
      const t = data.total ?? items.length
      if (opts.append) {
        setProducts(prev => [...prev, ...items])
        setPage(targetPage)
      } else {
        setProducts(items)
        setPage(1)
      }
      setTotal(t)
      setHasMore((prevListLength => ( (opts.append ? products.length + items.length : items.length) < t)) )
    } catch (err) {
      // fallback: use mock products on error
      console.warn('Could not fetch products from server, using mock data', err)
      setProducts(mockProducts)
      setTotal(mockProducts.length)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  // fetch on mount and when filters/search change
  useEffect(() => {
    let mounted = true
    if (mounted) fetchProducts({ append: false })
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filters])

  // For ProductGrid we already pass loading/hasMore and onLoadMore
  const filteredProducts = products

  const handleLoadMore = () => {
    fetchProducts({ append: true })
  }

  const handlePageChange = (p: number) => {
    // fetch specific page
    const fetchPage = async () => {
      setLoading(true)
      try {
        const res = await api.get('/products', { params: buildParams(p) })
        const data = res.data || {}
        const items = data.items || []
        setProducts(items)
        setPage(p)
        setTotal(data.total ?? items.length)
        setHasMore(items.length < (data.total ?? items.length))
      } catch (err) {
        console.warn('Could not fetch page', p, err)
      } finally {
        setLoading(false)
      }
    }
    fetchPage()
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <EcommerceHeader />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EcomCart Shopping Library
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern shopping cart component library with advanced filtering, search, and beautiful UI components
            </p>
          </div>

          {/* Filters */}
          <ProductFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Products {filteredProducts.length > 0 && `(${filteredProducts.length})`}
            </h2>
            {searchTerm && (
              <p className="text-muted-foreground">
                Showing results for "{searchTerm}"
              </p>
            )}
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onProductSelect={handleProductSelect}
            page={page}
            total={total}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
import React, { useState, useMemo } from 'react';
import { Product } from '@/types/ecommerce';
import { EcommerceHeader } from '@/components/ecommerce/EcommerceHeader';
import { ProductFilters } from '@/components/ecommerce/ProductFilters';
import { ProductGrid } from '@/components/ecommerce/ProductGrid';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { ProductDetailModal } from '@/components/ecommerce/ProductDetailModal';
import { mockProducts, filterProducts } from '@/lib/products';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return filterProducts(mockProducts, searchTerm, filters);
  }, [searchTerm, filters]);

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
            onProductSelect={handleProductSelect}
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
import React, { useState, useEffect } from 'react';
import { Package, RefreshCw } from 'lucide-react';
import { Product } from '@/types/ecommerce';
import { ProductCard } from '@/components/cart/ProductCard';
import { Button } from '@/components/ui/button';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onProductSelect?: (product: Product) => void;
  // pagination
  page?: number;
  total?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  hasMore = false,
  onLoadMore,
  onProductSelect,
  page = 1,
  total = 0,
  itemsPerPage = 12,
  onPageChange,
}) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

  const getProductKey = (product: Product, index: number) => {
    if (product.id) return product.id;
    const p = product as unknown as Record<string, unknown>;
    if (typeof p._id === 'string') return p._id;
    return String(index);
  }

  useEffect(() => {
    setDisplayedProducts(products);
  }, [products]);

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-12 space-y-4">
        <Package className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
        <div>
          <h3 className="text-lg font-medium text-muted-foreground">No products found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.map((product, index) => (
          <div
            key={getProductKey(product, index)}
            className="animate-fade-in"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <ProductCard 
              product={product} 
              onViewDetails={onProductSelect}
            />
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Loading products...</span>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && onLoadMore && (
        <div className="flex justify-center">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Load More Products
          </Button>
        </div>
      )}

      {/* Pagination Controls */}
      {typeof onPageChange === 'function' && (
        <div className="py-6">
          <div className="flex items-center justify-center">
            {/* simple numeric pagination */}
            <div className="space-x-2">
              {Array.from({ length: Math.max(1, Math.ceil(total / itemsPerPage)) }).map((_, i) => {
                const p = i + 1
                const active = p === page
                return (
                  <Button
                    key={p}
                    size={active ? 'default' : 'icon'}
                    variant={active ? 'outline' : 'ghost'}
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
        <span>Showing {displayedProducts.length} products</span>
        {hasMore && (
          <span>Scroll down or click "Load More" to see more products</span>
        )}
      </div>
    </div>
  );
};
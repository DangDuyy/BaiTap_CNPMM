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
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  hasMore = false,
  onLoadMore,
  onProductSelect,
}) => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

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
            key={product.id}
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
      {hasMore && !loading && (
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
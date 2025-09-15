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
      {typeof onPageChange === "function" && (
        <div className="py-6">
          <div className="flex items-center justify-center">
            {(() => {
              const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))
              const goTo = (p) => onPageChange(Math.min(totalPages, Math.max(1, p)))
              const canPrev = page > 1
              const canNext = page < totalPages

              // Tạo mảng hiển thị trang với dấu "…"
              const getRange = (current, last, delta = 1) => {
                // luôn hiện: 1, last, current +/- delta
                const range = []
                const left = Math.max(2, current - delta)
                const right = Math.min(last - 1, current + delta)

                range.push(1)
                if (left > 2) range.push("...")
                for (let i = left; i <= right; i++) range.push(i)
                if (right < last - 1) range.push("...")
                if (last > 1) range.push(last)
                return Array.from(new Set(range)) // phòng trùng khi last nhỏ
              }

              const pages = getRange(page, totalPages, 1)

              return (
                <div className="flex items-center gap-2">
                  {/* First */}
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="First page"
                    disabled={!canPrev}
                    onClick={() => goTo(1)}
                  >
                    {/* lucide-react */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 6 11 12 17 18"/><path d="M7 6v12"/></svg>
                  </Button>

                  {/* Prev */}
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Previous page"
                    disabled={!canPrev}
                    onClick={() => goTo(page - 1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m15 18-6-6 6-6"/></svg>
                  </Button>

                  {/* Numeric */}
                  <div className="space-x-2">
                    {pages.map((p, idx) =>
                      p === "..." ? (
                        <Button key={`ellipsis-${idx}`} size="icon" variant="ghost" disabled>
                          …
                        </Button>
                      ) : (
                        <Button
                          key={p}
                          size={p === page ? "default" : "icon"}
                          variant={p === page ? "outline" : "ghost"}
                          aria-current={p === page ? "page" : undefined}
                          onClick={() => goTo(p)}
                        >
                          {p}
                        </Button>
                      )
                    )}
                  </div>

                  {/* Next */}
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Next page"
                    disabled={!canNext}
                    onClick={() => goTo(page + 1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 18 6-6-6-6"/></svg>
                  </Button>

                  {/* Last */}
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Last page"
                    disabled={!canNext}
                    onClick={() => goTo(totalPages)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 6 6 6-6 6"/><path d="M17 6v12"/></svg>
                  </Button>
                </div>
              )
            })()}
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
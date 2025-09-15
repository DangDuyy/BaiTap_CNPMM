import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types/ecommerce';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in"
      onClick={handleViewDetails}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Sale Badge */}
          {product.isOnSale && (
            <Badge 
              variant="destructive" 
              className="absolute top-3 left-3 bg-sale text-white font-semibold shadow-md"
            >
              -{product.discount}%
            </Badge>
          )}
          
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="bg-white hover:bg-primary hover:text-primary-foreground text-primary border-0 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Category & Views */}
          <div className="flex items-center justify-between text-sm">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
            <div className="flex items-center text-muted-foreground">
              <Eye className="h-3 w-3 mr-1" />
              {product.views}
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-price">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
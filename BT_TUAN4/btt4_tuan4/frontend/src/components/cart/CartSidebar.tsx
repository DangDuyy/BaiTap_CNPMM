import React from 'react';
import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export const CartSidebar: React.FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart, isOpen, toggleCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="flex-1 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      />
      
      {/* Sidebar */}
      <div className="w-full max-w-md bg-cart-background shadow-2xl animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            {totalItems > 0 && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCart}
            className="hover:bg-muted rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
              <div>
                <h3 className="text-lg font-medium text-muted-foreground">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add some products to get started
                </p>
              </div>
              <Button onClick={toggleCart} variant="outline">
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="p-4 hover:bg-cart-item-hover transition-colors">
                <div className="flex space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      ${item.product.price.toFixed(2)} each
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium text-sm min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-price">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive h-auto p-0 text-xs mt-1"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            {/* Total */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-price">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                size="lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Checkout
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={toggleCart}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
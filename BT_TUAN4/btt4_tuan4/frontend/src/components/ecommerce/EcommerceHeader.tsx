import React, { useState } from 'react';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthModals } from '@/components/auth/AuthModals';

export const EcommerceHeader: React.FC = () => {
  const { totalItems, toggleCart } = useCart();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' | 'otp' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EcomCart
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Home
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Categories
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Deals
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              About
            </Button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => openAuthModal('login')}
                className="text-foreground hover:text-primary"
              >
                Đăng nhập
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openAuthModal('register')}
                className="text-foreground hover:text-primary"
              >
                Đăng ký
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => openAuthModal('login')}
              className="md:hidden"
            >
              <User className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCart}
              className="relative hover:bg-primary/10 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent hover:bg-accent animate-bounce-in"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <AuthModals 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
};
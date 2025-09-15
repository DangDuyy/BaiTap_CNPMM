import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Product, CartContextType } from '@/types/ecommerce';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/redux/hooks';
import api from '@/lib/api';

// Safely extract message from unknown error
const getErrorMessage = (err: unknown): string => {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (typeof err === 'object') {
    const maybe = err as Record<string, unknown>;
    if (typeof maybe.message === 'string') return maybe.message;
    if (maybe.response && typeof maybe.response === 'object') {
      const resp = maybe.response as Record<string, unknown>;
      if (resp.data && typeof resp.data === 'object') {
        const data = resp.data as Record<string, unknown>;
        if (typeof data.message === 'string') return data.message;
      }
    }
  }
  return String(err);
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, { id: product.id, product, quantity }],
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload),
      };
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.product.id !== productId),
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        ),
      };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_CART':
      return { ...state, items: action.payload };
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
      
    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };
    
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const { toast } = useToast();
  const user = useAppSelector((state) => state.user.user)

  // Helper: map backend cart items to frontend CartItem[]
  const mapServerItems = (items: unknown): CartItem[] => {
    if (!Array.isArray(items)) return [];
    return items.map((raw) => {
      const it = raw as Record<string, unknown>;
      // productId may be populated (object) or a string id
      let productIdVal = '';
      let productDoc: Record<string, unknown> | null = null;
      if (it.productId && typeof it.productId === 'object') {
        productDoc = it.productId as Record<string, unknown>;
        productIdVal = (productDoc._id as string) || (productDoc.id as string) || '';
      } else if (it.productId && typeof it.productId === 'string') {
        productIdVal = it.productId as string;
      }

      const product: Product = {
        id: productIdVal || '',
        name: (productDoc && (productDoc.name as string)) || (it.name as string) || '',
        price: (productDoc && (productDoc.price as number)) || (it.price as number) || 0,
        image: (productDoc && (productDoc.image as string)) || (it.image as string) || '',
        category: (productDoc && (productDoc.category as string)) || (it.category as string) || '',
        description: (productDoc && (productDoc.description as string)) || (it.description as string) || '',
        rating: (productDoc && (productDoc.rating as number)) || (it.rating as number) || 0,
        reviews: (productDoc && (productDoc.reviews as number)) || (it.reviews as number) || 0,
        inStock: (productDoc && (productDoc.inStock as boolean)) ?? ((it.inStock as boolean) ?? true),
        tags: (productDoc && (productDoc.tags as string[])) || (it.tags as string[]) || [],
        views: (productDoc && (productDoc.views as number)) || (it.views as number) || 0,
        isOnSale: (productDoc && (productDoc.isOnSale as boolean)) || (it.isOnSale as boolean) || false,
      } as Product;

      const id = (it._id as string) || (it.id as string) || (productIdVal) || product.id;
      const quantity = (it.quantity as number) || 1;

      return {
        id,
        product,
        quantity,
      } as CartItem;
    });
  };

  const addItem = async (product: Product, quantity = 1) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You must be signed in to add items to cart.', duration: 2500 })
      return
    }
    // Ensure we pass a valid Mongo ObjectId to backend. If frontend product.id is from mock data (like '1'),
    // try to resolve the real product on server by name.
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(product.id);
    let serverProductId = product.id;

    if (!isObjectId) {
      try {
        const lookup = await api.get('/products', { params: { q: product.name, itemsPerPage: 1 } });
        const found = (lookup.data && (lookup.data.items || lookup.data)) || [];
        const first = Array.isArray(found) ? found[0] : undefined;
        if (first && first._id) {
          serverProductId = first._id;
        } else if (first && first.id) {
          serverProductId = first.id;
        } else {
          toast({ title: 'Product not available', description: 'This product is not present on the server. Please import or use server products to add to cart.', duration: 3500 });
          return;
        }
      } catch (err: unknown) {
        toast({ title: 'Could not find product', description: getErrorMessage(err), duration: 3000 });
        return;
      }
    }

    try {
      const res = await api.post('/carts', { productId: serverProductId, quantity });
      const serverCart = res.data;
      const mapped = mapServerItems(serverCart.items);
      dispatch({ type: 'SET_CART', payload: mapped });
      toast({ title: 'Added to cart', description: `${product.name} has been added to your cart.`, duration: 2000 });
    } catch (err: unknown) {
      toast({ title: 'Could not add to cart', description: getErrorMessage(err), duration: 3000 });
    }
  };

  // Fetch cart from server and set local state
  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await api.get('/carts');
      const serverCart = res.data;
      const mapped = mapServerItems(serverCart.items);
      dispatch({ type: 'SET_CART', payload: mapped });
    } catch (err: unknown) {
      // Non-fatal, show a toast
      console.warn('Could not fetch cart', getErrorMessage(err));
    }
  };

  const removeItem = async (itemId: string) => {
    console.debug('[cart][client] removeItem called with id:', itemId)
    console.debug('[cart][client] current items:', state.items.map(i => ({ id: i.id, productId: i.product.id })))
    const item = state.items.find(i => i.id === itemId);
    if (!item) {
      console.warn('[cart][client] removeItem: item not found locally for id', itemId)
      return;
    }
    // basic validation: ensure itemId looks like a Mongo ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(itemId)) {
      console.warn('[cart][client] removeItem: id does not look like ObjectId:', itemId)
      // still attempt, backend will return a clear error
    }
    try {
      const res = await api.delete(`/carts/${itemId}`);
      console.debug('[cart][client] removeItem server response:', res.data)
      const serverCart = res.data;
      const mapped = mapServerItems(serverCart.items);
      dispatch({ type: 'SET_CART', payload: mapped });
      toast({ title: 'Removed from cart', description: `${item.product.name} has been removed from your cart.`, duration: 2000 });
    } catch (err: unknown) {
      toast({ title: 'Could not remove item', description: getErrorMessage(err), duration: 3000 });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    console.debug('[cart][client] updateQuantity called with itemId:', itemId, 'quantity:', quantity)
    const item = state.items.find(i => i.id === itemId);
    if (!item) {
      console.warn('[cart][client] updateQuantity: item not found locally for id', itemId)
      return;
    }
    if (!/^[0-9a-fA-F]{24}$/.test(itemId)) {
      console.warn('[cart][client] updateQuantity: id does not look like ObjectId:', itemId)
    }
    try {
      const res = await api.put(`/carts/${itemId}`, { quantity });
      console.debug('[cart][client] updateQuantity server response:', res.data)
      const serverCart = res.data;
      const mapped = mapServerItems(serverCart.items);
      dispatch({ type: 'SET_CART', payload: mapped });
    } catch (err: unknown) {
      toast({ title: 'Could not update quantity', description: getErrorMessage(err), duration: 3000 });
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/carts');
      const serverCart = res.data;
      const mapped = mapServerItems(serverCart.items);
      dispatch({ type: 'SET_CART', payload: mapped });
      toast({ title: 'Cart cleared', description: 'All items have been removed from your cart.', duration: 2000 });
    } catch (err: unknown) {
      toast({ title: 'Could not clear cart', description: getErrorMessage(err), duration: 3000 });
    }
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  // Sync cart when user logs in or logs out
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // clear local cart when not authenticated
      dispatch({ type: 'SET_CART', payload: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const contextValue: CartContextType = {
    items: state.items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen: state.isOpen,
    toggleCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
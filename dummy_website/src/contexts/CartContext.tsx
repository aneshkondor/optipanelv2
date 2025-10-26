import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../lib/mock-data';
import { analyticsTracker } from '../services/analyticsTracker';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      let newItems;
      if (existing) {
        newItems = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prev, { ...product, quantity }];
      }

      // Track cart action
      const newCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotal = newItems.reduce((sum, item) => {
        const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
        return sum + price * item.quantity;
      }, 0);
      analyticsTracker.trackCartAction('add', newCount, newTotal);

      return newItems;
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== productId);

      // Track removal
      const newCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotal = newItems.reduce((sum, item) => {
        const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
        return sum + price * item.quantity;
      }, 0);
      analyticsTracker.trackCartAction('remove', newCount, newTotal);

      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => {
      const newItems = prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );

      // Track update
      const newCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotal = newItems.reduce((sum, item) => {
        const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
        return sum + price * item.quantity;
      }, 0);
      analyticsTracker.trackCartAction('update', newCount, newTotal);

      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

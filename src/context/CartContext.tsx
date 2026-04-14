'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Product, OrderLineItem } from '@/lib/supabase';

export type CartItem = {
  product: Product;
  quantity: number;
  weight: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; weight: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; weight: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        i => i.product.id === action.payload.product.id && i.weight === action.payload.weight
      );
      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += action.payload.quantity;
        return { ...state, items: updated, isOpen: true };
      }
      return { ...state, items: [...state.items, action.payload], isOpen: true };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          i => !(i.product.id === action.payload.productId && i.weight === action.payload.weight)
        ),
      };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            i => !(i.product.id === action.payload.productId && i.weight === action.payload.weight)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.payload.productId && i.weight === action.payload.weight
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }
    case 'CLEAR_CART': return { ...state, items: [] };
    case 'TOGGLE_CART': return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART': return { ...state, isOpen: true };
    case 'CLOSE_CART': return { ...state, isOpen: false };
    case 'HYDRATE': return { ...state, items: action.payload };
    default: return state;
  }
};

type CartContextType = {
  state: CartState;
  addItem: (product: Product, quantity: number, weight: string) => void;
  removeItem: (productId: string, weight: string) => void;
  updateQuantity: (productId: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  lineItems: OrderLineItem[];
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mtc_cart');
      if (saved) dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mtc_cart', JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const addItem = useCallback((product: Product, quantity: number, weight: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, weight } });
  }, []);

  const removeItem = useCallback((productId: string, weight: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, weight } });
  }, []);

  const updateQuantity = useCallback((productId: string, weight: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, weight, quantity } });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const lineItems: OrderLineItem[] = state.items.map(i => ({
    product_id: i.product.id,
    product_name: i.product.name,
    product_image: i.product.image_url,
    price: i.product.price,
    quantity: i.quantity,
    weight: i.weight,
  }));

  return (
    <CartContext.Provider value={{
      state, addItem, removeItem, updateQuantity, clearCart,
      toggleCart, openCart, closeCart, totalItems, subtotal, shipping, total, lineItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

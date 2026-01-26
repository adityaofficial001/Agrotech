
import React, { createContext, useContext, useState } from 'react';
import { Product } from '../data/categories';
import { toast } from 'sonner';
import { useLanguage } from './LanguageContext';

export interface CartItem extends Product {
    cartQuantity: number;
}

type CartContextType = {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    buyNow: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    itemsCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { t } = useLanguage();
    const [items, setItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    React.useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, quantity: number = 1) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === product.id);
            if (existingItem) {
                toast.info(t.products.quantityUpdated);
                return currentItems.map((item) =>
                    item.id === product.id
                        ? { ...item, cartQuantity: item.cartQuantity + quantity }
                        : item
                );
            }
            toast.success(t.products.addedToCart);
            return [...currentItems, { ...product, cartQuantity: quantity }];
        });
    };

    const buyNow = (product: Product) => {
        setItems([{ ...product, cartQuantity: 1 }]);
        toast.success(t.products.proceedingToCheckout);
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setItems((currentItems) => {
            if (quantity <= 0) {
                return currentItems.filter((item) => item.id !== productId);
            }
            return currentItems.map((item) =>
                item.id === productId ? { ...item, cartQuantity: quantity } : item
            );
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartTotal = items.reduce(
        (total, item) => total + item.price * item.cartQuantity,
        0
    );

    const itemsCount = items.reduce((count, item) => count + item.cartQuantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addToCart, buyNow, removeFromCart, updateQuantity, clearCart, cartTotal, itemsCount }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

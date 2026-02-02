
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/categories';
import { toast } from 'sonner';

export interface Order {
    id: string;
    date: string;
    total: number;
    status: 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
    items: string[];
}

interface UserPreferencesContextType {
    wishlist: string[];
    toggleWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;

    comparisons: Product[];
    addToComparison: (product: Product) => void;
    removeFromComparison: (productId: string) => void;
    clearComparison: () => void;

    orders: Order[];
    addMockOrder: (order: Order) => void;
    cancelOrder: (orderId: string) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
    // Wishlist State
    const [wishlist, setWishlist] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse wishlist from local storage", e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (productId: string) => {
        setWishlist(prev => {
            const index = prev.indexOf(productId);
            if (index > -1) {
                toast.info("Removed from wishlist");
                return prev.filter(id => id !== productId);
            }
            toast.success("Added to wishlist");
            return [...prev, productId];
        });
    };

    const isInWishlist = (productId: string) => wishlist.includes(productId);

    // Comparison State
    const [comparisons, setComparisons] = useState<Product[]>([]);

    const addToComparison = (product: Product) => {
        setComparisons(prev => {
            if (prev.find(p => p.id === product.id)) {
                toast.info("Product already in comparison list");
                return prev;
            }
            if (prev.length >= 3) {
                toast.error("You can compare up to 3 products only");
                return prev;
            }
            toast.success("Added to comparison");
            return [...prev, product];
        });
    };

    const removeFromComparison = (productId: string) => {
        setComparisons(prev => prev.filter(p => p.id !== productId));
    };

    const clearComparison = () => setComparisons([]);

    // Mock Orders State
    const [orders, setOrders] = useState<Order[]>(() => {
        try {
            const saved = localStorage.getItem('userOrders');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse userOrders from local storage", e);
        }

        // Initial Mock Data
        return [
            {
                id: 'ORD-7721',
                date: '2026-01-15',
                total: 1250,
                status: 'Delivered',
                items: ['Coragen Insecticide', 'Hybrid Tomato Seeds']
            },
            {
                id: 'ORD-8942',
                date: '2026-01-20',
                total: 2100,
                status: 'Shipped',
                items: ['Drip Irrigation Pipe 16mm']
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('userOrders', JSON.stringify(orders));
    }, [orders]);

    const addMockOrder = (order: Order) => {
        setOrders(prev => [order, ...prev]);
    };

    const cancelOrder = (orderId: string) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId
                ? { ...order, status: 'Cancelled' as const }
                : order
        ));
        toast.info("Order cancellation requested");
    };

    return (
        <UserPreferencesContext.Provider value={{
            wishlist, toggleWishlist, isInWishlist,
            comparisons, addToComparison, removeFromComparison, clearComparison,
            orders, addMockOrder, cancelOrder
        }}>
            {children}
        </UserPreferencesContext.Provider>
    );
};

export const useUserPreferences = () => {
    const context = useContext(UserPreferencesContext);
    if (context === undefined) {
        throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
    }
    return context;
};

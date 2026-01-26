
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/data/categories';

interface ProductModalContextType {
    isOpen: boolean;
    product: Product | null;
    openModal: (product: Product) => void;
    closeModal: () => void;
}

const ProductModalContext = createContext<ProductModalContextType | undefined>(undefined);

export const ProductModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);

    const openModal = (product: Product) => {
        setProduct(product);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setProduct(null);
    };

    return (
        <ProductModalContext.Provider value={{ isOpen, product, openModal, closeModal }}>
            {children}
            {/* Modal component will be rendered here to ensure it's always available */}
        </ProductModalContext.Provider>
    );
};

export const useProductModal = () => {
    const context = useContext(ProductModalContext);
    if (context === undefined) {
        throw new Error('useProductModal must be used within a ProductModalProvider');
    }
    return context;
};

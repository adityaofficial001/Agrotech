import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from '@/data/categories';

export const ProductSkeleton = () => {
    return (
        <div className="bg-card rounded-xl overflow-hidden shadow-sm flex flex-col h-[380px] animate-pulse">
            <div className="h-48 bg-muted w-full"></div>
            <div className="p-4 flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-muted"></div>
                    <div className="w-20 h-3 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                    <div className="w-full h-4 bg-muted rounded"></div>
                    <div className="w-2/3 h-4 bg-muted rounded"></div>
                </div>
                <div className="mt-auto flex gap-2">
                    <div className="w-1/2 h-8 bg-muted rounded"></div>
                    <div className="w-1/2 h-8 bg-muted rounded"></div>
                </div>
            </div>
        </div>
    );
};

interface ProductGridProps {
    products: Product[];
    currentLanguage?: 'en' | 'hi';
    isLoading?: boolean;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    currentLanguage = 'en',
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <ProductSkeleton key={`skeleton-${i}`} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                <p className="text-muted-foreground">
                    {currentLanguage === 'hi' ? 'कोई उत्पाद नहीं मिला' : 'No products found matching your filters.'}
                </p>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {products.map((product) => (
                <motion.div key={product.id} variants={item}>
                    <ProductCard
                        product={product}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ProductGrid;

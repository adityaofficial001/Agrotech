import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/data/categories';

interface ProductGridProps {
    products: Product[];
    currentLanguage?: 'en' | 'hi';
}

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    currentLanguage = 'en',
}) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    );
};

export default ProductGrid;

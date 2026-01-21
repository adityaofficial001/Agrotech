import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, ShoppingCart, Wheat, Bug, Droplets, Heart, Scale } from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useComparison } from '@/contexts/ComparisonContext';

import { Product } from '@/data/categories';

interface ProductCardProps {
  product: Product;
}

const cropIcons: Record<string, React.ElementType> = {
  wheat: Wheat,
  rice: Droplets,
  pest: Bug,
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
}) => {
  const { t } = useLanguage();
  const { addToCart, buyNow } = useCart();
  const navigate = useNavigate();

  // Use new context hooks
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInComparison, toggleComparison } = useComparison();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };
  return (
    <div
      className="group bg-card rounded-xl overflow-hidden shadow-agri-sm hover:shadow-agri-lg transition-all duration-300 flex flex-col cursor-pointer h-full"
      onClick={handleProductClick}
    >
      {/* Image Section with Pattern Background */}
      <div className="relative h-48 bg-gradient-to-br from-agri-cream to-muted overflow-hidden">




        {/* ... decorative pattern ... */}

        {/* Shop Now Overlay Button */}
        <div className="absolute inset-0 z-10 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <AgriButton
            className="bg-white text-primary hover:bg-agri-yellow hover:text-agri-brown font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
            size="sm"
          >
            {t.products.buyNow}
          </AgriButton>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="farm-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-primary" />
            </pattern>
            <rect width="100" height="100" fill="url(#farm-pattern)" />
          </svg>
        </div>

        {/* Wishlist & Compare Buttons */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isInWishlist(product.id)
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-background/80 text-muted-foreground hover:bg-background hover:text-destructive'
              }`}
            title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleComparison(product.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isInComparison(product.id)
              ? 'bg-primary text-primary-foreground'
              : 'bg-background/80 text-muted-foreground hover:bg-background hover:text-primary'
              }`}
            title={isInComparison(product.id) ? 'Remove from comparison' : 'Add to comparison'}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Tractor className="w-12 h-12 text-primary" />
            </div>
          )}
        </div>

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute top-3 right-3 z-20">
            <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full">
              {t.products.outOfStock}
            </span>
          </div>
        )}

        {/* Quantity Badge */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
            {product.quantity}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Tractor className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="text-xs font-semibold text-primary">{product.brand}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-display font-semibold text-foreground text-sm mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Crop/Pest Icons */}
        {(product.crops || product.pests) && (
          <div className="flex items-center gap-1.5 mb-3">
            {product.crops?.map((crop, idx) => (
              <div
                key={`crop-${idx}`}
                className="w-7 h-7 rounded-full bg-agri-green-light/20 flex items-center justify-center"
                title={crop}
              >
                <Wheat className="w-4 h-4 text-agri-green" />
              </div>
            ))}
            {product.pests?.map((pest, idx) => (
              <div
                key={`pest-${idx}`}
                className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center"
                title={pest}
              >
                <Bug className="w-4 h-4 text-destructive" />
              </div>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-lg font-bold text-primary">
              ₹{product.priceMin.toLocaleString()}
            </span>
            {product.priceMax !== product.priceMin && (
              <>
                <span className="text-muted-foreground">–</span>
                <span className="text-lg font-bold text-primary">
                  ₹{product.priceMax.toLocaleString()}
                </span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <AgriButton
              variant="default"
              size="sm"
              className="flex-1 bg-agri-yellow text-agri-brown hover:bg-agri-yellow/90 font-bold"
              disabled={!product.inStock}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {product.category === 'Services' || product.category === 'Offers' ? t.products.buyNow : t.products.addToCart}
            </AgriButton>

            <AgriButton
              variant="secondary"
              size="sm"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold"
              disabled={!product.inStock}
              onClick={(e) => {
                e.stopPropagation();
                buyNow(product);
                navigate('/checkout');
              }}
            >
              {t.products.buyNow}
            </AgriButton>
          </div>
        </div >
      </div >
    </div >
  );
};

export default ProductCard;

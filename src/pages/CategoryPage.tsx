import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import CategoryBanner from '@/components/sections/CategoryBanner';
import ProductSlider from '@/components/products/ProductSlider';
import ProductGrid from '@/components/products/ProductGrid';
import FilterSidebar from '@/components/products/FilterSidebar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/data/categories';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import {
  insecticideProducts,
  seedProducts,
  fertilizerProducts,
  herbicideProducts,
  implementsProducts,
  growthProducts,
  bioproductsProducts,
  alliedProducts,
  cropscienceProducts,
  offersProducts
} from '@/data/products';
import { toast } from '@/hooks/use-toast';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const currentLanguage = language === 'HI' ? 'hi' : 'en';

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Reset filters when category changes
  useEffect(() => {
    setSelectedBrands([]);
    setSelectedCrops([]);
    setPriceRange([0, 10000]);
    setOnlyInStock(false);
    setIsMobileFilterOpen(false);
  }, [categoryId]);


  const handleAddToCart = (product: Product) => {
    toast({
      title: t.products.addedToCart,
      description: product.name,
    });
  };

  const handleCategoryChange = (newCategoryId: string) => {
    navigate(`/category/${newCategoryId}`);
  };

  const getCategoryData = () => {
    switch (categoryId) {
      case 'insecticides':
        return {
          products: insecticideProducts,
          title: t.categories.insecticides,
          relatedProducts: seedProducts.slice(0, 4),
          relatedTitle: t.categories.seeds
        };
      case 'seeds':
        return {
          products: seedProducts,
          title: t.categories.seeds,
          relatedProducts: fertilizerProducts.slice(0, 4),
          relatedTitle: t.categories.fertilizers
        };
      case 'fertilizers':
        return {
          products: fertilizerProducts,
          title: t.categories.fertilizers,
          relatedProducts: herbicideProducts.slice(0, 4),
          relatedTitle: t.categories.herbicides
        };
      case 'herbicides':
        return {
          products: herbicideProducts,
          title: t.categories.herbicides,
          relatedProducts: insecticideProducts.slice(0, 4),
          relatedTitle: t.categories.insecticides
        };
      case 'implements':
        return {
          products: implementsProducts,
          title: t.categories.implements,
          relatedProducts: fertilizerProducts.slice(0, 4),
          relatedTitle: t.categories.fertilizers
        };
      case 'growth':
        return {
          products: growthProducts,
          title: t.categories.growth,
          relatedProducts: seedProducts.slice(0, 4),
          relatedTitle: t.categories.seeds
        };
      case 'bioproducts':
        return {
          products: bioproductsProducts,
          title: t.categories.bio,
          relatedProducts: insecticideProducts.slice(0, 4),
          relatedTitle: t.categories.insecticides
        };
      case 'allied':
        return {
          products: alliedProducts,
          title: t.categories.allied,
          relatedProducts: herbicideProducts.slice(0, 4),
          relatedTitle: t.categories.herbicides
        };
      case 'cropscience':
        return {
          products: cropscienceProducts,
          title: t.categories.cropScience,
          relatedProducts: seedProducts.slice(0, 4),
          relatedTitle: t.categories.seeds
        };
      case 'offers':
        return {
          products: offersProducts || [],
          title: language === 'HI' ? 'विशेष ऑफर' : 'Special Offers',
          relatedProducts: insecticideProducts.slice(0, 4),
          relatedTitle: t.categories.insecticides
        };
      default:
        return {
          products: insecticideProducts,
          title: t.categories.insecticides,
          relatedProducts: seedProducts.slice(0, 4),
          relatedTitle: t.categories.seeds
        };
    }
  };

  const { products, title, relatedProducts } = getCategoryData();

  // Derived Filter Data
  const { availableBrands, availableCrops, minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { availableBrands: [], availableCrops: [], minPrice: 0, maxPrice: 10000 };

    const brands = Array.from(new Set(products.map(p => p.brand))).sort();

    const cropsSet = new Set<string>();
    products.forEach(p => {
      p.crops?.forEach(c => cropsSet.add(c));
    });
    const crops = Array.from(cropsSet).sort();

    const prices = products.flatMap(p => [p.priceMin, p.priceMax]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return {
      availableBrands: brands,
      availableCrops: crops,
      minPrice: Math.floor(min / 100) * 100, // Round down to nearest 100
      maxPrice: Math.ceil(max / 100) * 100, // Round up to nearest 100
    };
  }, [products]);

  // Update price range when min/max changes
  useEffect(() => {
    if (minPrice !== undefined && maxPrice !== undefined) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]);


  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Brand Filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Crop Filter
      if (selectedCrops.length > 0) {
        const productCrops = product.crops || [];
        const hasMatchingCrop = selectedCrops.some(crop => productCrops.includes(crop));
        if (!hasMatchingCrop) return false;
      }

      // Price Filter
      if (product.priceMin > priceRange[1] || product.priceMax < priceRange[0]) {
        return false;
      }

      // Stock Filter
      if (onlyInStock && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [products, selectedBrands, selectedCrops, priceRange, onlyInStock]);

  // Handle Filter Changes
  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleCropChange = (crop: string) => {
    setSelectedCrops(prev =>
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader />

      <CategoryNav
        activeCategory={categoryId || 'insecticides'}
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: title }
            ]}
          />
          <CategoryBanner
            category={categoryId || 'insecticides'}
            currentLanguage={currentLanguage}
          />

          {products.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8 relative">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {t.categories.filterBtn}
                </Button>
              </div>

              {/* Sidebar */}
              <FilterSidebar
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                brands={availableBrands}
                crops={availableCrops}
                minPrice={minPrice}
                maxPrice={maxPrice}
                selectedBrands={selectedBrands}
                onBrandChange={handleBrandChange}
                selectedCrops={selectedCrops}
                onCropChange={handleCropChange}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                onlyInStock={onlyInStock}
                onStockChange={setOnlyInStock}
                onClearAll={() => {
                  setSelectedBrands([]);
                  setSelectedCrops([]);
                  setPriceRange([minPrice, maxPrice]);
                  setOnlyInStock(false);
                }}
                currentLanguage={currentLanguage}
              />

              {/* Product Grid */}
              <div className="flex-1">
                <ProductGrid
                  products={filteredProducts}
                  currentLanguage={currentLanguage}
                />
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-12 text-center my-8 border border-border">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">🌱</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                {t.categories.comingSoon}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t.categories.comingSoonDesc}
              </p>
            </div>
          )}

          {relatedProducts.length > 0 && (
            <div className="mt-12 border-t border-border pt-12">
              <ProductSlider
                products={relatedProducts}
                title={t.productDetail.relatedProducts}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
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


const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const currentLanguage = language === 'HI' ? 'hi' : 'en';

  const GLOBAL_CROP_FILTERS = ['Cotton', 'Maize', 'Rice', 'Tomato', 'Wheat'];

  // Filter States
  // Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedPackSizes, setSelectedPackSizes] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Reset filters when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedBrands([]);
    setSelectedCrops([]);
    setSelectedTypes([]);
    setSelectedMethods([]);
    setSelectedStages([]);
    setSelectedPackSizes([]);
    setSelectedRatings([]);
    setPriceRange([0, 10000]);
    setOnlyInStock(false);
    setIsMobileFilterOpen(false);
  }, [categoryId]);


  const getProductCountText = (filtered: number, total: number) => {
    if (currentLanguage === 'hi') {
      return `${total} में से ${filtered} उत्पाद दिखा रहे हैं`;
    }
    return `Showing ${filtered} of ${total} products`;
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
  const { availableBrands, availableCrops, availableTypes, availableMethods, availableStages, availablePackSizes, minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { availableBrands: [], availableCrops: [], availableTypes: [], availableMethods: [], availableStages: [], availablePackSizes: [], minPrice: 0, maxPrice: 10000 };

    const brands = Array.from(new Set(products.map(p => p.brand))).sort();

    const cropsSet = new Set<string>();
    const typesSet = new Set<string>();
    const methodsSet = new Set<string>();
    const stagesSet = new Set<string>();
    const packSizesSet = new Set<string>();

    products.forEach(p => {
      p.crops?.forEach(c => cropsSet.add(c));
      p.type?.forEach(t => typesSet.add(t));
      p.applicationMethod?.forEach(m => methodsSet.add(m));
      p.growthStage?.forEach(s => stagesSet.add(s));
      if (p.packSize) packSizesSet.add(p.packSize);
    });

    const crops = GLOBAL_CROP_FILTERS;
    const types = Array.from(typesSet).sort();
    const methods = Array.from(methodsSet).sort();
    const stages = Array.from(stagesSet).sort();
    const packSizes = Array.from(packSizesSet).sort();

    const prices = products.flatMap(p => [p.priceMin, p.priceMax]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return {
      availableBrands: brands,
      availableCrops: crops,
      availableTypes: types,
      availableMethods: methods,
      availableStages: stages,
      availablePackSizes: packSizes,
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
        const productCrops = (product.crops || []).map(c => c.toLowerCase());
        const hasMatchingCrop = selectedCrops.some(crop => productCrops.includes(crop.toLowerCase()));
        if (!hasMatchingCrop) return false;
      }

      // Type Filter
      if (selectedTypes.length > 0) {
        const productTypes = product.type || [];
        const hasMatchingType = selectedTypes.some(type => productTypes.includes(type));
        if (!hasMatchingType) return false;
      }

      // Application Method Filter
      if (selectedMethods.length > 0) {
        const productMethods = product.applicationMethod || [];
        const hasMatchingMethod = selectedMethods.some(method => productMethods.includes(method));
        if (!hasMatchingMethod) return false;
      }

      // Growth Stage Filter
      if (selectedStages.length > 0) {
        const productStages = product.growthStage || [];
        const hasMatchingStage = selectedStages.some(stage => productStages.includes(stage));
        if (!hasMatchingStage) return false;
      }

      // Pack Size Filter
      if (selectedPackSizes.length > 0) {
        if (!product.packSize || !selectedPackSizes.includes(product.packSize)) {
          return false;
        }
      }

      // Rating Filter
      if (selectedRatings.length > 0) {
        const productRating = product.rating || 0;
        // Show if product rating is >= ANY of the selected ratings
        const meetsRating = selectedRatings.some(rating => productRating >= rating);
        if (!meetsRating) return false;
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
  }, [products, selectedBrands, selectedCrops, selectedTypes, selectedMethods, selectedStages, selectedPackSizes, selectedRatings, priceRange, onlyInStock]);

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

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleMethodChange = (method: string) => {
    setSelectedMethods(prev =>
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const handleStageChange = (stage: string) => {
    setSelectedStages(prev =>
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
    );
  };

  const handlePackSizeChange = (size: string) => {
    setSelectedPackSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="mt-[108px] md:mt-[104px]">
        <CategoryNav
          activeCategory={categoryId || 'insecticides'}
          onCategoryChange={handleCategoryChange}
        />
      </div>

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
                crops={GLOBAL_CROP_FILTERS}
                productTypes={availableTypes}
                applicationMethods={availableMethods}
                growthStages={availableStages}
                packSizes={availablePackSizes}
                minPrice={minPrice}
                maxPrice={maxPrice}

                selectedBrands={selectedBrands}
                onBrandChange={handleBrandChange}
                selectedCrops={selectedCrops}
                onCropChange={handleCropChange}

                selectedTypes={selectedTypes}
                onTypeChange={handleTypeChange}
                selectedMethods={selectedMethods}
                onMethodChange={handleMethodChange}
                selectedStages={selectedStages}
                onStageChange={handleStageChange}
                selectedPackSizes={selectedPackSizes}
                onPackSizeChange={handlePackSizeChange}
                selectedRatings={selectedRatings}
                onRatingChange={handleRatingChange}

                priceRange={priceRange}
                onPriceChange={setPriceRange}
                onlyInStock={onlyInStock}
                onStockChange={setOnlyInStock}
                onClearAll={() => {
                  setSelectedBrands([]);
                  setSelectedCrops([]);
                  setSelectedTypes([]);
                  setSelectedMethods([]);
                  setSelectedStages([]);
                  setSelectedPackSizes([]);
                  setSelectedRatings([]);
                  setPriceRange([minPrice, maxPrice]);
                  setOnlyInStock(false);
                }}
              />

              {/* Product Grid */}
              <div className="flex-1">
                <div className="mb-4 text-sm text-muted-foreground">
                  {getProductCountText(filteredProducts.length, products.length)}
                </div>
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

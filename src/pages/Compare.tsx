import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ShoppingBag, CheckCircle, AlertOctagon, TrendingDown, HelpCircle } from 'lucide-react';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import { useComparison } from '@/contexts/ComparisonContext';
import { getAllProducts } from '@/data/products';
import { AgriButton } from '@/components/ui/AgriButton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Compare = () => {

  const { language, t: globalT } = useLanguage();
  const t = globalT.compare;
  const { comparisonIds, toggleComparison, clearComparison } = useComparison();
  const navigate = useNavigate();
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  const allProducts = getAllProducts();
  const allProductsFlat = [
    ...allProducts.insecticides,
    ...allProducts.seeds,
    ...allProducts.fertilizers,
    ...allProducts.herbicides,
    ...allProducts.implements,
    ...allProducts.growth,
    ...allProducts.bioproducts,
    ...allProducts.allied,
    ...allProducts.cropscience,
    ...allProducts.offers
  ];

  const comparisonProducts = allProductsFlat.filter(product =>
    comparisonIds.includes(product.id)
  );

  const handleRemove = (productId: string) => {
    toggleComparison(productId);
  };

  const handleShopNow = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Helper to standardise units for calculation
  const getStandardizedPrice = (price: number, quantity: string) => {
    const qtyStr = quantity.toLowerCase();
    let unitValue = 1;
    if (qtyStr.includes('kg')) {
      unitValue = parseFloat(qtyStr) * 1000; // convert to grams
    } else if (qtyStr.includes('g') && !qtyStr.includes('kg')) {
      unitValue = parseFloat(qtyStr);
    } else if (qtyStr.includes('l') && !qtyStr.includes('ml')) {
      unitValue = parseFloat(qtyStr) * 1000; // convert to ml
    } else if (qtyStr.includes('ml')) {
      unitValue = parseFloat(qtyStr);
    } else {
      // numeric only fallback
      unitValue = parseFloat(qtyStr) || 1;
    }
    return price / unitValue;
  };

  // Find Best Value product (lowest price per unit)
  const bestValueProductId = comparisonProducts.reduce((bestId, current) => {
    if (!bestId) return current.id;
    const bestProd = comparisonProducts.find(p => p.id === bestId);
    if (!bestProd) return current.id;

    const currentRate = getStandardizedPrice(current.price, current.quantity);
    const bestRate = getStandardizedPrice(bestProd.price, bestProd.quantity);

    return currentRate < bestRate ? current.id : bestId;
  }, '');

  // Intelligent "Best for [Crop]" Recommendation
  // Logic: Find a crop that this product has which is mostly unique or first in list
  // Intelligent "Best for [Crop]" Recommendation
  // Logic: Find a crop that this product has which is mostly unique or first in list
  const getProductBadge = (product: typeof comparisonProducts[0]) => {
    if (!product.crops || product.crops.length === 0) return null;

    if (product.crops.length > 2) {
      return { type: 'multi', label: t.multiCrop };
    }

    // Simple heuristic: Pick the first crop as the "Best for" highlight
    return { type: 'specific', label: `${t.bestFor} ${product.crops[0]}` };
  };

  // Helper to check if row has differences
  const hasDifference = (key: keyof typeof comparisonProducts[0]) => {
    const values = comparisonProducts.map(p => {
      const val = p[key];
      // Handle arrays like crops and pests
      if (Array.isArray(val)) {
        return JSON.stringify([...val].sort());
      }
      return val;
    });
    return new Set(values).size > 1;
  };

  const currentLangCode = language === 'HI' ? 'hi' : 'en';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <TopHeader />
      <CategoryNav currentLanguage={currentLangCode} activeCategory="" onCategoryChange={() => { }} />

      <main className="flex-1 container mx-auto px-4 py-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-display font-black text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            {t.title}
          </h1>
          {comparisonProducts.length > 0 && (
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {/* Differences Only Toggle */}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <Switch
                  checked={showDifferencesOnly}
                  onCheckedChange={setShowDifferencesOnly}
                  id="diff-mode"
                />
                <label htmlFor="diff-mode" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                  {t.differencesOnly}
                </label>
              </div>

              <span className="text-sm font-bold text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                {comparisonProducts.length} / 2 {t.items}
              </span>
              <Button variant="ghost" size="sm" onClick={clearComparison} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                {t.clearAll}
              </Button>
            </div>
          )}
        </div>

        {comparisonProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200 shadow-sm max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center animate-pulse">
              <Scale className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              {t.empty}
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{t.emptyDesc}</p>
            <Link to="/">
              <AgriButton size="xl" className="shadow-xl shadow-primary/20">
                <ShoppingBag className="w-5 h-5 mr-2" />
                {t.browse}
              </AgriButton>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden relative">

            {/* Scrollable Container */}
            <TooltipProvider delayDuration={300}>
              <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div className="min-w-[800px] md:min-w-0">

                  {/* Grid Layout */}
                  <div
                    className="grid divide-x divide-gray-100 transition-all duration-500 ease-in-out"
                    style={{
                      gridTemplateColumns: `200px repeat(${comparisonProducts.length}, minmax(0, 1fr))`
                    }}
                  >

                    {/* Sticky Header Row for Titles/Images */}
                    <div className="sticky top-0 z-20 bg-white p-6 flex items-end font-bold text-xl text-gray-400 border-b border-gray-100 shadow-sm">
                      {t.specifications}
                    </div>

                    {comparisonProducts.map((product) => {
                      const recommendationCrop = getProductBadge(product);

                      return (
                        <div key={product.id} className="sticky top-0 z-20 bg-white p-6 border-b border-gray-100 relative group transition-all hover:bg-gray-50/50 shadow-sm">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleRemove(product.id)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-destructive hover:text-white transition-all opacity-0 group-hover:opacity-100 z-30"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t.remove}</p>
                            </TooltipContent>
                          </Tooltip>

                          <div className="aspect-[4/3] mb-4 flex items-center justify-center p-4">
                            <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-lg" />
                          </div>
                          <Link to={`/product/${product.id}`} className="block">
                            <h3 className="font-bold text-gray-900 leading-tight hover:text-primary transition-colors text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Intelligent Badges */}
                          <div className="flex flex-wrap gap-2 mb-4 min-h-[52px]">
                            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-md h-fit">
                              {product.brand}
                            </span>

                            {/* Best Value Badge */}
                            {product.id === bestValueProductId && comparisonProducts.length > 1 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center gap-1 cursor-help h-fit animate-pulse">
                                    <TrendingDown className="w-3 h-3" /> {t.bestValue}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t.bestValue} (Price/Unit)</p>
                                </TooltipContent>
                              </Tooltip>
                            )}

                            {/* Recommendation Badge */}
                            {recommendationCrop && (
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 h-fit ${recommendationCrop.type === 'multi' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                <CheckCircle className="w-3 h-3" /> {recommendationCrop.label}
                              </span>
                            )}
                          </div>

                          <AgriButton
                            className="w-full"
                            variant={product.inStock ? 'cart' : 'outline'}
                            disabled={!product.inStock}
                            onClick={() => handleShopNow(product.id)}
                          >
                            {product.inStock ? t.shopNow : t.outOfStock}
                          </AgriButton>
                        </div>
                      );
                    })}

                    {/* Attribute Rows */}

                    {/* Price */}
                    {(showDifferencesOnly ? hasDifference('price') : true) && (
                      <>
                        <div className={`p-4 text-sm font-bold text-gray-500 bg-gray-50 flex items-center border-b border-gray-100`}>{t.price}</div>
                        {comparisonProducts.map(product => (
                          <div key={`${product.id}-price`} className={`p-4 text-center flex items-center justify-center border-b border-gray-100 ${hasDifference('price') ? 'bg-yellow-50/30' : ''}`}>
                            <span className="font-black text-xl text-gray-900">₹{product.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Category */}
                    {(showDifferencesOnly ? hasDifference('category') : true) && (
                      <>
                        <div className={`p-4 text-sm font-bold text-gray-500 bg-gray-50 flex items-center border-b border-gray-100`}>{t.category}</div>
                        {comparisonProducts.map(product => (
                          <div key={`${product.id}-cat`} className={`p-4 text-center flex items-center justify-center border-b border-gray-100 ${hasDifference('category') ? 'bg-yellow-50/30' : ''}`}>
                            <span className="text-sm font-medium text-gray-700">{product.category}</span>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Pack Size */}
                    {(showDifferencesOnly ? hasDifference('quantity') : true) && (
                      <>
                        <div className={`p-4 text-sm font-bold text-gray-500 bg-gray-50 flex items-center border-b border-gray-100`}>{t.quantity}</div>
                        {comparisonProducts.map(product => (
                          <div key={`${product.id}-qty`} className={`p-4 text-center flex items-center justify-center border-b border-gray-100 ${hasDifference('quantity') ? 'bg-yellow-50/30' : ''}`}>
                            <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-700">{product.quantity}</span>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Availability */}
                    {(showDifferencesOnly ? hasDifference('inStock') : true) && (
                      <>
                        <div className={`p-4 text-sm font-bold text-gray-500 bg-gray-50 flex items-center border-b border-gray-100`}>{t.availability}</div>
                        {comparisonProducts.map(product => (
                          <div key={`${product.id}-stock`} className={`p-4 text-center flex items-center justify-center border-b border-gray-100 ${hasDifference('inStock') ? 'bg-yellow-50/30' : ''}`}>
                            {product.inStock ? (
                              <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                                <CheckCircle className="w-4 h-4 fill-green-100" /> {t.inStock}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-red-500 font-bold text-sm">
                                <AlertOctagon className="w-4 h-4" /> {t.outOfStock}
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    )}

                    {/* Crops */}
                    {(showDifferencesOnly ? hasDifference('crops') : true) && (
                      <>
                        <div className={`p-4 text-sm font-bold text-gray-500 bg-gray-50 flex items-center border-b border-gray-100`}>{t.crops}</div>
                        {comparisonProducts.map(product => (
                          <div key={`${product.id}-crops`} className={`p-4 text-center flex items-center justify-center border-b border-gray-100 ${hasDifference('crops') ? 'bg-yellow-50/30' : ''}`}>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {product.crops?.map(crop => (
                                <div key={crop} className="text-[10px] uppercase font-bold tracking-wider bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">
                                  {crop}
                                </div>
                              )) || '-'}
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Pests */}
                    {(showDifferencesOnly ? hasDifference('pests') : true) && (
                      <>
                        <div className={`p-4 text-sm font-bold text-gray-500 bg-gray-50 flex items-center border-b border-gray-100`}>{t.pests}</div>
                        {comparisonProducts.map(product => (
                          <div key={`${product.id}-pests`} className={`p-4 text-center flex items-center justify-center border-b border-gray-100 ${hasDifference('pests') ? 'bg-yellow-50/30' : ''}`}>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {product.pests?.map(pest => (
                                <div key={pest} className="text-[10px] uppercase font-bold tracking-wider bg-red-50 text-red-700 px-2 py-1 rounded-md border border-red-100">
                                  {pest}
                                </div>
                              )) || '-'}
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                  </div>
                </div>
              </div>
            </TooltipProvider>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Compare;

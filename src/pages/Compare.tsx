import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ShoppingBag, Tractor, Wheat, Bug, ShoppingCart } from 'lucide-react';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import { useComparison } from '@/contexts/ComparisonContext';
import { getAllProducts } from '@/data/products';
import { AgriButton } from '@/components/ui/AgriButton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Compare = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const { comparisonIds, toggleComparison, clearComparison } = useComparison();
  const navigate = useNavigate();

  const allProducts = getAllProducts();
  const allProductsFlat = [
    ...allProducts.insecticides,
    ...allProducts.seeds,
    ...allProducts.fertilizers,
    ...allProducts.herbicides,
  ];

  const comparisonProducts = allProductsFlat.filter(product => 
    comparisonIds.includes(product.id)
  );

  const translations = {
    en: {
      title: 'Compare Products',
      empty: 'No products to compare',
      emptyDesc: 'Add products to compare by clicking the compare icon on product cards',
      browse: 'Browse Products',
      clearAll: 'Clear All',
      brand: 'Brand',
      price: 'Price Range',
      quantity: 'Quantity',
      availability: 'Availability',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      crops: 'Suitable Crops',
      pests: 'Target Pests',
      shopNow: 'Shop Now',
      items: 'products',
    },
    hi: {
      title: 'उत्पादों की तुलना करें',
      empty: 'तुलना करने के लिए कोई उत्पाद नहीं',
      emptyDesc: 'उत्पाद कार्ड पर तुलना आइकन पर क्लिक करके तुलना के लिए उत्पाद जोड़ें',
      browse: 'उत्पाद देखें',
      clearAll: 'सभी हटाएं',
      brand: 'ब्रांड',
      price: 'मूल्य सीमा',
      quantity: 'मात्रा',
      availability: 'उपलब्धता',
      inStock: 'स्टॉक में',
      outOfStock: 'स्टॉक में नहीं',
      crops: 'उपयुक्त फसलें',
      pests: 'लक्षित कीट',
      shopNow: 'अभी खरीदें',
      items: 'उत्पाद',
    }
  };

  const t = translations[currentLanguage];

  const handleRemove = (productId: string) => {
    toggleComparison(productId);
  };

  const handleShopNow = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
      <CategoryNav currentLanguage={currentLanguage} activeCategory="" onCategoryChange={() => {}} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" />
            {t.title}
          </h1>
          {comparisonProducts.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                {comparisonProducts.length} {t.items}
              </span>
              <Button variant="outline" size="sm" onClick={clearComparison}>
                {t.clearAll}
              </Button>
            </div>
          )}
        </div>

        {comparisonProducts.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center border border-border">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Scale className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              {t.empty}
            </h2>
            <p className="text-muted-foreground mb-6">{t.emptyDesc}</p>
            <Link to="/">
              <AgriButton>
                <ShoppingBag className="w-4 h-4 mr-2" />
                {t.browse}
              </AgriButton>
            </Link>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-muted/30 border-b border-border min-w-[150px]"></th>
                    {comparisonProducts.map((product) => (
                      <th key={product.id} className="p-4 bg-muted/30 border-b border-border min-w-[250px]">
                        <div className="relative">
                          <button
                            onClick={() => handleRemove(product.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="h-32 bg-gradient-to-br from-agri-cream to-muted rounded-lg flex items-center justify-center mb-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain p-2"
                              />
                            ) : (
                              <Tractor className="w-12 h-12 text-primary" />
                            )}
                          </div>
                          <p className="font-semibold text-foreground text-sm line-clamp-2">
                            {product.name}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Brand */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium text-muted-foreground bg-muted/20">{t.brand}</td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Tractor className="w-3.5 h-3.5 text-primary-foreground" />
                          </div>
                          <span className="font-medium text-primary">{product.brand}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Price */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium text-muted-foreground bg-muted/20">{t.price}</td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <span className="text-lg font-bold text-primary">
                          ₹{product.priceMin.toLocaleString()}
                          {product.priceMax !== product.priceMin && (
                            <> – ₹{product.priceMax.toLocaleString()}</>
                          )}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Quantity */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium text-muted-foreground bg-muted/20">{t.quantity}</td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {product.quantity}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Availability */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium text-muted-foreground bg-muted/20">{t.availability}</td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        {product.inStock ? (
                          <span className="text-green-600 font-medium">{t.inStock}</span>
                        ) : (
                          <span className="text-destructive font-medium">{t.outOfStock}</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Crops */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium text-muted-foreground bg-muted/20">{t.crops}</td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          {product.crops?.map((crop, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 px-2 py-1 bg-agri-green-light/20 rounded-full text-xs"
                            >
                              <Wheat className="w-3 h-3 text-agri-green" />
                              <span>{crop}</span>
                            </div>
                          )) || <span className="text-muted-foreground">—</span>}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Pests */}
                  <tr className="border-b border-border">
                    <td className="p-4 font-medium text-muted-foreground bg-muted/20">{t.pests}</td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          {product.pests?.map((pest, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 px-2 py-1 bg-destructive/10 rounded-full text-xs"
                            >
                              <Bug className="w-3 h-3 text-destructive" />
                              <span>{pest}</span>
                            </div>
                          )) || <span className="text-muted-foreground">—</span>}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Action */}
                  <tr>
                    <td className="p-4 bg-muted/20"></td>
                    {comparisonProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <AgriButton
                          variant={product.inStock ? "cart" : "outline"}
                          disabled={!product.inStock}
                          onClick={() => handleShopNow(product.id)}
                          className="w-full max-w-[200px]"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {product.inStock ? t.shopNow : t.outOfStock}
                        </AgriButton>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer currentLanguage={currentLanguage} />
    </div>
  );
};

export default Compare;

import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Minus, Plus, Truck, Shield, RefreshCw, Star, Leaf, Bug, Wheat } from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import ProductSlider from '@/components/products/ProductSlider';
import { Product } from '@/components/products/ProductCard';
import { 
  insecticideProducts, 
  seedProducts, 
  fertilizerProducts, 
  herbicideProducts 
} from '@/data/products';
import { toast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const allProducts = [
    ...insecticideProducts, 
    ...seedProducts, 
    ...fertilizerProducts, 
    ...herbicideProducts
  ];

  const product = allProducts.find(p => p.id === productId);

  const translations = {
    en: {
      backToProducts: 'Back to Products',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      quantity: 'Quantity',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      addedToCart: 'Added to cart!',
      features: [
        { icon: Truck, text: 'Free delivery on orders above ₹500' },
        { icon: Shield, text: '100% genuine products' },
        { icon: RefreshCw, text: 'Easy 7-day returns' }
      ],
      description: 'Product Description',
      descriptionText: 'Premium quality agricultural product designed for maximum effectiveness. Suitable for various crops and farming conditions. Follow recommended usage guidelines for best results.',
      usage: 'Usage Instructions',
      usageText: 'Apply as per recommended dosage. Best used during early morning or evening hours. Store in a cool, dry place away from direct sunlight.',
      relatedProducts: 'Related Products',
      notFound: 'Product not found',
      goBack: 'Go back to shop',
    },
    hi: {
      backToProducts: 'उत्पादों पर वापस जाएं',
      addToCart: 'कार्ट में जोड़ें',
      buyNow: 'अभी खरीदें',
      quantity: 'मात्रा',
      inStock: 'स्टॉक में है',
      outOfStock: 'स्टॉक में नहीं है',
      addedToCart: 'कार्ट में जोड़ा गया!',
      features: [
        { icon: Truck, text: '₹500 से ऊपर के ऑर्डर पर मुफ्त डिलीवरी' },
        { icon: Shield, text: '100% असली उत्पाद' },
        { icon: RefreshCw, text: 'आसान 7-दिन की वापसी' }
      ],
      description: 'उत्पाद विवरण',
      descriptionText: 'अधिकतम प्रभावशीलता के लिए डिज़ाइन किया गया प्रीमियम गुणवत्ता वाला कृषि उत्पाद। विभिन्न फसलों और खेती की स्थितियों के लिए उपयुक्त। सर्वोत्तम परिणामों के लिए अनुशंसित उपयोग दिशानिर्देशों का पालन करें।',
      usage: 'उपयोग निर्देश',
      usageText: 'अनुशंसित खुराक के अनुसार लगाएं। सुबह जल्दी या शाम के समय उपयोग करना सबसे अच्छा है। सीधी धूप से दूर ठंडी, सूखी जगह पर स्टोर करें।',
      relatedProducts: 'संबंधित उत्पाद',
      notFound: 'उत्पाद नहीं मिला',
      goBack: 'दुकान पर वापस जाएं',
    }
  };

  const t = translations[currentLanguage];

  const handleAddToCart = (prod?: Product) => {
    const targetProduct = prod || product;
    if (targetProduct) {
      toast({
        title: t.addedToCart,
        description: `${targetProduct.name} x${quantity}`,
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopHeader 
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        />
        <CategoryNav 
          currentLanguage={currentLanguage}
          activeCategory=""
          onCategoryChange={() => {}}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t.notFound}</h1>
            <Link to="/">
              <AgriButton>{t.goBack}</AgriButton>
            </Link>
          </div>
        </main>
        <Footer currentLanguage={currentLanguage} />
      </div>
    );
  }

  // Get related products from same category
  const getRelatedProducts = () => {
    if (insecticideProducts.includes(product)) {
      return insecticideProducts.filter(p => p.id !== product.id).slice(0, 4);
    } else if (seedProducts.includes(product)) {
      return seedProducts.filter(p => p.id !== product.id).slice(0, 4);
    } else if (fertilizerProducts.includes(product)) {
      return fertilizerProducts.filter(p => p.id !== product.id).slice(0, 4);
    } else {
      return herbicideProducts.filter(p => p.id !== product.id).slice(0, 4);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      <CategoryNav 
        currentLanguage={currentLanguage}
        activeCategory=""
        onCategoryChange={() => {}}
      />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToProducts}
          </Link>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-card rounded-2xl border border-border overflow-hidden">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Leaf className="w-24 h-24 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              {/* Brand */}
              <div className="flex items-center gap-2 text-primary">
                <Leaf className="w-5 h-5" />
                <span className="font-medium">{product.brand}</span>
              </div>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">(4.0) • 128 reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  ₹{product.priceMin}
                </span>
                {product.priceMax > product.priceMin && (
                  <span className="text-xl text-muted-foreground">
                    – ₹{product.priceMax}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                product.inStock 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                {product.inStock ? t.inStock : t.outOfStock}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-foreground font-medium">{t.quantity}:</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-muted transition-colors"
                    disabled={!product.inStock}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-muted transition-colors"
                    disabled={!product.inStock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <AgriButton 
                  size="xl" 
                  className="flex-1 gap-2"
                  onClick={() => handleAddToCart()}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t.addToCart}
                </AgriButton>
                <AgriButton 
                  variant="secondary" 
                  size="xl" 
                  className="flex-1"
                  disabled={!product.inStock}
                >
                  {t.buyNow}
                </AgriButton>
              </div>

              {/* Features */}
              <div className="border-t border-border pt-6 space-y-3">
                {t.features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 text-muted-foreground">
                      <Icon className="w-5 h-5 text-primary" />
                      <span>{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description Tabs */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  {t.description}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t.descriptionText}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  {t.usage}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t.usageText}
                </p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <ProductSlider 
            products={getRelatedProducts()}
            title={t.relatedProducts}
            currentLanguage={currentLanguage}
            onAddToCart={handleAddToCart}
          />
        </div>
      </main>

      <Footer currentLanguage={currentLanguage} />
    </div>
  );
};

export default ProductDetail;

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Minus, Plus, Truck, Shield, RefreshCw, Star, Leaf, AlertTriangle, FileText, Droplets } from 'lucide-react';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { language: currentLanguage, setLanguage, t: globalT } = useLanguage();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const allProducts = [
    ...insecticideProducts,
    ...seedProducts,
    ...fertilizerProducts,
    ...herbicideProducts
  ];

  const product = allProducts.find(p => p.id === productId);

  // Mock multiple images by repeating the main image
  const productImages = product?.image
    ? [product.image, product.image, product.image]
    : [];

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
      description: 'Description',
      specifications: 'Specifications',
      dosage: 'Dosage / Usage',
      safety: 'Safety',
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
      description: 'विवरण',
      specifications: 'विशिष्टताएँ',
      dosage: 'खुराक / उपयोग',
      safety: 'सुरक्षा',
      relatedProducts: 'संबंधित उत्पाद',
      notFound: 'उत्पाद नहीं मिला',
      goBack: 'दुकान पर वापस जाएं',
    }
  };

  const t = translations[currentLanguage === 'EN' ? 'en' : 'hi'];

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
          currentLanguage={currentLanguage === 'EN' ? 'en' : 'hi'}
          onLanguageChange={(lang) => setLanguage(lang.toUpperCase() as 'EN' | 'HI')}
        />
        <CategoryNav
          currentLanguage={currentLanguage === 'EN' ? 'en' : 'hi'}
          activeCategory=""
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t.notFound}</h1>
            <Link to="/">
              <AgriButton>{t.goBack}</AgriButton>
            </Link>
          </div>
        </main>
        <Footer currentLanguage={currentLanguage === 'EN' ? 'en' : 'hi'} />
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
        currentLanguage={currentLanguage === 'EN' ? 'en' : 'hi'}
        onLanguageChange={(lang) => setLanguage(lang.toUpperCase() as 'EN' | 'HI')}
      />

      <CategoryNav
        currentLanguage={currentLanguage === 'EN' ? 'en' : 'hi'}
        activeCategory=""
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

          {/* Product Details Header */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl border border-border overflow-hidden flex items-center justify-center p-8 relative group">
                {product.image ? (
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Leaf className="w-24 h-24 text-muted-foreground" />
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 rounded-lg border-2 overflow-hidden bg-white p-2 ${selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-200'
                        }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
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
                      className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
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
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.priceMax}
                  </span>
                )}
                <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                  {Math.round(((product.priceMax - product.priceMin) / product.priceMax) * 100)}% OFF
                </span>
              </div>

              {/* Stock Status */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${product.inStock
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
                    className="px-4 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                    disabled={!product.inStock || quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                    disabled={!product.inStock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
                  onClick={() => {
                    handleAddToCart();
                    navigate('/checkout');
                  }}
                >
                  {t.buyNow}
                </AgriButton>
              </div>

              {/* USP Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-6">
                {t.features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                      <span className="text-xs font-medium text-gray-600">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="mb-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-base"
                >
                  {t.description}
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-base"
                >
                  {t.specifications}
                </TabsTrigger>
                <TabsTrigger
                  value="dosage"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-base"
                >
                  {t.dosage}
                </TabsTrigger>
                <TabsTrigger
                  value="safety"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-base"
                >
                  {t.safety}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="pt-6">
                <div className="prose max-w-none text-gray-600">
                  <p>
                    {currentLanguage === 'EN'
                      ? 'Experience superior agricultural performance with our premium range product. Designed to enhance crop yield and health, this product is formulated using advanced technology to ensure maximum efficiency. Suitable for a wide variety of crops and soil conditions.'
                      : 'हमारे प्रीमियम रेंज उत्पाद के साथ बेहतर कृषि प्रदर्शन का अनुभव करें। फसल की उपज और स्वास्थ्य को बढ़ाने के लिए डिज़ाइन किया गया, यह उत्पाद अधिकतम दक्षता सुनिश्चित करने के लिए उन्नत तकनीक का उपयोग करके तैयार किया गया है। विभिन्न प्रकार की फसलों और मिट्टी की स्थितियों के लिए उपयुक्त।'}
                  </p>
                  <ul className="mt-4 list-disc pl-5 space-y-2">
                    <li>{currentLanguage === 'EN' ? 'High effectiveness against target pests/diseases' : 'लक्ष्य कीटों/रोगों के खिलाफ उच्च प्रभावशीलता'}</li>
                    <li>{currentLanguage === 'EN' ? 'Safe for beneficial insects when used as directed' : 'निर्देशानुसार उपयोग किए जाने पर लाभकारी कीड़ों के लिए सुरक्षित'}</li>
                    <li>{currentLanguage === 'EN' ? 'Rapid action formula' : 'तेजी से काम करने वाला फॉर्मूला'}</li>
                    <li>{currentLanguage === 'EN' ? 'Weather resistant properties' : 'मौसम प्रतिरोधी गुण'}</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium text-gray-900">Brand</span>
                    <span className="text-gray-600">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium text-gray-900">Quantity</span>
                    <span className="text-gray-600">{product.quantity}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium text-gray-900">Form</span>
                    <span className="text-gray-600">{product.quantity.includes('L') || product.quantity.includes('ml') ? 'Liquid' : 'Powder/Granules'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium text-gray-900">Target Crops</span>
                    <span className="text-gray-600 capitalize">{product.crops?.join(', ') || 'All Crops'}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dosage" className="pt-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4">
                  <Droplets className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Recommended Dosage</h3>
                    <p className="text-blue-800">
                      {currentLanguage === 'EN'
                        ? 'Mix 2-3ml per liter of water. Spray thoroughly on foliage. Apply during cool hours of the day (morning or evening) for best absorption.'
                        : '2-3 मिली प्रति लीटर पानी में मिलाएं। पत्तियों पर अच्छी तरह स्प्रे करें। सर्वोत्तम अवशोषण के लिए दिन के ठंडे घंटों (सुबह या शाम) के दौरान आवेदन करें।'}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="safety" className="pt-6">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Safety Precautions</h3>
                    <ul className="list-disc pl-5 space-y-1 text-red-800">
                      <li>Keep out of reach of children.</li>
                      <li>Wear protective gear (gloves, mask) while spraying.</li>
                      <li>Do not inhale spray mist.</li>
                      <li>Wash hands thoroughly after use.</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <ProductSlider
            products={getRelatedProducts()}
            title={t.relatedProducts}
            currentLanguage={currentLanguage === 'EN' ? 'en' : 'hi'}
            onAddToCart={handleAddToCart}
          />
        </div>
      </main>

      <Footer currentLanguage={currentLanguage === 'EN' ? 'en' : 'hi'} />
    </div>
  );
};

export default ProductDetail;

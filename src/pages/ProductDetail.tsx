import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Minus, Plus, Truck, Shield, RefreshCw, Star, Leaf, AlertTriangle, FileText, Droplets } from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import ProductSlider from '@/components/products/ProductSlider';
import { Product } from '@/data/categories';
import {
  insecticideProducts,
  seedProducts,
  fertilizerProducts,
  herbicideProducts
} from '@/data/products';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { language: currentLanguage, setLanguage, t: globalT } = useLanguage();
  const t = globalT.productDetail;
  const { addToCart, buyNow } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

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



  const handleSliderAddToCart = (prod: Product) => {
    addToCart(prod, 1);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopHeader />
        <CategoryNav activeCategory="" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t.notFound}</h1>
            <Link to="/">
              <AgriButton>{t.goBack}</AgriButton>
            </Link>
          </div>
        </main>
        <Footer />
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
      <TopHeader />

      <CategoryNav activeCategory="" />

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
                  className={`flex-1 gap-2 font-bold transition-all duration-300 ${isAdded
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-agri-yellow text-agri-brown hover:bg-agri-yellow/90'
                    }`}
                  onClick={() => {
                    addToCart(product, quantity);
                    setIsAdded(true);
                    setTimeout(() => setIsAdded(false), 2000);
                  }}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isAdded
                    ? t.added
                    : t.addToCart
                  }
                </AgriButton>
                <AgriButton
                  variant="secondary"
                  size="xl"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold"
                  disabled={!product.inStock}
                  onClick={() => {
                    buyNow(product);
                    navigate('/checkout');
                  }}
                >
                  {t.buyNow}
                </AgriButton>
              </div>

              {/* USP Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-6">
                <div className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Truck className="w-6 h-6 text-primary" />
                  <span className="text-xs font-medium text-gray-600">{t.features.delivery}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                  <span className="text-xs font-medium text-gray-600">{t.features.genuine}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-primary" />
                  <span className="text-xs font-medium text-gray-600">{t.features.returns}</span>
                </div>
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
                  <p>{t.descriptionText}</p>
                  <ul className="mt-4 list-disc pl-5 space-y-2">
                    <li>{t.effectiveness}</li>
                    <li>{t.safeBeneficial}</li>
                    <li>{t.rapidAction}</li>
                    <li>{t.weatherResistant}</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium text-gray-900">{t.brand}</span>
                    <span className="text-gray-600">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium text-gray-900">{t.quantity}</span>
                    <span className="text-gray-600">{product.quantity}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium text-gray-900">{t.form}</span>
                    <span className="text-gray-600">
                      {product.quantity.includes('L') || product.quantity.includes('ml') ? t.liquid : t.powderGranules}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium text-gray-900">{t.targetCrops}</span>
                    <span className="text-gray-600 capitalize">{product.crops?.join(', ') || t.allCrops}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dosage" className="pt-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4">
                  <Droplets className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">{t.dosageTitle}</h3>
                    <p className="text-blue-800">
                      {t.dosageText}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="safety" className="pt-6">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">{t.safetyTitle}</h3>
                    <ul className="list-disc pl-5 space-y-1 text-red-800">
                      <li>{t.precautions.reach}</li>
                      <li>{t.precautions.gear}</li>
                      <li>{t.precautions.inhale}</li>
                      <li>{t.precautions.wash}</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-16 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <ProductSlider
              products={getRelatedProducts()}
              title={t.relatedProducts}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;

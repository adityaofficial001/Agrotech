import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Minus, Plus, Truck, Star,
  CheckCircle, AlertOctagon,
  ShieldCheck, Heart, Share2, Calculator, MapPin, ChevronRight
} from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';
import { Header } from '@/components/Header';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import ProductSlider from '@/components/products/ProductSlider';
import { Product, ProductVariant } from '@/data/categories';
import { allProductsArray } from '@/data/products';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  // @ts-ignore
  const { language: currentLanguage, t: globalT } = useLanguage();
  const t = globalT.productDetail;
  const navT = globalT.header; // Access header translations for Home link if needed, otherwise use hardcoded or add to productDetail

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [landSize, setLandSize] = useState<string>('');
  const [calculatedDosage, setCalculatedDosage] = useState<string | null>(null);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const actionSectionRef = useRef<HTMLDivElement>(null);

  // Initialize Product & Variants
  useEffect(() => {
    window.scrollTo(0, 0);
    const foundProduct = allProductsArray.find(p => p.id === productId);

    if (foundProduct) {
      // Mock Variants if not present
      let variants = foundProduct.variants;
      if (!variants || variants.length === 0) {
        variants = [
          {
            id: `${foundProduct.id}-v1`,
            size: foundProduct.quantity,
            price: foundProduct.price,
            originalPrice: foundProduct.originalPrice,
            inStock: foundProduct.inStock
          },
          // Mock larger pack for demo
          {
            id: `${foundProduct.id}-v2`,
            size: foundProduct.quantity.includes('L') ? '5L' : '5kg',
            price: foundProduct.price * 4.5, // Bulk discount
            originalPrice: (foundProduct.originalPrice || foundProduct.price * 1.2) * 5,
            inStock: true
          }
        ];
      }

      setProduct({ ...foundProduct, variants });
      setSelectedVariant(variants[0]);
    }
  }, [productId]);

  // Scroll Spy for Sticky Bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (actionSectionRef.current) {
      observer.observe(actionSectionRef.current);
    }

    return () => {
      if (actionSectionRef.current) {
        observer.unobserve(actionSectionRef.current);
      }
    };
  }, [product]);

  // Mock Delivery Estimation
  const checkDelivery = () => {
    if (pincode.length === 6) {
      const today = new Date();
      const delivery = new Date(today);
      delivery.setDate(today.getDate() + 3); // 3 days later
      setDeliveryDate(delivery.toLocaleDateString(currentLanguage === 'HI' ? 'hi-IN' : 'en-IN', {
        weekday: 'long', day: 'numeric', month: 'long'
      }));
    } else {
      toast.error(currentLanguage === 'HI' ? 'कृपया मान्य 6-अंकीय पिनकोड दर्ज करें' : 'Please enter a valid 6-digit pincode');
    }
  };

  // Dosage Calculation
  const calculateDosage = () => {
    if (!landSize || isNaN(Number(landSize))) return;
    const acres = Number(landSize);

    // 1. Use Specific Dosage Data if available
    if (product?.dosagePerAcre && product?.dosageUnit) {
      const totalNeeded = acres * product.dosagePerAcre;
      let result = '';

      // Unit Conversions for display
      if (product.dosageUnit === 'ml' && totalNeeded >= 1000) {
        // ml -> L
        result = `${(totalNeeded / 1000).toFixed(1).replace(/\.0$/, '')} ${currentLanguage === 'HI' ? 'लिटर' : 'Liters'}`;
      } else if (product.dosageUnit === 'g' && totalNeeded >= 1000) {
        // g -> kg
        result = `${(totalNeeded / 1000).toFixed(1).replace(/\.0$/, '')} ${currentLanguage === 'HI' ? 'किग्रा' : 'kg'}`;
      } else {
        // No conversion
        result = `${totalNeeded} ${product.dosageUnit}`;
      }

      setCalculatedDosage(result);
      return;
    }

    // 2. Fallback Logic (Estimation) based on product type
    const isLiquid = product?.quantity.toLowerCase().includes('l') || product?.quantity.toLowerCase().includes('ml');
    const dosagePerAcre = isLiquid ? 500 : 2; // Default: 500ml or 2kg
    const unit = isLiquid ? 'ml' : 'kg';

    const totalNeeded = acres * dosagePerAcre;
    let result = '';

    if (totalNeeded >= 1000 && isLiquid) {
      result = `${totalNeeded / 1000} ${currentLanguage === 'HI' ? 'लिटर' : 'Liters'} (Est.)`;
    } else {
      result = `${totalNeeded} ${unit} (Est.)`;
    }

    setCalculatedDosage(result);
  };

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      // Create a temporary product object with the selected variant's details
      const variantProduct = {
        ...product,
        price: selectedVariant.price,
        originalPrice: selectedVariant.originalPrice,
        quantity: selectedVariant.size,
        id: selectedVariant.id // Use variant ID for cart uniqueness
      };
      addToCart(variantProduct, quantity);
      toast.success(t.addedToCart);
    }
  };

  const shareProduct = () => {
    const text = `Check out ${product?.name} on Vardhman! ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (!product || !selectedVariant) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // Images logic
  const productImages = product.image ? [product.image, product.image, product.image] : [];

  const productName = currentLanguage === 'HI' && product.nameHi ? product.nameHi : product.name;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <div className="mt-20">
        <CategoryNav activeCategory="" />
      </div>

      <main className="flex-1 pb-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-primary transition-colors">{currentLanguage === 'HI' ? 'होम' : 'Home'}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="cursor-pointer">{product.category}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-foreground">{productName}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl p-6 lg:p-8 shadow-sm">

            {/* Left: Image Section */}
            <div className="space-y-6">
              <div className="aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden relative group">
                <img
                  src={productImages[selectedImage]}
                  alt={productName}
                  className="w-full h-full object-contain mix-blend-multiply p-8 group-hover:scale-110 transition-transform duration-500"
                />
                {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)}% {t.off}
                  </div>
                )}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-xl border-2 flex-shrink-0 p-2 bg-white ${idx === selectedImage ? 'border-primary' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <Link to="#" className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors">
                  {product.brand}
                </Link>
                <button onClick={shareProduct} className="text-gray-500 hover:text-green-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
                {productName}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                  <span className="font-bold text-green-700 mr-1">4.5</span>
                  <Star className="w-4 h-4 fill-green-700 text-green-700" />
                </div>
                <span className="text-sm text-gray-500 hover:underline cursor-pointer">128 {t.reviews}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-sm text-gray-500">1.2k {t.sold}</span>
              </div>

              {/* Price Section */}
              <div className="mb-8">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-gray-900">₹{selectedVariant.price}</span>
                  {selectedVariant.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">₹{selectedVariant.originalPrice}</span>
                  )}
                </div>
                <p className="text-green-600 text-sm font-semibold mt-1">
                  {t.inclusiveTaxes}
                </p>
              </div>

              {/* Size Selector */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">{t.selectPackSize}</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants?.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${selectedVariant.id === variant.id
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                        }`}
                    >
                      {variant.size}
                      <span className="block text-xs font-normal mt-1 opacity-80">
                        ₹{Math.round(variant.price / parseFloat(variant.size))}/{variant.size.replace(/[0-9.]/g, '')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dosage Calculator */}
              <div className="mb-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-blue-900 text-sm">{t.dosageCalculator}</span>
                  </div>
                </div>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-blue-700 font-medium mb-1 block">{t.landSize}</label>
                    <Input
                      type="number"
                      placeholder="e.g. 5"
                      value={landSize}
                      onChange={(e) => setLandSize(e.target.value)}
                      className="bg-white border-blue-200 h-9"
                    />
                  </div>
                  <AgriButton size="sm" onClick={calculateDosage} className="bg-blue-600 hover:bg-blue-700 text-white h-9">
                    {t.calculate}
                  </AgriButton>
                </div>
                {calculatedDosage && (
                  <p className="mt-3 text-sm font-medium text-blue-800 bg-blue-100 p-2 rounded-lg text-center">
                    {t.recommended}: {calculatedDosage}
                  </p>
                )}
              </div>

              {/* Delivery Checker */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {t.checkDelivery}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder={t.enterPincode}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      className="pr-10"
                    />
                    {pincode.length === 6 && (
                      <CheckCircle className="w-4 h-4 text-green-500 absolute right-3 top-3" />
                    )}
                  </div>
                  <button onClick={checkDelivery} className="text-primary font-bold text-sm px-4 hover:underline">
                    {t.check}
                  </button>
                </div>
                {deliveryDate && (
                  <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                    <Truck className="w-3 h-3" /> {t.estimatedDelivery} {deliveryDate}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div ref={actionSectionRef} className="flex flex-col gap-3 mt-auto">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                    {selectedVariant.inStock ? t.inStock : t.outOfStock}
                  </div>
                </div>

                <div className="flex gap-3">
                  <AgriButton variant="cart" size="xl" className="flex-1 text-base" onClick={handleAddToCart} disabled={!selectedVariant.inStock}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t.addToCart}
                  </AgriButton>
                  <AgriButton variant="hero" size="xl" className="flex-1 text-base text-white" onClick={() => { handleAddToCart(); navigate('/checkout'); }} disabled={!selectedVariant.inStock}>
                    {t.buyNow}
                  </AgriButton>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-4 gap-2 mt-8 py-6 border-t border-gray-100">
                <div className="flex flex-col items-center text-center gap-2">
                  <img src="https://cdn-icons-png.flaticon.com/512/2769/2769339.png" className="w-8 h-8 opacity-80" alt="Original" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{t.trust.original}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <img src="https://cdn-icons-png.flaticon.com/512/411/411763.png" className="w-8 h-8 opacity-80" alt="Shipping" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{t.trust.shipping}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <img src="https://cdn-icons-png.flaticon.com/512/1585/1585296.png" className="w-8 h-8 opacity-80" alt="Secure" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{t.trust.secure}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <img src="https://cdn-icons-png.flaticon.com/512/9183/9183492.png" className="w-8 h-8 opacity-80" alt="Support" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{t.trust.support}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Detailed Info Tabs */}
          <div className="mt-12 bg-white rounded-3xl p-6 lg:p-10 shadow-sm">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b border-gray-100 bg-transparent p-0 mb-8 overflow-x-auto">
                {['description', 'specifications', 'usage', 'safety'].map(tab => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-6 py-3 font-bold text-gray-400 capitalize"
                  >
                    {/* @ts-ignore */}
                    {t.tabs[tab]}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{t.aboutProduct} {productName}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || t.descriptionText}
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {product.benefits?.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  )) || (
                      <>
                        <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-gray-700">{t.effectiveness}</span></div>
                        <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-gray-700">{t.safeBeneficial}</span></div>
                        <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-gray-700">{t.weatherResistant}</span></div>
                      </>
                    )}
                </div>
              </TabsContent>

              <TabsContent value="specifications">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">{t.techSpecs}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">{t.brand}</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">{t.formulation}</span>
                      <span className="font-medium">{product.quantity.includes('L') || product.quantity.includes('ml') ? t.liquid : t.powderGranules}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">{t.cropType}</span>
                      <span className="font-medium">{product.crops?.join(', ') || t.allCrops}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">{t.targetCrops}</span>
                      <span className="font-medium">{product.pests?.join(', ') || 'Various'}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="usage">
                <h3 className="text-lg font-bold mb-4">{t.applicationGuide}</h3>
                <div className="flex items-center gap-4 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-xl mb-6">
                  <AlertOctagon className="w-6 h-6 text-orange-600" />
                  <div>
                    <h4 className="font-bold text-orange-800">{t.safetyTitle}</h4>
                    <p className="text-sm text-orange-700">{t.precautionsText}</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {[1, 2, 3].map(step => (
                    <li key={step} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">{step}</div>
                      <p className="text-gray-700 pt-1">{t.stepGuideText}</p>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="safety">
                <h3 className="text-lg font-bold mb-4">{t.safetyInfo}</h3>
                <p className="text-gray-600 mb-4">{t.safetyText}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['gloves', 'mask', 'boots', 'goggles'].map(item => (
                    <div key={item} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                      <ShieldCheck className="w-8 h-8 text-primary mb-2" />
                      {/* @ts-ignore */}
                      <span className="font-medium text-sm">{t.safetyItems[item]} {t.safetyItems.required}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <ProductSlider
              title={t.relatedProducts}
              products={
                allProductsArray
                  .filter(p => p.category === product.category && p.id !== product.id)
                  .slice(0, 8)
              }
            />
          </div>

        </div>
      </main>

      {/* Sticky Action Bar */}
      <AnimatePresence>
        {isStickyVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50 md:hidden"
          >
            <div className="flex gap-3 container mx-auto">
              <div className="flex-1">
                <h4 className="text-sm font-bold truncate">{productName}</h4>
                <span className="text-lg font-black text-primary">₹{selectedVariant.price}</span>
              </div>
              <AgriButton onClick={handleAddToCart} disabled={!selectedVariant.inStock} className="flex-1 bg-agri-yellow text-agri-brown font-bold">
                {t.addToCart}
              </AgriButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppFloat productName={productName} />
    </div>
  );
};

export default ProductDetail;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import { ProductModalProvider } from "./contexts/ProductModalContext";
import { FeedbackProvider } from "./contexts/FeedbackContext";
import { ProductVariantModal } from "./components/products/ProductVariantModal";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BulkOrders from "./pages/BulkOrders";
import GetApp from "./pages/GetApp";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";
import ScrollToTop from "./components/layout/ScrollToTop";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import CropDoctor from "./pages/CropDoctor";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <FeedbackProvider>
            <UserPreferencesProvider>
              <CartProvider>
                <WishlistProvider>
                  <ComparisonProvider>
                    <ProductModalProvider>
                      <Toaster />
                      <Sonner />
                      <ProductVariantModal />
                      <BrowserRouter>
                        <ScrollToTop />
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/category/:categoryId" element={<CategoryPage />} />
                          <Route path="/product/:productId" element={<ProductDetail />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route path="/bulk-orders" element={<BulkOrders />} />
                          <Route path="/get-app" element={<GetApp />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/order/:orderId" element={<OrderDetails />} />
                          <Route path="/compare" element={<Compare />} />
                          <Route path="/search" element={<SearchPage />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:id" element={<BlogPost />} />
                          <Route path="/faq" element={<FAQ />} />
                          <Route path="/privacy" element={<PrivacyPolicy />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/crop-doctor" element={<CropDoctor />} />
                          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </BrowserRouter>
                    </ProductModalProvider>
                  </ComparisonProvider>
                </WishlistProvider>
              </CartProvider>
            </UserPreferencesProvider>
          </FeedbackProvider>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

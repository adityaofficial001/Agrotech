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
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import BulkOrders from "./pages/BulkOrders";
import GetApp from "./pages/GetApp";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <ComparisonProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/category/:categoryId" element={<CategoryPage />} />
                    <Route path="/product/:productId" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/bulk-orders" element={<BulkOrders />} />
                    <Route path="/get-app" element={<GetApp />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/compare" element={<Compare />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </ComparisonProvider>
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

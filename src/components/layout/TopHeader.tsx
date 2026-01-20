import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Smartphone, User, Globe, Tractor, ShoppingCart } from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';
import { useCart } from '@/contexts/CartContext';
import CartSidebar from '@/components/cart/CartSidebar';

interface TopHeaderProps {
  onLanguageChange?: (lang: 'en' | 'hi') => void;
  currentLanguage?: 'en' | 'hi';
}

const TopHeader: React.FC<TopHeaderProps> = ({ 
  onLanguageChange, 
  currentLanguage = 'en' 
}) => {
  const { itemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const translations = {
    en: {
      search: "What are you looking for?",
      bulkOrders: "Bulk Orders Enquiries",
      getApp: "Get App",
      login: "Login",
    },
    hi: {
      search: "आप क्या खोज रहे हैं?",
      bulkOrders: "थोक ऑर्डर पूछताछ",
      getApp: "ऐप डाउनलोड करें",
      login: "लॉग इन",
    }
  };

  const t = translations[currentLanguage];

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Tractor className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-primary">
              AgriCare
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl order-last md:order-none w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Bulk Orders */}
            <Link
              to="/bulk-orders"
              className="hidden lg:flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>{t.bulkOrders}</span>
            </Link>

            {/* Get App */}
            <Link
              to="/get-app"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>{t.getApp}</span>
            </Link>

            {/* Cart */}
            <AgriButton 
              variant="ghost" 
              size="sm" 
              className="gap-2 relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-4 h-4" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {itemsCount > 99 ? '99+' : itemsCount}
                </span>
              )}
            </AgriButton>

            {/* Login */}
            <Link to="/login">
              <AgriButton variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t.login}</span>
              </AgriButton>
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <AgriButton
                variant="outline"
                size="sm"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="gap-1"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLanguage === 'en' ? 'EN' : 'हि'}</span>
              </AgriButton>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-agri-md z-50 overflow-hidden animate-fade-in">
                  <button
                    onClick={() => {
                      onLanguageChange?.('en');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${
                      currentLanguage === 'en' ? 'bg-muted font-medium' : ''
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange?.('hi');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${
                      currentLanguage === 'hi' ? 'bg-muted font-medium' : ''
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        currentLanguage={currentLanguage}
      />
    </header>
  );
};

export default TopHeader;

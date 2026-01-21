import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Smartphone, User, Globe, Tractor, ShoppingCart, History, ChevronDown } from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserPreferences, Order } from "@/contexts/UserPreferencesContext";
import { OrderTrackingModal } from "../user/OrderTrackingModal";

interface TopHeaderProps {
  onLanguageChange?: (lang: 'en' | 'hi') => void;
  currentLanguage?: 'en' | 'hi';
}

const TopHeader: React.FC<TopHeaderProps> = ({
  onLanguageChange: propsOnLanguageChange,
  currentLanguage: propsCurrentLanguage
}) => {
  const { language, setLanguage } = useLanguage();
  const currentLanguage = propsCurrentLanguage || (language === 'HI' ? 'hi' : 'en');

  const handleLanguageChange = (lang: 'en' | 'hi') => {
    setLanguage(lang === 'hi' ? 'HI' : 'EN');
    if (propsOnLanguageChange) {
      propsOnLanguageChange(lang);
    }
    toast.info(lang === 'en' ? 'Language switched to English' : 'भाषा हिंदी में बदल दी गई');
  };

  const { itemsCount } = useCart();
  const { orders } = useUserPreferences();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const translations = {
    en: {
      search: "What are you looking for?",
      bulkOrders: "Bulk Orders Enquiries",
      getApp: "Get App",
      login: "Login",
      orders: "Orders",
      myOrders: "My Orders",
      viewAllOrders: "View All Orders",
      orderStatus: {
        Pending: "Pending",
        Packed: "Packed",
        Shipped: "Shipped",
        Delivered: "Delivered"
      }
    },
    hi: {
      search: "आप क्या खोज रहे हैं?",
      bulkOrders: "थोक ऑर्डर पूछताछ",
      getApp: "ऐप डाउनलोड करें",
      login: "लॉग इन",
      orders: "ऑर्डर",
      myOrders: "मेरे ऑर्डर",
      viewAllOrders: "सभी ऑर्डर देखें",
      orderStatus: {
        Pending: "लंबित",
        Packed: "पैक किया गया",
        Shipped: "भेज दिया गया",
        Delivered: "डिलीवर किया गया"
      }
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
              Vartman
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

            {/* Orders Dropdown */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none">
                    <Package className="w-4 h-4" />
                    <span>{t.orders}</span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-primary/10">
                  <DropdownMenuLabel>{t.myOrders}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {orders.map(order => (
                    <DropdownMenuItem
                      key={order.id}
                      className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsTrackingOpen(true);
                      }}
                    >
                      <div className="flex justify-between w-full">
                        <span className="font-bold text-xs">{order.id}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                          {t.orderStatus[order.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                        <History className="w-3 h-3" />
                        {order.date}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-xs font-bold text-primary hover:underline cursor-pointer">
                    {t.viewAllOrders}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Get App */}
            <Link
              to="/get-app"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>{t.getApp}</span>
            </Link>

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
                      handleLanguageChange('en');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${currentLanguage === 'en' ? 'bg-muted font-medium' : ''
                      }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      handleLanguageChange('hi');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${currentLanguage === 'hi' ? 'bg-muted font-medium' : ''
                      }`}
                  >
                    हिंदी
                  </button>
                </div>
              )}
            </div>
            {/* Cart Icon */}
            <Link to="/checkout" className="relative group">
              <AgriButton variant="ghost" size="sm" className="gap-2">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {itemsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-destructive text-[10px]">
                      {itemsCount}
                    </Badge>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
              </AgriButton>
            </Link>
          </div>
        </div>
      </div>
      <OrderTrackingModal
        order={selectedOrder}
        open={isTrackingOpen}
        onOpenChange={setIsTrackingOpen}
      />
    </header>
  );
};

export default TopHeader;

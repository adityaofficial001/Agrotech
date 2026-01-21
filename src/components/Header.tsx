
import { Search, Tractor, User, Menu, Languages, ShoppingBag, Heart, Package, History, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WishlistDrawer } from "./user/WishlistDrawer";
import { CartDrawer } from "./user/CartDrawer";
import { OrderTrackingModal } from "./user/OrderTrackingModal";
import { useUserPreferences, Order } from "../contexts/UserPreferencesContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "./ui/badge";
import { useState, useEffect, useRef } from "react";
import { allProductsArray } from "@/data/products";
import { Product } from "@/data/categories";

export const Header = () => {
    const { language, setLanguage, t } = useLanguage();
    const { itemsCount } = useCart();
    const { wishlist, orders } = useUserPreferences();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Search State
    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Feature UI States
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);

    // Live Search Logic
    const filteredProducts = query.length > 1
        ? allProductsArray.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.brand.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
        : [];

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        setShowResults(false);
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'EN' ? 'HI' : 'EN';
        setLanguage(newLang);
        toast.info(newLang === 'EN' ? 'Language switched to English' : 'भाषा हिंदी में बदल दी गई');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
            {/* Top Bar - Quick Links */}
            <div className="bg-primary text-white py-1 px-4 text-xs">
                <div className="container mx-auto flex justify-between items-center">
                    <p className="hidden md:block">{t.header.welcome}</p>
                    <div className="flex items-center gap-4 ml-auto">
                        <a onClick={() => navigate('/bulk-orders')} className="hover:text-primary-light transition-colors cursor-pointer">{t.header.bulkOrders}</a>
                        <span className="w-[1px] h-3 bg-white/30" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <a className="flex items-center gap-1 hover:text-primary-light transition-colors cursor-pointer">
                                    <Package className="h-3 w-3" />
                                    <span>{t.header.orders}</span>
                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                </a>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-primary/10 text-foreground">
                                <DropdownMenuLabel>{t.header.myOrders}</DropdownMenuLabel>
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
                                                {t.header.orderStatus[order.status]}
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
                                    {t.header.viewAllOrders}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <span className="w-[1px] h-3 bg-white/30" />
                        <a href="#" className="flex items-center gap-1 hover:text-primary-light transition-colors">
                            <span>{t.header.getApp}</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-primary p-2 rounded-lg">
                            <Tractor className="h-6 w-6 text-white" />
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-bold text-primary leading-none">{t.header.title}</h1>
                            <p className="text-xs text-primary/80">{t.header.tagline}</p>
                        </div>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl relative" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} className="w-full relative">
                            <Input
                                placeholder={t.header.searchPlaceholder}
                                className="w-full pl-4 pr-10 border-primary/20 focus-visible:ring-primary bg-gray-50/50"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                            />
                            <Button type="submit" size="icon" className="absolute right-0 top-0 bg-primary hover:bg-primary-hover">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>

                        {/* Live Results Dropdown */}
                        {showResults && query.length > 1 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                                {filteredProducts.length > 0 ? (
                                    <>
                                        {filteredProducts.map(product => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                                                onClick={() => {
                                                    navigate(`/product/${product.id}`);
                                                    setShowResults(false);
                                                }}
                                            >
                                                <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                                    <img src={product.image} alt={product.name} className="w-8 h-8 object-contain" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.brand}</p>
                                                </div>
                                                <span className="text-sm font-bold text-primary">₹{product.priceMin}</span>
                                            </div>
                                        ))}
                                        <div
                                            className="p-3 text-center bg-gray-50 text-primary text-sm font-medium cursor-pointer hover:underline"
                                            onClick={() => handleSearchSubmit()}
                                        >
                                            View all results for "{query}"
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No products found for "{query}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Mobile Search Toggle */}
                        <Button variant="ghost" size="icon" className="md:hidden text-primary">
                            <Search className="h-5 w-5" />
                        </Button>

                        <Button
                            variant="outline"
                            className="hidden md:flex gap-2 text-primary border-primary/20 hover:bg-primary/5 min-w-[140px]"
                            onClick={toggleLanguage}
                        >
                            <Languages className="h-4 w-4" />
                            <span>{language === 'EN' ? 'हिंदी में पढ़ें' : 'Read in English'}</span>
                        </Button>

                        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5 hidden sm:flex" onClick={() => toast.info('Login clicked')}>
                            <User className="h-5 w-5" />
                            <span className="ml-2 text-sm font-medium hidden lg:inline">{t.header.login}</span>
                        </Button>


                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary hover:bg-primary/5 relative"
                            onClick={() => setIsWishlistOpen(true)}
                        >
                            <Heart className={`h-5 w-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                            {wishlist.length > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                                    {wishlist.length}
                                </Badge>
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary hover:bg-primary/5 relative"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {itemsCount > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-destructive text-[10px]">
                                    {itemsCount}
                                </Badge>
                            )}
                        </Button>

                        <Button variant="ghost" size="icon" className="md:hidden text-primary">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Feature Modals/Drawers */}
            <WishlistDrawer open={isWishlistOpen} onOpenChange={setIsWishlistOpen} />
            <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
            <OrderTrackingModal
                order={selectedOrder}
                open={isTrackingOpen}
                onOpenChange={setIsTrackingOpen}
            />
        </header>
    );
};

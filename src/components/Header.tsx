
import { Search, Tractor, User, Menu, Languages, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";

export const Header = () => {
    const { language, setLanguage, t } = useLanguage();
    const { itemsCount } = useCart();
    const navigate = useNavigate();

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
                    <div className="hidden md:flex flex-1 max-w-xl relative">
                        <Input
                            placeholder={t.header.searchPlaceholder}
                            className="w-full pl-4 pr-10 border-primary/20 focus-visible:ring-primary bg-gray-50/50"
                        />
                        <Button size="icon" className="absolute right-0 top-0 bg-primary hover:bg-primary-hover">
                            <Search className="h-4 w-4" />
                        </Button>
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
                            onClick={() => navigate('/checkout')}
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
        </header>
    );
};

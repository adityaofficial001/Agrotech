
import { Button } from "./ui/button";
import { ArrowRight, ShieldCheck, Truck, Headphones, Users } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const scrollToProducts = () => {
        const categoriesSection = document.getElementById('categories-section');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative h-[600px] md:h-[700px] w-full overflow-hidden mt-[108px]">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2671&auto=format&fit=crop")',
                }}
            />

            {/* Deep Green Gradient Overlay: Dark Green (Left) -> Transparent (Right) */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent/20" />



            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white z-10 pt-10 font-roboto">
                <div className="max-w-4xl animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-medium text-agri-yellow">{t.header.title}</span>
                        <span className="text-white/90 font-medium tracking-wide uppercase text-sm bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
                            {t.hero.badge}
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-[60px] font-bold mb-2 leading-tight font-roboto tracking-tight text-white drop-shadow-md">
                        {t.hero.title}
                    </h1>

                    <p className="text-3xl md:text-4xl text-agri-yellow font-bold mb-4 font-roboto opacity-100 drop-shadow-sm">
                        {t.hero.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-lg text-gray-100 mb-6 max-w-2xl font-medium leading-relaxed drop-shadow-sm">
                        {t.hero.description}
                    </p>

                    {/* Feature Badges */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg bg-white/10 backdrop-blur-md shadow-sm cursor-default hover:bg-white/20 transition-all">
                            <ShieldCheck className="h-5 w-5 text-agri-yellow" />
                            <span className="text-sm font-semibold text-white">{t.hero.features.genuine}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg bg-white/10 backdrop-blur-md shadow-sm cursor-default hover:bg-white/20 transition-all">
                            <Truck className="h-5 w-5 text-blue-200" />
                            <span className="text-sm font-semibold text-white">{t.hero.features.delivery}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg bg-white/10 backdrop-blur-md shadow-sm cursor-default hover:bg-white/20 transition-all">
                            <Headphones className="h-5 w-5 text-green-200" />
                            <span className="text-sm font-semibold text-white">{t.hero.features.support}</span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            onClick={scrollToProducts}
                            className="bg-agri-yellow hover:bg-yellow-400 text-agri-brown hover:text-black text-lg px-8 py-6 rounded-md font-bold border-2 border-transparent transition-all duration-300 shadow-lg shadow-black/20"
                        >
                            {t.hero.shopNow}
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate('/category/insecticides')}
                            className="bg-transparent text-white border-white hover:bg-white hover:text-primary text-lg px-8 py-6 rounded-md font-semibold backdrop-blur-sm transition-all duration-300"
                        >
                            {t.hero.viewAll}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Floating Trust Card - Bottom Right */}
            <div className="absolute bottom-8 right-4 md:right-10 bg-yellow-400 shadow-xl border-l-4 border-agri-yellow p-4 rounded-r-xl flex items-center gap-3 animate-float max-w-xs z-20">
                <div className="bg-green-100 p-2 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t.hero.trustedBy}</p>
                    <p className="text-lg font-bold text-gray-900 leading-none">{t.hero.farmersCount}</p>
                </div>
            </div>
        </div>
    );
};

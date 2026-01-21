
import { NAV_CATEGORIES } from "@/data/categories";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";

export const CategoryStrip = () => {
    const { t, language } = useLanguage();

    const navigate = useNavigate();
    const location = useLocation();

    const scrollToSection = (id: string) => {
        if (location.pathname === '/' || location.pathname === '/index.html') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            navigate(`/#${id}`);
        }
    };


    return (
        <div className="bg-primary/95 text-white py-3 sticky top-[108px] z-40 shadow-md overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                    {NAV_CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => scrollToSection(category.id)}
                            className="text-sm font-medium hover:text-secondary-light hover:bg-white/10 px-3 py-1 rounded-full transition-colors duration-200 flex items-center gap-2"
                        >
                            <category.icon size={14} />
                            {language === 'HI' ? category.name.hi : category.name.en}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

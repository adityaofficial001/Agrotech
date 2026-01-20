
import { CATEGORIES } from "@/data/categories";
import { useLanguage } from "@/contexts/LanguageContext";

export const CategoryStrip = () => {
    const { t } = useLanguage();

    const scrollToSection = (category: string) => {
        const element = document.getElementById(category.replace(/\s+/g, '-').toLowerCase());
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const getTranslatedCategory = (key: string) => {
        const map: Record<string, string> = {
            "Insecticides": t.categories.insecticides,
            "Seeds & Saplings": t.categories.seeds,
            "Implements": t.categories.implements,
            "Herbicides": t.categories.herbicides,
            "Fertilizers": t.categories.fertilizers,
            "Plant Growth Promoters": t.categories.growth,
            "Bioproducts": t.categories.bio,
            "Allied Products": t.categories.allied,
            "Crop Science": t.categories.cropScience,
        };
        return map[key] || key;
    };

    return (
        <div className="bg-primary/95 text-white py-3 sticky top-[108px] z-40 shadow-md overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => scrollToSection(category)}
                            className="text-sm font-medium hover:text-secondary-light hover:bg-white/10 px-3 py-1 rounded-full transition-colors duration-200"
                        >
                            {getTranslatedCategory(category)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

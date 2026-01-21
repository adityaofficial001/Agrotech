
import { useLanguage } from "@/contexts/LanguageContext";
import { Bug, Sprout, Tractor, Scissors, Beaker, Leaf, FlaskConical, Box, Microscope } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { useNavigate } from "react-router-dom";

export const CategoryShowcase = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const getIcon = (index: number) => {
        const icons = [
            Bug,          // Insecticides
            Sprout,       // Seeds
            Tractor,      // Implements
            Scissors,     // Herbicides
            Beaker,       // Fertilizers
            Leaf,         // Growth
            FlaskConical, // Bio
            Box,          // Allied
            Microscope    // Crop Science
        ];
        return icons[index] || Sprout;
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

    const handleCategoryClick = (category: string) => {
        // Convert category name to ID format (e.g. "Seeds & Saplings" -> "seeds")
        // This mapping must match the route logic in CategoryPage
        const idMap: Record<string, string> = {
            "Insecticides": "insecticides",
            "Seeds & Saplings": "seeds",
            "Implements": "implements",
            "Herbicides": "herbicides",
            "Fertilizers": "fertilizers",
            "Plant Growth Promoters": "growth",
            "Bioproducts": "bioproducts",
            "Allied Products": "allied",
            "Crop Science": "cropscience",
        };

        const categoryId = idMap[category] || category.toLowerCase().replace(/\s+/g, '-');
        navigate(`/category/${categoryId}`);
    };

    return (
        <div id="categories-section" className="container mx-auto px-4 -mt-16 relative z-20 mb-12">
            <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
                {CATEGORIES.map((category, index) => {
                    const Icon = getIcon(index);
                    return (
                        <div
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 group border border-gray-100 h-32 hover:-translate-y-1"
                        >
                            <div className="p-3 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-center text-gray-700 group-hover:text-primary leading-tight">
                                {getTranslatedCategory(category)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

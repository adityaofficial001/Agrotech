
export interface Product {
    id: string;
    name: string;
    nameHi?: string; // Hindi Name
    brand: string;
    price: number;
    originalPrice?: number;
    quantity: string;
    quantityHi?: string; // Hindi Quantity
    image: string;
    category: string;
    inStock: boolean;
}

export const CATEGORIES = [
    "Insecticides",
    "Seeds & Saplings",
    "Implements",
    "Herbicides",
    "Fertilizers",
    "Plant Growth Promoters",
    "Bioproducts",
    "Allied Products",
    "Crop Science"
];

const generateProducts = () => {
    const products: Product[] = [];
    let idCounter = 1;

    // Insecticides
    products.push(
        { id: String(idCounter++), name: "Coragen Insecticide", nameHi: "कोराजेन कीटनाशक", brand: "AgroCare", price: 450, originalPrice: 500, quantity: "60ml", quantityHi: "60 मिली", image: "/placeholder.svg", category: "Insecticides", inStock: true },
        { id: String(idCounter++), name: "Ampligo Chlorantraniliprole", nameHi: "एम्प्लिगो क्लोरेंट्रानिलिप्रोल", brand: "Syngenta", price: 780, originalPrice: 900, quantity: "80ml", quantityHi: "80 मिली", image: "/placeholder.svg", category: "Insecticides", inStock: true },
        { id: String(idCounter++), name: "Virtako Insecticide", nameHi: "विर्टाको कीटनाशक", brand: "Syngenta", price: 1200, quantity: "1kg", quantityHi: "1 किग्रा", image: "/placeholder.svg", category: "Insecticides", inStock: true },
        { id: String(idCounter++), name: "Benevia Insecticide", nameHi: "बेनेविया कीटनाशक", brand: "FMC", price: 1500, quantity: "180ml", quantityHi: "180 मिली", image: "/placeholder.svg", category: "Insecticides", inStock: false }
    );

    // Seeds & Saplings
    products.push(
        { id: String(idCounter++), name: "Hybrid Tomato Seeds", nameHi: "हाइब्रिड टमाटर बीज", brand: "Seminis", price: 850, originalPrice: 1000, quantity: "10g", quantityHi: "10 ग्राम", image: "/placeholder.svg", category: "Seeds & Saplings", inStock: true },
        { id: String(idCounter++), name: "Okra Seeds (Bhindi)", nameHi: "भिंडी बीज", brand: "Advanta", price: 400, quantity: "100g", quantityHi: "100 ग्राम", image: "/placeholder.svg", category: "Seeds & Saplings", inStock: true },
        { id: String(idCounter++), name: "Chilli Seeds Hot Pepper", nameHi: "मिर्ची बीज", brand: "Nunhems", price: 650, quantity: "10g", quantityHi: "10 ग्राम", image: "/placeholder.svg", category: "Seeds & Saplings", inStock: true },
        { id: String(idCounter++), name: "Cotton Logic Seeds", nameHi: "कपास बीज", brand: "Rasi", price: 1200, quantity: "450g", quantityHi: "450 ग्राम", image: "/placeholder.svg", category: "Seeds & Saplings", inStock: true }
    );

    // Implements
    products.push(
        { id: String(idCounter++), name: "Knapsack Hand Sprayer", nameHi: "नैपसैक हैंड स्प्रेयर", brand: "AgroTools", price: 1200, quantity: "16L", quantityHi: "16 लीटर", image: "/placeholder.svg", category: "Implements", inStock: true },
        { id: String(idCounter++), name: "Garden Hedge Shear", nameHi: "गार्डन कटर", brand: "Falcon", price: 450, quantity: "1 Unit", quantityHi: "1 इकाई", image: "/placeholder.svg", category: "Implements", inStock: true },
        { id: String(idCounter++), name: "Sickle with Wooden Handle", nameHi: "लकड़ी के हैंडल वाली दरांती", brand: "Local", price: 150, quantity: "1 Unit", quantityHi: "1 इकाई", image: "/placeholder.svg", category: "Implements", inStock: true },
        { id: String(idCounter++), name: "Brush Cutter", nameHi: "ब्रश कटर", brand: "Honda", price: 18000, quantity: "1 Unit", quantityHi: "1 इकाई", image: "/placeholder.svg", category: "Implements", inStock: false }
    );

    // Herbicides
    products.push(
        { id: String(idCounter++), name: "Roundup Glyphosate", nameHi: "राउंडअप ग्लाइफोसेट", brand: "Bayer", price: 350, quantity: "1L", quantityHi: "1 लीटर", image: "/placeholder.svg", category: "Herbicides", inStock: true },
        { id: String(idCounter++), name: "Sencor Herbicide", nameHi: "सेंकोर शाकनाशी", brand: "Bayer", price: 550, quantity: "100g", quantityHi: "100 ग्राम", image: "/placeholder.svg", category: "Herbicides", inStock: true },
        { id: String(idCounter++), name: "Goal Oxyfluorfen", nameHi: "गोल ऑक्सीफ्लोरफेन", brand: "Indofil", price: 400, quantity: "250ml", quantityHi: "250 मिली", image: "/placeholder.svg", category: "Herbicides", inStock: true },
        { id: String(idCounter++), name: "Targa Super", nameHi: "टार्गा सुपर", brand: "Dhanuka", price: 600, quantity: "500ml", quantityHi: "500 मिली", image: "/placeholder.svg", category: "Herbicides", inStock: true }
    );

    // Fertilizers
    products.push(
        { id: String(idCounter++), name: "Neem Coated Urea", nameHi: "नीम लेपित यूरिया", brand: "IFFCO", price: 300, quantity: "45kg", quantityHi: "45 किग्रा", image: "/placeholder.svg", category: "Fertilizers", inStock: true },
        { id: String(idCounter++), name: "DAP Fertilizer", nameHi: "डीएपी उर्वरक", brand: "IPL", price: 1350, quantity: "50kg", quantityHi: "50 किग्रा", image: "/placeholder.svg", category: "Fertilizers", inStock: true },
        { id: String(idCounter++), name: "19-19-19 NPK Solution", nameHi: "19-19-19 एनपीके", brand: "Mahadhan", price: 120, quantity: "1kg", quantityHi: "1 किग्रा", image: "/placeholder.svg", category: "Fertilizers", inStock: true },
        { id: String(idCounter++), name: "Muriate of Potash", nameHi: "म्यूरेट ऑफ पोटाश", brand: "IPL", price: 900, quantity: "50kg", quantityHi: "50 किग्रा", image: "/placeholder.svg", category: "Fertilizers", inStock: true }
    );

    // Plant Growth Promoters
    products.push(
        { id: String(idCounter++), name: "Isabion Growth Promoter", nameHi: "इसाबियन ग्रोथ प्रमोटर", brand: "Syngenta", price: 550, quantity: "500ml", quantityHi: "500 मिली", image: "/placeholder.svg", category: "Plant Growth Promoters", inStock: true },
        { id: String(idCounter++), name: "Planofix Alpha Naphthyl", nameHi: "प्लानोफिक्स", brand: "Bayer", price: 120, quantity: "100ml", quantityHi: "100 मिली", image: "/placeholder.svg", category: "Plant Growth Promoters", inStock: true },
        { id: String(idCounter++), name: "Lihocin Growth Retardant", nameHi: "लिहोसिन", brand: "BASF", price: 350, quantity: "500ml", quantityHi: "500 मिली", image: "/placeholder.svg", category: "Plant Growth Promoters", inStock: true },
        { id: String(idCounter++), name: "Quantis Biostimulant", nameHi: "क्वांटिस बायोस्टिमुलेंट", brand: "Syngenta", price: 700, quantity: "1L", quantityHi: "1 लीटर", image: "/placeholder.svg", category: "Plant Growth Promoters", inStock: true }
    );

    // Bioproducts
    products.push(
        { id: String(idCounter++), name: "Neem Oil 10000ppm", nameHi: "नीम तेल 10000ppm", brand: "Multiplex", price: 250, quantity: "1L", quantityHi: "1 लीटर", image: "/placeholder.svg", category: "Bioproducts", inStock: true },
        { id: String(idCounter++), name: "Trichoderma Viride", nameHi: "ट्राइकोडर्मा विरिडे", brand: "T-Stanes", price: 180, quantity: "1kg", quantityHi: "1 किग्रा", image: "/placeholder.svg", category: "Bioproducts", inStock: true },
        { id: String(idCounter++), name: "Pheromone Traps", nameHi: "फेरोमोन ट्रैप", brand: "Barrix", price: 300, quantity: "5 Pack", quantityHi: "5 पैक", image: "/placeholder.svg", category: "Bioproducts", inStock: true },
        { id: String(idCounter++), name: "VAM Biofertilizer", nameHi: "VAM बायोफर्टिलाइजर", brand: "IPL", price: 200, quantity: "1kg", quantityHi: "1 किग्रा", image: "/placeholder.svg", category: "Bioproducts", inStock: true }
    );

    // Allied Products
    products.push(
        { id: String(idCounter++), name: "Tarpaulin 120 GSM", nameHi: "तिरपाल 120 जीएसएम", brand: "Silpaulin", price: 1500, quantity: "12x12", quantityHi: "12x12", image: "/placeholder.svg", category: "Allied Products", inStock: true },
        { id: String(idCounter++), name: "Mulching Sheet Silver", nameHi: "मल्चिंग शीट सिल्वर", brand: "GrowIt", price: 2200, quantity: "400m", quantityHi: "400 मीटर", image: "/placeholder.svg", category: "Allied Products", inStock: true },
        { id: String(idCounter++), name: "Coco Peat Block", nameHi: "कोको पीट ब्लॉक", brand: "CoirFit", price: 220, quantity: "5kg", quantityHi: "5 किग्रा", image: "/placeholder.svg", category: "Allied Products", inStock: true },
        { id: String(idCounter++), name: "Seedling Tray", nameHi: "सीडलिंग ट्रे", brand: "AgroPlast", price: 35, quantity: "98 Cavity", quantityHi: "98 कैविटी", image: "/placeholder.svg", category: "Allied Products", inStock: true }
    );

    // Crop Science (General / Extra)
    products.push(
        { id: String(idCounter++), name: "Sticky Trap Blue", nameHi: "ब्लू स्टिकी ट्रैप", brand: "Tap", price: 150, quantity: "10 Sheets", quantityHi: "10 शीट्स", image: "/placeholder.svg", category: "Crop Science", inStock: true },
        { id: String(idCounter++), name: "Sticky Trap Yellow", nameHi: "येलो स्टिकी ट्रैप", brand: "Tap", price: 150, quantity: "10 Sheets", quantityHi: "10 शीट्स", image: "/placeholder.svg", category: "Crop Science", inStock: true },
        { id: String(idCounter++), name: "Soil pH Testing Kit", nameHi: "मिट्टी पीएच किट", brand: "AgroLab", price: 450, quantity: "1 Kit", quantityHi: "1 किट", image: "/placeholder.svg", category: "Crop Science", inStock: true },
        { id: String(idCounter++), name: "Microscope for Leaf", nameHi: "माइक्रोस्कोप", brand: "LabTech", price: 1200, quantity: "1 Unit", quantityHi: "1 इकाई", image: "/placeholder.svg", category: "Crop Science", inStock: false }
    );

    return products;
}

export const MOCK_PRODUCTS: Product[] = generateProducts();

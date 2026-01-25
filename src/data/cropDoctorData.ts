
export interface Solution { // Exported for type usage
    productId: string;
    type: string; // e.g., Insecticide, Fungicide
    explanation: string; // Short explanation
    dosage: string;
    method: string;
    timing: string;
    safety: string[];
}

export interface Issue { // Exported for type usage
    id: string;
    cause: string; // The "Diagnosis"
    causeHi: string;
    symptoms: string[]; // List of symptom IDs that trigger this
    solution: Solution;
    solutionHi?: {
        type: string;
        explanation: string;
        dosage: string;
        method: string;
        timing: string;
        safety: string[];
    };
}

export interface CropData { // Exported for type usage
    id: string; // e.g., 'rice', 'wheat'
    name: string;
    nameHi: string;
    stages: string[]; // IDs of stages
}

export const CROPS: CropData[] = [
    { id: 'rice', name: 'Rice', nameHi: 'धान (Rice)', stages: ['seedling', 'vegetative', 'flowering', 'harvest'] },
    { id: 'wheat', name: 'Wheat', nameHi: 'गेहूँ (Wheat)', stages: ['seedling', 'vegetative', 'flowering', 'harvest'] },
    { id: 'cotton', name: 'Cotton', nameHi: 'कपास (Cotton)', stages: ['seedling', 'vegetative', 'flowering', 'boll_formation'] },
    { id: 'tomato', name: 'Tomato', nameHi: 'टमाटर (Tomato)', stages: ['seedling', 'vegetative', 'flowering', 'fruiting'] },
    { id: 'maize', name: 'Maize', nameHi: 'मक्का (Maize)', stages: ['seedling', 'vegetative', 'flowering', 'harvest'] },
];

export const SYMPTOMS = [
    { id: 'yellowing', label: 'Yellowing Leaves', labelHi: 'पत्तियां पीली पड़ना' },
    { id: 'spots', label: 'Leaf Spots', labelHi: 'पत्तियों पर धब्बे' },
    { id: 'wilting', label: 'Wilting / Drooping', labelHi: 'मुरझाना' },
    { id: 'pests', label: 'Visible Pests', labelHi: 'कीड़े दिखाई देना' },
    { id: 'stunted', label: 'Stunted Growth', labelHi: 'रुका हुआ विकास' },
    { id: 'holes', label: 'Holes in Leaves', labelHi: 'पत्तियों में छेद' },
    { id: 'rot', label: 'Root/Stem Rot', labelHi: 'जड़/तना सड़ना' },
];

// Map: Crop -> Stage -> List of potential Issues
// Simple logic: If user selects Crop=Rice, Stage=Vegetative, Symptom=Yellowing -> Match Issue
export const CROP_ISSUES: Record<string, Record<string, Issue[]>> = {
    rice: {
        vegetative: [
            {
                id: 'rice-yellow-stem-borer',
                cause: 'Yellow Stem Borer',
                causeHi: 'पीला तना छेदक (Yellow Stem Borer)',
                symptoms: ['yellowing', 'holes', 'wilting'],
                solution: {
                    productId: 'ins-005', // Crop Defender Systemic
                    type: 'Systemic Insecticide',
                    explanation: 'Penetrates plant tissues to kill borers inside the stem.',
                    dosage: '10kg per acre',
                    method: 'Broadcast in field',
                    timing: 'Morning',
                    safety: ['Wear gloves', 'Do not enter field for 24h']
                },
                solutionHi: {
                    type: 'सिस्टमिक कीटनाशक',
                    explanation: 'तने के अंदर छेदक को मारने के लिए पौधे के ऊतकों में प्रवेश करता है।',
                    dosage: '10 किग्रा प्रति एकड़',
                    method: 'खेत में छिड़काव करें',
                    timing: 'सुबह',
                    safety: ['दस्ताने पहनें', '24 घंटे तक खेत में न जाएं']
                }
            },
            {
                id: 'rice-blast',
                cause: 'Rice Blast (Fungal)',
                causeHi: 'धान का ब्लास्ट रोग (फफूंद)',
                symptoms: ['spots', 'rot'],
                solution: {
                    productId: 'ins-001', // Example Fungicide (using insecticide ID for demo)
                    type: 'Fungicide',
                    explanation: 'Controls fungal spread by inhibiting spore germination.',
                    dosage: '200ml per acre',
                    method: 'Foliar Spray',
                    timing: 'Evening',
                    safety: ['Wear mask', 'Keep away from water bodies']
                },
                solutionHi: {
                    type: 'फफूंदनाशक',
                    explanation: 'बीजाणु अंकुरण को रोककर कवक के प्रसार को नियंत्रित करता है।',
                    dosage: '200 मिली प्रति एकड़',
                    method: 'पत्तियों पर छिड़काव',
                    timing: 'शाम',
                    safety: ['मास्क पहनें', 'जल स्रोतों से दूर रखें']
                }
            }
        ],
        seedling: [
            {
                id: 'rice-nutrient',
                cause: 'Zinc Deficiency',
                causeHi: 'जिंक की कमी',
                symptoms: ['yellowing', 'stunted'],
                solution: {
                    productId: 'fer-001', // Check ID later, using placeholder
                    type: 'Micronutrient Fertilizer',
                    explanation: 'Supplies essential Zinc for enzyme production.',
                    dosage: '5kg per acre',
                    method: 'Soil application',
                    timing: 'Pre-flooding',
                    safety: ['Wash hands']
                },
                solutionHi: {
                    type: 'सूक्ष्म पोषक तत्व उर्वरक',
                    explanation: 'एंजाइम उत्पादन के लिए आवश्यक जिंक प्रदान करता है।',
                    dosage: '5 किग्रा प्रति एकड़',
                    method: 'मिट्टी आवेदन',
                    timing: 'बाढ़ से पहले',
                    safety: ['हाथ धोएं']
                }
            }
        ]
    },
    wheat: {
        vegetative: [
            {
                id: 'wheat-rust',
                cause: 'Yellow Rust',
                causeHi: 'पीला रतुआ',
                symptoms: ['yellowing', 'spots'],
                solution: {
                    productId: 'ins-001',
                    type: 'Fungicide',
                    explanation: 'Systemic action against rust spores.',
                    dosage: '1g per liter water',
                    method: 'Spray',
                    timing: 'Clear day',
                    safety: ['Wear mask']
                },
                solutionHi: {
                    type: 'फफूंदनाशक',
                    explanation: 'रतुआ बीजाणुओं के खिलाफ प्रणालीगत कार्रवाई।',
                    dosage: '1 ग्राम प्रति लीटर पानी',
                    method: 'सप्रे',
                    timing: 'साफ दिन',
                    safety: ['मास्क पहनें']
                }
            }
        ]
    },
    cotton: {
        vegetative: [
            {
                id: 'cotton-aphids',
                cause: 'Aphid Attack',
                causeHi: 'एफिड (माहू) हमला',
                symptoms: ['curling', 'yellowing', 'pests'], // 'curling' not in basic list, mapping 'yellowing' for now
                solution: {
                    productId: 'ins-001',
                    type: 'Insecticide',
                    explanation: 'Controls sucking pests like aphids.',
                    dosage: '2ml per liter',
                    method: 'Spray underside of leaves',
                    timing: 'Evening',
                    safety: ['Avoid contact with skin']
                },
                solutionHi: {
                    type: 'कीटनाशक',
                    explanation: 'एफिड्स जैसे चूसने वाले कीटों को नियंत्रित करता है।',
                    dosage: '2 मिली प्रति लीटर',
                    method: 'पत्तियों के नीचे स्प्रे करें',
                    timing: 'शाम',
                    safety: ['त्वचा के संपर्क से बचें']
                }
            }
        ],
        boll_formation: [
            {
                id: 'cotton-bollworm',
                cause: 'Pink Bollworm',
                causeHi: 'गुलाबी सुंडी',
                symptoms: ['holes', 'pests'],
                solution: {
                    productId: 'ins-005',
                    type: 'Pesticide',
                    explanation: 'Knockdown action against bollworms.',
                    dosage: 'Spray immediately',
                    method: 'Foliar spray',
                    timing: 'Evening',
                    safety: ['Highly Toxic - Use full gear']
                },
                solutionHi: {
                    type: 'कीटनाशक',
                    explanation: 'बॉलवर्म के खिलाफ तुरंत कार्रवाई।',
                    dosage: 'तुरंत स्प्रे करें',
                    method: 'पर्णीय स्प्रे',
                    timing: 'शाम',
                    safety: ['अत्यधिक विषाक्त - पूर्ण गियर का उपयोग करें']
                }
            }
        ]
    },
    tomato: {
        fruiting: [
            {
                id: 'tomato-borer',
                cause: 'Fruit Borer',
                causeHi: 'फल छेदक',
                symptoms: ['holes', 'rot'],
                solution: {
                    productId: 'ins-002',
                    type: 'Bio-Insecticide',
                    explanation: 'Safe for edible fruits, controls larvae.',
                    dosage: '1.5ml per liter',
                    method: 'Spray on fruits',
                    timing: 'Evening',
                    safety: ['Wash fruits before harvest']
                },
                solutionHi: {
                    type: 'जैव-कीटनाशक',
                    explanation: 'खाने योग्य फलों के लिए सुरक्षित, लार्वा को नियंत्रित करता है।',
                    dosage: '1.5 मिली प्रति लीटर',
                    method: 'फलों पर स्प्रे करें',
                    timing: 'शाम',
                    safety: ['कटाई से पहले फल धो लें']
                }
            }
        ]
    }
};

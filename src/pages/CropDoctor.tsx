
import React, { useState, useEffect } from 'react';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { CROPS, SYMPTOMS, CROP_ISSUES } from '@/data/cropDoctorData';
import { getAllProducts } from '@/data/products';
import { AgriButton } from '@/components/ui/AgriButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Activity, Droplets, CloudRain, Wind, AlertCircle, Sun, CheckCircle2, RotateCcw, FlaskConical, Clock } from 'lucide-react';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import ProductSlider from '@/components/products/ProductSlider';
import { toast } from 'sonner';
import { FeedbackButtons } from '@/components/feedback/FeedbackButtons';

const CropDoctor = () => {
    const { language, t: globalT } = useLanguage();
    const t = globalT.cropDoctor;
    const currentLangCode = language === 'HI' ? 'hi' : 'en';

    const [selectedCrop, setSelectedCrop] = useState<string>('');
    const [selectedStage, setSelectedStage] = useState<string>('');
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

    // Reset stage and result when crop changes
    const handleCropChange = (val: string) => {
        setSelectedCrop(val);
        setSelectedStage('');
        setResult(null);
        setRecommendedProducts([]);
    };

    const handleSymptomToggle = (symptomId: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptomId)
                ? prev.filter(id => id !== symptomId)
                : [...prev, symptomId]
        );
    };

    const handleAnalyze = () => {
        if (!selectedCrop || !selectedStage || selectedSymptoms.length === 0) {
            toast.error(language === 'HI' ? 'कृपया सभी फ़ील्ड चुनें' : 'Please select all fields');
            return;
        }

        setLoading(true);
        // Simulate AI delay
        setTimeout(() => {
            const cropData = CROP_ISSUES[selectedCrop];
            if (cropData && cropData[selectedStage]) {
                // Find issue that matches at least one symptom
                const issues = cropData[selectedStage];
                const match = issues.find(issue =>
                    issue.symptoms.some(s => selectedSymptoms.includes(s))
                );

                if (match) {
                    setResult(match);

                    // Find full product details
                    const allProds = getAllProducts();
                    // Flatten categories
                    const flatProds = [
                        ...allProds.insecticides, ...allProds.seeds, ...allProds.fertilizers,
                        ...allProds.herbicides, ...allProds.implements, ...allProds.growth,
                        ...allProds.bioproducts, ...allProds.allied, ...allProds.cropscience
                    ];
                    const prod = flatProds.find(p => p.id === match.solution.productId);
                    setRecommendedProducts(prod ? [prod] : []);
                } else {
                    setResult('NO_MATCH');
                    setRecommendedProducts([]);
                }
            } else {
                setResult('NO_MATCH');
                setRecommendedProducts([]);
            }
            setLoading(false);
        }, 1500);
    };

    const handleReset = () => {
        setSelectedCrop('');
        setSelectedStage('');
        setSelectedSymptoms([]);
        setResult(null);
        setRecommendedProducts([]);
    };

    const getCropStages = () => {
        const crop = CROPS.find(c => c.id === selectedCrop);
        return crop ? crop.stages : [];
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <TopHeader />
            <CategoryNav currentLanguage={currentLangCode} activeCategory="" onCategoryChange={() => { }} />

            <main className="container mx-auto px-4 py-8 max-w-5xl">

                {/* Header */}
                <div className="text-center mb-12 animate-in slide-in-from-top duration-500">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
                        <Activity className="w-8 h-8 text-green-700" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display font-black text-gray-900 mb-2">{t.title}</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-12 gap-8">

                    {/* Input Section */}
                    <div className="md:col-span-5 space-y-6">
                        <Card className="p-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm sticky top-24">
                            {/* Step 1: Crop & Stage */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</span>
                                    <h3 className="font-bold text-gray-800">{t.step1}</h3>
                                </div>

                                <div className="space-y-2">
                                    <Label>{t.selectCrop}</Label>
                                    <Select value={selectedCrop} onValueChange={handleCropChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t.selectCrop} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CROPS.map(crop => (
                                                <SelectItem key={crop.id} value={crop.id}>
                                                    {language === 'HI' ? crop.nameHi : crop.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>{t.selectStage}</Label>
                                    <Select value={selectedStage} onValueChange={setSelectedStage} disabled={!selectedCrop}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t.selectStage} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getCropStages().map(stage => (
                                                <SelectItem key={stage} value={stage}>
                                                    {/* @ts-ignore dynamic key access */}
                                                    {t.stages[stage]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Step 2: Symptoms */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</span>
                                    <h3 className="font-bold text-gray-800">{t.step2}</h3>
                                </div>

                                <div className="space-y-3">
                                    <Label>{t.selectSymptoms}</Label>
                                    <div className="grid grid-cols-1 gap-2 border rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto">
                                        {SYMPTOMS.map(symptom => (
                                            <div key={symptom.id} className="flex items-center space-x-2 p-2 hover:bg-white rounded transition-colors">
                                                <Checkbox
                                                    id={symptom.id}
                                                    checked={selectedSymptoms.includes(symptom.id)}
                                                    onCheckedChange={() => handleSymptomToggle(symptom.id)}
                                                />
                                                <label
                                                    htmlFor={symptom.id}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                                                >
                                                    {language === 'HI' ? symptom.labelHi : symptom.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <AgriButton size="xl" className="flex-1" onClick={handleAnalyze} disabled={loading}>
                                    {loading ? (
                                        <span className="animate-spin mr-2">⟳</span>
                                    ) : (
                                        <Activity className="w-5 h-5 mr-2" />
                                    )}
                                    {t.analyze}
                                </AgriButton>
                                <AgriButton variant="outline" size="xl" onClick={handleReset}>
                                    <RotateCcw className="w-5 h-5" />
                                </AgriButton>
                            </div>
                        </Card>
                    </div>

                    {/* Result Section */}
                    <div className="md:col-span-7">
                        {result && result !== 'NO_MATCH' ? (
                            <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                {/* Diagnosis Card */}
                                <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl">
                                    <div className="bg-primary/10 p-4 border-b border-primary/10 flex items-center justify-between">
                                        <h3 className="font-bold text-xl text-primary flex items-center gap-2">
                                            <CheckCircle2 className="w-6 h-6" />
                                            {t.resultTitle}
                                        </h3>
                                        <span className="bg-white text-xs font-bold px-3 py-1 rounded-full text-gray-500 shadow-sm border">AI Advisory</span>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* 1. Detected Issue */}
                                        <div>
                                            <h4 className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">{t.detectedIssue}</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-black text-gray-800 leading-tight">
                                                        {language === 'HI' ? result.causeHi : result.cause}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* 2. Recommended Treatment */}
                                        <div>
                                            <h4 className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-3">{t.treatment}</h4>
                                            <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-start gap-4">
                                                <div className="bg-green-100 p-2 rounded-lg shrink-0">
                                                    <FlaskConical className="w-6 h-6 text-green-700" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg text-green-900">
                                                        {language === 'HI' && result.solutionHi?.type ? result.solutionHi.type : result.solution.type}
                                                    </p>
                                                    <p className="text-green-800 text-sm mt-1 leading-relaxed">
                                                        {/* @ts-ignore */}
                                                        {t.explanation}: {language === 'HI' && result.solutionHi?.explanation ? result.solutionHi.explanation : result.solution.explanation}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. Dosage & Timing Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <h4 className="text-xs text-gray-500 font-bold uppercase mb-1 flex items-center gap-1">
                                                    <Droplets className="w-3 h-3" /> {t.dosage}
                                                </h4>
                                                <p className="font-bold text-gray-900 text-lg">
                                                    {language === 'HI' && result.solutionHi ? result.solutionHi.dosage : result.solution.dosage}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{t.method}: {language === 'HI' && result.solutionHi ? result.solutionHi.method : result.solution.method}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <h4 className="text-xs text-gray-500 font-bold uppercase mb-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {t.timing}
                                                </h4>
                                                <p className="font-bold text-gray-900 text-lg">
                                                    {language === 'HI' && result.solutionHi ? result.solutionHi.timing : result.solution.timing}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                            <h4 className="text-xs text-yellow-700 font-bold uppercase mb-2 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {t.safetyPrecautions}
                                            </h4>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {(language === 'HI' && result.solutionHi ? result.solutionHi.safety : result.solution.safety).map((safe: string, i: number) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0"></div>
                                                        {safe}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <Separator />

                                        {/* Feedback Section */}
                                        <FeedbackButtons
                                            targetId={result.id} // Ensure result has an ID
                                            targetType="recommendation"
                                            contextData={{
                                                crop: selectedCrop,
                                                stage: selectedStage,
                                                symptoms: selectedSymptoms
                                            }}
                                        />

                                    </div>
                                </Card>

                                {/* Recommended Products */}
                                {recommendedProducts.length > 0 && (
                                    <div className="animate-in slide-in-from-bottom duration-700 delay-200">
                                        <ProductSlider
                                            title={t.recProducts}
                                            products={recommendedProducts}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : result === 'NO_MATCH' ? (
                            <div className="p-8 bg-gray-100 rounded-3xl text-center border-2 border-dashed border-gray-200 animate-in fade-in">
                                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-700 mb-2">{t.noIssue}</h3>
                                <p className="text-gray-500 mb-6">{t.disclaimer}</p>
                                <WhatsAppFloat advisoryContext={`Unknown issue for ${selectedCrop}`} />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                                <div>
                                    <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg font-medium">{t.step1} & {t.step2}</p>
                                    <p className="text-sm">{t.step3}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Global Warning */}
                <p className="text-center text-xs text-gray-400 mt-12 max-w-2xl mx-auto">
                    {t.disclaimer}
                </p>

                {/* Floating WhatsApp Button for Advisory Context */}
                <WhatsAppFloat
                    advisoryContext={result && typeof result !== 'string' ? `${selectedCrop} - ${language === 'HI' ? result.causeHi : result.cause}` : 'General Crop Inquiry'}
                />

            </main>
            <Footer />
        </div>
    );
};

export default CropDoctor;

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const About = () => {
    const { t, language } = useLanguage();
    const currentLanguage = language === 'HI' ? 'hi' : 'en';

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TopHeader />
            <CategoryNav activeCategory="" onCategoryChange={() => { }} />

            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Breadcrumbs items={[{ label: t.about.title }]} />

                    <div
                        className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-sm mt-6 relative overflow-hidden"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url('/about-bg.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        <h1 className="text-4xl font-display font-bold text-foreground mb-8 text-center">{t.about.title}</h1>

                        <p className="text-gray-900 font-semibold leading-relaxed text-lg mb-12 text-center max-w-3xl mx-auto">
                            {t.about.content}
                        </p>

                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🌱</span>
                                </div>
                                <h2 className="text-2xl font-display font-bold text-foreground">{t.about.whoWeAre.title}</h2>
                            </div>
                            <p className="text-gray-900 font-medium leading-relaxed text-lg">
                                {t.about.whoWeAre.text}
                            </p>
                        </section>

                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-agri-green/10 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🌟</span>
                                </div>
                                <h2 className="text-2xl font-display font-bold text-foreground">{t.about.whyChooseUs.title}</h2>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-900 font-medium leading-relaxed text-lg">
                                    {t.about.whyChooseUs.text}
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {t.about.whyChooseUs.points.map((point: string, idx: number) => (
                                        <li key={idx} className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                                            <span className="text-agri-green font-bold">✓</span>
                                            <span className="text-sm text-muted-foreground">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-agri-yellow/10 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <h2 className="text-2xl font-display font-bold text-foreground">{t.about.mission}</h2>
                            </div>
                            <p className="text-gray-900 font-medium leading-relaxed text-lg">
                                {t.about.missionText}
                            </p>
                        </section>

                        <section className="p-8 bg-agri-green/5 rounded-2xl border border-agri-green/10">
                            <h2 className="text-2xl font-display font-bold text-foreground mb-4">{t.about.joinUs.title}</h2>
                            <p className="text-gray-900 font-medium leading-relaxed text-lg">
                                {t.about.joinUs.text}
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;

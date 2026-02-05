import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Download, Star, Shield, Zap, Bell, QrCode, CheckCircle } from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';
import TopHeader from '@/components/layout/TopHeader';
import CategoryNav from '@/components/layout/CategoryNav';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const GetApp = () => {
  const { language } = useLanguage();
  const currentLanguageCode = language.toLowerCase() as 'en' | 'hi';

  const translations = {
    en: {
      title: 'Get the Vardhman App',
      subtitle: 'Shop smarter, faster, and save more!',
      description: 'Download our mobile app for the best shopping experience. Get exclusive app-only deals, track orders in real-time, and access expert farming advice.',
      downloadAndroid: 'Download for Android',
      downloadiOS: 'Download for iOS',
      comingSoon: 'Coming Soon',
      scanQR: 'Scan QR to Download',
      features: [
        { icon: Zap, title: 'Fast Ordering', desc: 'Quick checkout with saved preferences' },
        { icon: Bell, title: 'Price Alerts', desc: 'Get notified on price drops' },
        { icon: Shield, title: 'Secure Payments', desc: 'Multiple secure payment options' },
        { icon: Star, title: 'Exclusive Deals', desc: 'App-only discounts and offers' }
      ],
      stats: [
        { value: '50K+', label: 'Downloads' },
        { value: '4.8', label: 'Rating' },
        { value: '10K+', label: 'Reviews' }
      ],
      backToHome: 'Back to Home',
    },
    hi: {
      title: 'वर्थमान ऐप डाउनलोड करें',
      subtitle: 'स्मार्ट खरीदारी करें, तेजी से करें, और अधिक बचाएं!',
      description: 'सर्वोत्तम खरीदारी अनुभव के लिए हमारा मोबाइल ऐप डाउनलोड करें। ऐप-ओनली विशेष सौदे प्राप्त करें, रीयल-टाइम में ऑर्डर ट्रैक करें, और विशेषज्ञ कृषि सलाह प्राप्त करें।',
      downloadAndroid: 'एंड्रॉइड के लिए डाउनलोड करें',
      downloadiOS: 'iOS के लिए डाउनलोड करें',
      comingSoon: 'जल्द आ रहा है',
      scanQR: 'डाउनलोड करने के लिए QR स्कैन करें',
      features: [
        { icon: Zap, title: 'तेज़ ऑर्डरिंग', desc: 'सहेजी गई प्राथमिकताओं के साथ त्वरित चेकआउट' },
        { icon: Bell, title: 'मूल्य अलर्ट', desc: 'कीमतों में गिरावट पर सूचना प्राप्त करें' },
        { icon: Shield, title: 'सुरक्षित भुगतान', desc: 'कई सुरक्षित भुगतान विकल्प' },
        { icon: Star, title: 'विशेष सौदे', desc: 'ऐप-ओनली छूट और ऑफर' }
      ],
      stats: [
        { value: '50K+', label: 'डाउनलोड' },
        { value: '4.8', label: 'रेटिंग' },
        { value: '10K+', label: 'समीक्षाएं' }
      ],
      backToHome: 'होम पर वापस जाएं',
    }
  };

  const t = translations[currentLanguageCode];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader />

      <CategoryNav activeCategory="" />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-6">
              <Smartphone className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-primary font-medium mb-3">{t.subtitle}</p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{t.description}</p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <AgriButton size="xl" className="gap-2">
                <Download className="w-5 h-5" />
                {t.downloadAndroid}
              </AgriButton>
              <AgriButton variant="outline" size="xl" className="gap-2">
                <Download className="w-5 h-5" />
                {t.downloadiOS}
                <span className="text-xs bg-muted px-2 py-0.5 rounded">{t.comingSoon}</span>
              </AgriButton>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-16 mb-12">
              {t.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {t.features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-agri-md transition-shadow"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* QR Code Section */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-card rounded-xl shadow-lg mb-6">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              {t.scanQR}
            </h2>
            {/* Placeholder QR Code */}
            <div className="w-40 h-40 mx-auto bg-card rounded-xl border-2 border-border flex items-center justify-center mb-6">
              <div className="grid grid-cols-5 gap-1 p-3">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-sm ${Math.random() > 0.4 ? 'bg-foreground' : 'bg-transparent'
                      }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground">
              Scan with your phone camera to download
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              ← {t.backToHome}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GetApp;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Phone, Mail, Building, User, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from '@/hooks/use-toast';

const BulkOrders = () => {
  const { language } = useLanguage();
  // Map uppercase language code from context to lowercase for local translations object
  const currentLanguage = language.toLowerCase() as 'en' | 'hi';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    products: '',
    quantity: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const translations = {
    en: {
      title: 'Bulk Order Enquiries',
      subtitle: 'Get special prices for large quantity orders',
      description: 'Planning to order in bulk? Contact us for wholesale pricing, customized solutions, and dedicated support for your agricultural needs.',
      name: 'Full Name',
      company: 'Company/Farm Name',
      email: 'Email Address',
      phone: 'Phone Number',
      products: 'Products Interested In',
      productsPlaceholder: 'e.g., Insecticides, Fertilizers, Seeds',
      quantity: 'Estimated Quantity',
      quantityPlaceholder: 'e.g., 100kg, 500L, 1000 units',
      message: 'Additional Message',
      messagePlaceholder: 'Tell us more about your requirements...',
      submit: 'Submit Enquiry',
      benefits: [
        'Competitive wholesale prices',
        'Dedicated account manager',
        'Priority shipping',
        'Flexible payment options',
        'Quality assurance guarantee'
      ],
      benefitsTitle: 'Bulk Order Benefits',
      contactUs: 'Or Call Us Directly',
      successTitle: 'Enquiry Submitted!',
      successMessage: 'Our team will contact you within 24 hours.',
      submitAnother: 'Submit Another Enquiry',
      backToHome: 'Back to Home',
    },
    hi: {
      title: 'थोक ऑर्डर पूछताछ',
      subtitle: 'बड़ी मात्रा के ऑर्डर पर विशेष मूल्य प्राप्त करें',
      description: 'थोक में ऑर्डर करने की योजना बना रहे हैं? थोक मूल्य निर्धारण, अनुकूलित समाधान और आपकी कृषि आवश्यकताओं के लिए समर्पित सहायता के लिए हमसे संपर्क करें।',
      name: 'पूरा नाम',
      company: 'कंपनी/खेत का नाम',
      email: 'ईमेल पता',
      phone: 'फोन नंबर',
      products: 'रुचि के उत्पाद',
      productsPlaceholder: 'जैसे, कीटनाशक, उर्वरक, बीज',
      quantity: 'अनुमानित मात्रा',
      quantityPlaceholder: 'जैसे, 100 किग्रा, 500 लीटर, 1000 इकाइयाँ',
      message: 'अतिरिक्त संदेश',
      messagePlaceholder: 'अपनी आवश्यकताओं के बारे में और बताएं...',
      submit: 'पूछताछ जमा करें',
      benefits: [
        'प्रतिस्पर्धी थोक मूल्य',
        'समर्पित खाता प्रबंधक',
        'प्राथमिकता शिपिंग',
        'लचीले भुगतान विकल्प',
        'गुणवत्ता आश्वासन गारंटी'
      ],
      benefitsTitle: 'थोक ऑर्डर लाभ',
      contactUs: 'या हमें सीधे कॉल करें',
      successTitle: 'पूछताछ जमा हो गई!',
      successMessage: 'हमारी टीम 24 घंटे के भीतर आपसे संपर्क करेगी।',
      submitAnother: 'एक और पूछताछ जमा करें',
      backToHome: 'होम पर वापस जाएं',
    }
  };

  const t = translations[currentLanguage];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
      title: t.successTitle,
      description: t.successMessage,
    });
  };

  const handleReset = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      products: '',
      quantity: '',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 py-12 pt-32">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              {t.title}
            </h1>
            <p className="text-xl text-primary font-medium mb-2">{t.subtitle}</p>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.description}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                      {t.successTitle}
                    </h2>
                    <p className="text-muted-foreground mb-8">{t.successMessage}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <AgriButton onClick={handleReset}>
                        {t.submitAnother}
                      </AgriButton>
                      <Link to="/">
                        <AgriButton variant="outline">
                          {t.backToHome}
                        </AgriButton>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                          {t.name} *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                          {t.company}
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                          {t.email} *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                          {t.phone} *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                          {t.products} *
                        </label>
                        <input
                          type="text"
                          value={formData.products}
                          onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                          placeholder={t.productsPlaceholder}
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                          {t.quantity} *
                        </label>
                        <input
                          type="text"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          placeholder={t.quantityPlaceholder}
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {t.message}
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={t.messagePlaceholder}
                          rows={4}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                        />
                      </div>
                    </div>

                    <AgriButton type="submit" size="lg" className="w-full gap-2">
                      <Send className="w-5 h-5" />
                      {t.submit}
                    </AgriButton>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Benefits */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  {t.benefitsTitle}
                </h3>
                <ul className="space-y-3">
                  {t.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  {t.contactUs}
                </h3>
                <a
                  href="tel:7974218016"
                  className="flex items-center gap-3 text-primary font-medium hover:underline"
                >
                  <Phone className="w-5 h-5" />
                  📞 7974218016
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};


export default BulkOrders;

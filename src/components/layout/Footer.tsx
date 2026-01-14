import React from 'react';
import { Phone, Mail, MapPin, Tractor, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  currentLanguage?: 'en' | 'hi';
}

const Footer: React.FC<FooterProps> = ({ currentLanguage = 'en' }) => {
  const translations = {
    en: {
      tagline: "Your Trusted Partner in Agriculture",
      quickLinks: "Quick Links",
      categories: "Categories",
      contact: "Contact Us",
      aboutUs: "About Us",
      blog: "Blog",
      faq: "FAQ",
      privacyPolicy: "Privacy Policy",
      terms: "Terms & Conditions",
      insecticides: "Insecticides",
      seeds: "Seeds & Saplings",
      fertilizers: "Fertilizers",
      herbicides: "Herbicides",
      address: "Bhopal, Madhya Pradesh, India",
      rights: "All rights reserved.",
      followUs: "Follow Us",
    },
    hi: {
      tagline: "कृषि में आपका विश्वसनीय साथी",
      quickLinks: "त्वरित लिंक",
      categories: "श्रेणियाँ",
      contact: "संपर्क करें",
      aboutUs: "हमारे बारे में",
      blog: "ब्लॉग",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
      privacyPolicy: "गोपनीयता नीति",
      terms: "नियम और शर्तें",
      insecticides: "कीटनाशक",
      seeds: "बीज और पौधे",
      fertilizers: "उर्वरक",
      herbicides: "खरपतवारनाशी",
      address: "भोपाल, मध्य प्रदेश, भारत",
      rights: "सर्वाधिकार सुरक्षित।",
      followUs: "हमें फॉलो करें",
    }
  };

  const t = translations[currentLanguage];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-agri-lime flex items-center justify-center">
                <Tractor className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-display font-bold">AgriCare</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              {t.tagline}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-agri-lime hover:text-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-agri-lime hover:text-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-agri-lime hover:text-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-agri-lime hover:text-primary transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {t.aboutUs}
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {t.blog}
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {t.faq}
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {t.privacyPolicy}
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {t.terms}
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">{t.categories}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#insecticides" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {t.insecticides}
                </a>
              </li>
              <li>
                <a href="#seeds" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {t.seeds}
                </a>
              </li>
              <li>
                <a href="#fertilizers" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {t.fertilizers}
                </a>
              </li>
              <li>
                <a href="#herbicides" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {t.herbicides}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">{t.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-agri-lime/20 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-agri-lime" />
                </div>
                <span className="text-primary-foreground font-semibold">7974218016</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-agri-lime/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-agri-lime" />
                </div>
                <span className="text-primary-foreground/80 text-sm">info@agricare.com</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-agri-lime/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-agri-lime" />
                </div>
                <span className="text-primary-foreground/80 text-sm">{t.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2024 AgriCare. {t.rights}</p>
            <p>Made with 💚 for farmers</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

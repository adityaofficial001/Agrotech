import { Phone, Mail, MapPin, Tractor, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const footerT = t.footer;

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* <div className="w-10 h-10 rounded-full bg-agri-lime flex items-center justify-center">
                <Tractor className="w-6 h-6 text-primary" />
              </div> */}
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Vartman Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-display font-bold">Vartman</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              {footerT.tagline}
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
            <h3 className="font-display font-semibold text-lg mb-4">{footerT.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {footerT.aboutUs}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {footerT.blog}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {footerT.faq}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {footerT.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {footerT.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">{footerT.categories}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#insecticides" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {footerT.insecticides}
                </a>
              </li>
              <li>
                <a href="#seeds" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {footerT.seeds}
                </a>
              </li>
              <li>
                <a href="#fertilizers" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {footerT.fertilizers}
                </a>
              </li>
              <li>
                <a href="#herbicides" className="text-primary-foreground/80 hover:text-agri-lime transition-colors text-sm">
                  {footerT.herbicides}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">{footerT.contact}</h3>
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
                <span className="text-primary-foreground/80 text-sm">info@vartman.com</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-agri-lime/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-agri-lime" />
                </div>
                <span className="text-primary-foreground/80 text-sm">{footerT.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2024 Vartman. {footerT.rights}</p>
            <p>{footerT.madeWithLove}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

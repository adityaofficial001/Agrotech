import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-primary-light">Vartman</h3>
                        <p className="text-gray-400">
                            {t.footer.description}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">{t.footer.quickLinks}</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-primary-light transition-colors">{t.footer.about}</a></li>
                            <li><a href="#" className="hover:text-primary-light transition-colors">{t.footer.shop}</a></li>
                            <li><a href="#" className="hover:text-primary-light transition-colors">{t.footer.blog}</a></li>
                            <li><a href="#" className="hover:text-primary-light transition-colors">{t.footer.contact}</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">{t.footer.categories}</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-primary-light transition-colors">{t.categories.seeds}</a></li>
                            <li><a href="#" className="hover:text-primary-light transition-colors">{t.categories.fertilizers}</a></li>
                            <li><a href="#" className="hover:text-primary-light transition-colors">{t.categories.implements}</a></li>
                            <li><a href="#" className="hover:text-primary-light transition-colors">{t.categories.insecticides}</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">{t.footer.contactUs}</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-primary-light" />
                                <span>+91 79742 18016</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary-light" />
                                <span>support@vartman.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary-light" />
                                <span>{t.footer.address}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">{t.footer.copyright} {t.footer.rights}</p>
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

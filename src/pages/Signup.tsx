
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';
import { Header } from '@/components/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Checkbox } from "@/components/ui/checkbox";

const Signup = () => {
    const { language, t } = useLanguage();
    const loginT = t.loginPage;

    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreedToTerms: false
    });

    const { signUp, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreedToTerms) {
            toast.error(language === 'HI' ? 'कृपया नियमों और शर्तों से सहमत हों' : 'Please agree to Terms & Conditions');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error(language === 'HI' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
            return;
        }

        setLoading(true);
        // Simmons sending OTP
        setTimeout(() => {
            setStep('otp');
            setLoading(false);
            toast.success(language === 'HI' ? 'OTP भेजा गया' : 'OTP Sent to mobile');
        }, 1000);
    };

    const handleVerifyAndSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Debug credentials
        console.log("Signup: Verifying and creating account", {
            email: formData.email,
            password: formData.password ? "[REDACTED]" : "EMPTY",
            name: formData.name
        });

        // Simulate OTP Check
        if (otp !== '1234') {
            toast.error(language === 'HI' ? 'अमान्य OTP' : 'Invalid OTP');
            setLoading(false);
            return;
        }

        try {
            const { error } = await signUp(formData.email, formData.password, formData.name);
            if (error) {
                console.error("Signup: Sign up error", error);
                toast.error(error.message || "Failed to create account. Please check your connection.");
            } else {
                toast.success(language === 'HI' ? 'खाता बनाया गया' : 'Account Created!');
                navigate('/');
            }
        } catch (error: any) {
            console.error('Signup: Unexpected auth error:', error);
            toast.error(error.message || "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        toast.info("Google Signup Integration Pending");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col font-sans">
            <Header />

            <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    <div className="text-center">
                        <Link to="/" className="inline-flex items-center gap-2 mb-2">
                            <img src="/logo.png" alt="Varthman" className="h-10 w-auto" />
                            <span className="text-2xl font-display font-black text-green-800 tracking-tight">Varthman</span>
                        </Link>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                            {loginT.createAccount}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {language === 'HI' ? 'सर्वोत्तम कृषि उत्पादों के लिए हमसे जुड़ें' : 'Join for the best agricultural products'}
                        </p>
                    </div>

                    <div className="bg-white py-8 px-4 shadow-xl rounded-2xl border border-gray-100 sm:px-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

                        {step === 'details' ? (
                            <form className="space-y-6" onSubmit={handleSendOtp}>
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{loginT.name || (language === 'HI' ? 'पूरा नाम' : 'Full Name')}</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 py-3 border"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{loginT.phone || (language === 'HI' ? 'मोबाइल नंबर' : 'Mobile Number')}</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 py-3 border"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{loginT.email || (language === 'HI' ? 'ईमेल' : 'Email Address')}</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 py-3 border"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{loginT.password || (language === 'HI' ? 'पासवर्ड' : 'Password')}</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            minLength={6}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 py-3 border"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{loginT.confirmPassword || (language === 'HI' ? 'पासवर्ड पुनः दर्ज करें' : 'Confirm Password')}</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 py-3 border"
                                        />
                                    </div>
                                </div>

                                {/* Terms Checkbox */}
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <Checkbox
                                            id="terms"
                                            checked={formData.agreedToTerms}
                                            onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-medium text-gray-700">
                                            {loginT.agreeTerms} <a href="/terms" className="text-green-600 hover:text-green-500">{loginT.terms}</a> {loginT.and} <a href="/privacy" className="text-green-600 hover:text-green-500">{loginT.privacy}</a>
                                        </label>
                                    </div>
                                </div>

                                <AgriButton
                                    type="submit"
                                    size="lg"
                                    className="w-full flex justify-center py-3 bg-green-600 hover:bg-green-700 text-white"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : loginT.verifyMobile}
                                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                                </AgriButton>
                            </form>
                        ) : (
                            <form className="space-y-6" onSubmit={handleVerifyAndSignup}>
                                <div className="text-center mb-6">
                                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Phone className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{loginT.verifyMobile}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {language === 'HI' ? `OTP भेजा गया ${formData.phone}` : `OTP sent to +91 ${formData.phone}`}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 text-center mb-2">{loginT.enterOtp}</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={4}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="block w-full text-center tracking-[1em] text-3xl font-bold border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 py-4 border"
                                        placeholder="----"
                                        autoFocus
                                    />
                                </div>

                                <AgriButton
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : loginT.createAccount}
                                </AgriButton>

                                <button
                                    type="button"
                                    onClick={() => setStep('details')}
                                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                                >
                                    {language === 'HI' ? 'वापस जाएँ' : 'Go Back'}
                                </button>
                            </form>
                        )}

                        {step === 'details' && (
                            <>
                                <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">{language === 'HI' ? 'या जारी रखें' : 'Or continue with'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            onClick={handleGoogleSignup}
                                            className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Google
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        {loginT.alreadyHaveAccount} <Link to="/login" className="font-bold text-green-600 hover:text-green-500">{language === 'HI' ? 'लॉग इन' : 'Login'}</Link>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-green-700/80">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm font-medium">{loginT.secureInfo}</span>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Signup;

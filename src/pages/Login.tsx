
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, ShieldCheck, ArrowRight, Leaf, Sprout } from 'lucide-react';
import { AgriButton } from '@/components/ui/AgriButton';
import { Header } from '@/components/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
  const { language, t } = useLanguage();
  const loginT = t.loginPage;

  const [isLogin, setIsLogin] = useState(true);
  const [useOtp, setUseOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Debug credentials as requested
    console.log("Login: Attempting login with", {
      email: formData.email,
      password: formData.password ? "[REDACTED]" : "EMPTY",
      useOtp
    });

    try {
      if (isLogin) {
        if (useOtp) {
          if (!otpSent) {
            console.log("Login: Sending OTP to", formData.phone);
            setTimeout(() => {
              setOtpSent(true);
              toast.success(language === 'HI' ? 'OTP भेजा गया!' : 'OTP Sent successfully!');
              setLoading(false);
            }, 1000);
            return;
          } else {
            console.log("Login: Verifying OTP", otp);
            if (otp === '1234') {
              toast.success(language === 'HI' ? 'लॉगिन सफल!' : 'Login Successful!');
              navigate('/');
            } else {
              toast.error(language === 'HI' ? 'अमान्य OTP' : 'Invalid OTP');
              setLoading(false);
            }
            return;
          }
        }

        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          console.error("Login: Sign in error", error);
          toast.error(error.message || "Failed to connect to authentication service");
        } else {
          toast.success(language === 'HI' ? 'लॉगिन सफल!' : 'Login Successful!');
          navigate('/');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error(language === 'HI' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
          setLoading(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          console.error("Login: Sign up error", error);
          toast.error(error.message || "Failed to create account");
        } else {
          toast.success(language === 'HI' ? 'खाता बनाया गया!' : 'Account Created!');
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Login: Unexpected auth error:', error);
      toast.error(error.message || "An unexpected error occurred. Please check your internet connection.");
    } finally {
      if (!useOtp || (useOtp && otpSent)) {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google Login Integration Pending");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex max-w-[1920px] mx-auto w-full shadow-2xl mt-24 mb-4 sm:mb-8 rounded-2xl overflow-hidden bg-white min-h-[700px]">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
          <img
            src="/login-hero.jpg"
            alt="Farmer with Mahindra Tractor"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white z-10">
            <div className="mb-8 animate-in slide-in-from-bottom-8 duration-700 delay-100">
              <div className="w-16 h-16 bg-green-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-green-400/30 shadow-lg">
                <Leaf className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight drop-shadow-md">
                {language === 'HI' ? 'खेती का नया दौर' : 'The Future of Farming'}
              </h1>
              <p className="text-lg text-gray-100 max-w-md leading-relaxed drop-shadow-sm font-medium">
                {language === 'HI'
                  ? 'वर्थमान के साथ अपनी फसल की पैदावार बढ़ाएं। विशेषज्ञ सलाह और प्रीमियम उत्पादों के लिए आपका विश्वसनीय साथी।'
                  : 'Empowering farmers with premium products and expert advice. Join thousands of successful farmers on Vardhman.'}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-300 border-t border-white/20 pt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs font-bold overflow-hidden">
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-semibold drop-shadow-sm">{t.hero.trustedBy} {t.hero.farmersCount}</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white relative">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Sprout className="w-64 h-64 text-green-600" />
          </div>

          <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in duration-700">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-display font-bold text-gray-900">
                {isLogin
                  ? (useOtp ? loginT.loginWithOtp : (language === 'HI' ? 'वापसी पर स्वागत है' : 'Welcome Back'))
                  : (language === 'HI' ? 'शुरू करें' : 'Get Started')}
              </h2>
              <p className="mt-2 text-gray-500">
                {isLogin
                  ? (language === 'HI' ? 'आगे बढ़ने के लिए अपना विवरण दर्ज करें' : 'Enter your details to access your account')
                  : (language === 'HI' ? 'अपना मुफ्त खाता बनाएं' : 'Create your free account today')}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">{language === 'HI' ? 'नाम' : 'Full Name'}</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {/* Login Toggle */}
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setUseOtp(!useOtp); setOtpSent(false); }}
                    className="text-sm font-medium text-green-700 hover:text-green-800 hover:underline transition-colors"
                  >
                    {useOtp ? loginT.orLoginWithPassword : loginT.orLoginWithOtp}
                  </button>
                </div>
              )}

              {useOtp && isLogin ? (
                <>
                  {!otpSent ? (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">{language === 'HI' ? 'मोबाइल नंबर' : 'Mobile Number'}</label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                        <input
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">{loginT.enterOtp}</label>
                      <input
                        name="otp"
                        type="text"
                        required
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full text-center tracking-[1em] text-2xl font-bold py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none"
                        placeholder="- - - -"
                      />
                      <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-green-600 hover:underline w-full text-right mt-1">
                        {loginT.resendOtp}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">{language === 'HI' ? 'ईमेल' : 'Email Address'}</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">{language === 'HI' ? 'पासवर्ड' : 'Password'}</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">{language === 'HI' ? 'पासवर्ड पुनः दर्ज करें' : 'Confirm Password'}</label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                        <input
                          name="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center justify-between pt-2">
                {isLogin && (
                  <div className="flex items-center">
                    <Checkbox id="remember-me" className="border-gray-300 text-green-600 focus:ring-green-500" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                      {loginT.rememberMe}
                    </label>
                  </div>
                )}
                {isLogin && !useOtp && (
                  <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500 hover:underline">
                    {language === 'HI' ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
                  </a>
                )}
              </div>

              <AgriButton
                type="submit"
                size="xl"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-green-200 shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {useOtp && isLogin
                      ? (otpSent ? loginT.verifyOtp : loginT.getOtp)
                      : (isLogin ? (language === 'HI' ? 'लॉग इन' : 'Sign In') : (language === 'HI' ? 'साइन अप' : 'Create Account'))}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </AgriButton>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">
                  {language === 'HI' ? 'या जारी रखें' : 'Or continue with'}
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span>Google</span>
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                {isLogin ? (language === 'HI' ? 'खाता नहीं है?' : "Don't have an account?") : (language === 'HI' ? 'पहले से खाता है?' : "Already have an account?")}{' '}
                <button
                  onClick={() => { setIsLogin(!isLogin); setUseOtp(false); }}
                  className="font-bold text-green-700 hover:text-green-800 hover:underline transition-colors ml-1"
                >
                  {isLogin ? (language === 'HI' ? 'साइन अप' : 'Sign up') : (language === 'HI' ? 'लॉग इन' : 'Log in')}
                </button>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-green-700/60 pt-4 cursor-default" title="Your data is encrypted">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide uppercase">{loginT.secureInfo}</span>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;

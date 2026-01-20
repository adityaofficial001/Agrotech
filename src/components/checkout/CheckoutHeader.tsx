
import { Tractor, Lock, CheckCircle, MapPin, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export const CheckoutHeader = ({ step }: { step: number }) => {
    return (
        <div className="bg-white border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg">
                            <Tractor className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-primary leading-none">AgriCare</h1>
                            <p className="text-xs text-primary/80">Secure Checkout</p>
                        </div>
                    </Link>

                    {/* Steps */}
                    <div className="flex items-center gap-2 md:gap-4 text-sm">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                            <CheckCircle className="h-5 w-5" />
                            <span className="hidden md:inline font-medium">Cart</span>
                        </div>
                        <div className="w-8 h-[1px] bg-gray-200" />

                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                            <MapPin className="h-5 w-5" />
                            <span className="hidden md:inline font-medium">Address</span>
                        </div>
                        <div className="w-8 h-[1px] bg-gray-200" />

                        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                            <CreditCard className="h-5 w-5" />
                            <span className="hidden md:inline font-medium">Payment</span>
                        </div>
                    </div>

                    {/* Secure Icon */}
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                        <Lock className="h-3 w-3" />
                        100% Secure
                    </div>
                </div>
            </div>
        </div>
    );
};

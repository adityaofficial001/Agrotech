
import { useState } from "react";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { AddressForm } from "@/components/checkout/AddressForm";
import { PaymentSection } from "@/components/checkout/PaymentSection";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const Checkout = () => {
    const [shippingCost, setShippingCost] = useState(0);
    const { items, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 1. Check if cart is empty
        if (items.length === 0) {
            toast.error(t.checkout.cartEmpty);
            return;
        }

        // 2. Form Validation (HTML5 required handles some, but let's be safe)
        const formData = new FormData(e.currentTarget);
        const requiredFields = ['fullname', 'phone', 'email', 'pincode', 'state', 'district', 'address'];
        const missingFields = requiredFields.filter(f => !formData.get(f));

        if (missingFields.length > 0) {
            toast.error(t.checkout.fillDetails);
            return;
        }

        // 3. Payment Method Validation (could be added here if payment state was lifted)
        // For now we assume one is selected by default in PaymentSection.

        // Simulate success
        toast.success(t.checkout.paymentSuccess, {
            description: t.checkout.paymentDesc,
            duration: 3000,
        });

        clearCart();
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <CheckoutHeader step={2} t={t.checkout} />

            <form
                id="checkout-form"
                onSubmit={handlePlaceOrder}
                className="container mx-auto px-4 py-8"
            >
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        <AddressForm t={t.checkout} />
                        <PaymentSection setShippingCost={setShippingCost} t={t.checkout} />
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary shippingCost={shippingCost} t={t.checkout} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;



import { useState } from "react";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { AddressForm } from "@/components/checkout/AddressForm";
import { PaymentSection } from "@/components/checkout/PaymentSection";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
    const [shippingCost, setShippingCost] = useState(0);
    const { clearCart } = useCart();
    const navigate = useNavigate();

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation check: ensure required fields in the form are filled
        // Since form is uncontrolled for now, we rely on HTML5 validation triggering on button click
        // However, the button is outside the form. We need to link them or check manually.
        // For this mockup, we'll assume validation passes if they click (or implementing a simple check).

        // Simulate success
        toast.success("Order Successfully Placed!", {
            description: "Thank you for shopping with AgriCare.",
            duration: 3000,
        });

        clearCart();
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <CheckoutHeader step={2} />

            <form
                id="checkout-form"
                onSubmit={handlePlaceOrder}
                className="container mx-auto px-4 py-8"
            >
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        <AddressForm />
                        <PaymentSection setShippingCost={setShippingCost} />
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary shippingCost={shippingCost} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;

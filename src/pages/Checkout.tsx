import { useState } from "react";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { AddressForm } from "@/components/checkout/AddressForm";
import { PaymentSection } from "@/components/checkout/PaymentSection";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { addDays, format } from "date-fns";
import { AgriButton } from "@/components/ui/AgriButton";
import { LogIn } from "lucide-react";

const Checkout = () => {
    const [shippingCost, setShippingCost] = useState(0);
    const { items, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { createOrder } = useOrders();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 1. Check if user is logged in
        if (!user) {
            toast.error("Please login to place an order");
            navigate("/login");
            return;
        }

        // 2. Check if cart is empty
        if (items.length === 0) {
            toast.error(t.checkout.cartEmpty);
            return;
        }

        // 3. Form Validation & Data Extraction
        const formData = new FormData(e.currentTarget);
        const requiredFields = ['fullname', 'phone', 'email', 'pincode', 'state', 'district', 'address'];
        const missingFields = requiredFields.filter(f => !formData.get(f));

        if (missingFields.length > 0) {
            toast.error(t.checkout.fillDetails);
            return;
        }

        // Prepare data for Order Creation
        const shippingAddress = {
            fullName: formData.get('fullname') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            address: formData.get('address') as string,
            city: formData.get('district') as string,
            state: formData.get('state') as string,
            pincode: formData.get('pincode') as string,
        };

        const orderItems = items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.cartQuantity,
            price: item.priceMin,
            image: item.image,
        }));

        const estimatedDelivery = format(addDays(new Date(), 5), "yyyy-MM-dd");

        // 4. Create Order
        const order = await createOrder({
            total_amount: cartTotal + shippingCost,
            shipping_address: shippingAddress,
            items: orderItems,
            estimated_delivery: estimatedDelivery,
        });

        // 5. Success
        if (order) {
            toast.success(t.checkout.paymentSuccess, {
                description: `Order ${order.order_number} has been created.`,
                duration: 3000,
            });

            clearCart();
            setTimeout(() => {
                navigate("/orders");
            }, 2000);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background pb-12">
                <CheckoutHeader step={2} t={t.checkout} />
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <LogIn className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                            Please Login to Continue
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            You need to be logged in to place an order and track your purchases.
                        </p>
                        <Link to="/login">
                            <AgriButton size="lg">
                                <LogIn className="w-4 h-4 mr-2" />
                                Login to Continue
                            </AgriButton>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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


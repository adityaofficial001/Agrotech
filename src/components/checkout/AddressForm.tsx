
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const AddressForm = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Billing Details
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" id="address-form">
                <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name *</Label>
                    <Input id="fullname" placeholder="John Doe" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" placeholder="10-digit mobile number" type="tel" maxLength={10} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" placeholder="name@example.com" type="email" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" placeholder="6-digit pincode" maxLength={6} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="state" required>
                        <option value="">Select State</option>
                        <option value="MH">Maharashtra</option>
                        <option value="MP">Madhya Pradesh</option>
                        <option value="GJ">Gujarat</option>
                        <option value="KA">Karnataka</option>
                        <option value="PB">Punjab</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input id="district" placeholder="District name" required />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea id="address" placeholder="House no, Street, Village/City, Landmark" className="min-h-[100px]" required />
                </div>
            </form>
        </div>
    );
};

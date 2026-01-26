
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddressFormProps {
    t?: any;
}

export const AddressForm = ({ t }: AddressFormProps) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                {t?.sections?.shipping || "Shipping Details"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="fullname">{t?.form?.name || "Full Name"} *</Label>
                    <Input id="fullname" name="fullname" placeholder={t?.form?.name || "John Doe"} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">{t?.form?.phone || "Phone Number"} *</Label>
                    <Input id="phone" name="phone" placeholder={t?.placeholders?.phone || "10-digit mobile number"} type="tel" maxLength={10} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">{t?.form?.email || "Email Address"} *</Label>
                    <Input id="email" name="email" placeholder={t?.placeholders?.email || "name@example.com"} type="email" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pincode">{t?.form?.pincode || "Pincode"} *</Label>
                    <Input id="pincode" name="pincode" placeholder={t?.placeholders?.pincode || "6-digit pincode"} maxLength={6} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="state">{t?.form?.state || "State"} *</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="state" name="state" required>
                        <option value="">{t?.placeholders?.state || "Select State"}</option>
                        <option value="MH">Maharashtra</option>
                        <option value="MP">Madhya Pradesh</option>
                        <option value="GJ">Gujarat</option>
                        <option value="KA">Karnataka</option>
                        <option value="PB">Punjab</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="district">{t?.form?.district || "District"} *</Label>
                    <Input id="district" name="district" placeholder={t?.placeholders?.district || "District name"} required />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">{t?.form?.address || "Full Address"} *</Label>
                    <Textarea id="address" name="address" placeholder={t?.placeholders?.address || "House no, Street, Village/City, Landmark"} className="min-h-[100px]" required />
                </div>
            </div>
        </div>
    );
};

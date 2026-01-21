
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Truck, Wallet, Smartphone, Banknote } from "lucide-react";
import { toast } from "sonner";

interface PaymentSectionProps {
    setShippingCost: (cost: number) => void;
    t?: any;
}

export const PaymentSection = ({ setShippingCost, t }: PaymentSectionProps) => {
    return (
        <div className="space-y-6">
            {/* Shipping Methods */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    {t?.sections?.shipping || "Shipping Method"}
                </h2>

                <RadioGroup defaultValue="standard" onValueChange={(val) => {
                    if (val === 'standard') setShippingCost(0);
                    if (val === 'express') setShippingCost(50);
                    if (val === 'priority') setShippingCost(100);
                }}>
                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="r1" />
                            <Label htmlFor="r1" className="cursor-pointer">
                                <div className="font-medium">{t?.payment?.delivery?.standard || "Standard Delivery"}</div>
                                <div className="text-xs text-gray-500">{t?.payment?.delivery?.standardDays || "5-7 Business Days"}</div>
                            </Label>
                        </div>
                        <span className="font-medium text-green-600">{t?.payment?.delivery?.free || "Free"}</span>
                    </div>

                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="express" id="r2" />
                            <Label htmlFor="r2" className="cursor-pointer">
                                <div className="font-medium">{t?.payment?.delivery?.express || "Express Delivery"}</div>
                                <div className="text-xs text-gray-500">{t?.payment?.delivery?.expressDays || "2-4 Business Days"}</div>
                            </Label>
                        </div>
                        <span className="font-bold">₹50</span>
                    </div>

                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="priority" id="r3" />
                            <Label htmlFor="r3" className="cursor-pointer">
                                <div className="font-medium">{t?.payment?.delivery?.priority || "Priority Delivery"}</div>
                                <div className="text-xs text-gray-500">{t?.payment?.delivery?.priorityDays || "1-2 Business Days"}</div>
                            </Label>
                        </div>
                        <span className="font-bold">₹100</span>
                    </div>
                </RadioGroup>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    {t?.sections?.payment || "Payment Method"}
                </h2>

                <Tabs defaultValue="upi" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 h-auto p-1 bg-gray-50/50">
                        <TabsTrigger value="upi" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                            <Smartphone className="h-4 w-4" />
                            <span className="text-xs">{t?.payment?.upi || "UPI"}</span>
                        </TabsTrigger>
                        <TabsTrigger value="cod" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                            <Banknote className="h-4 w-4" />
                            <span className="text-xs">{t?.payment?.cod || "COD"}</span>
                        </TabsTrigger>
                        <TabsTrigger value="card" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                            <CreditCard className="h-4 w-4" />
                            <span className="text-xs">{t?.payment?.card || "Card"}</span>
                        </TabsTrigger>
                        <TabsTrigger value="netbanking" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                            <div className="h-4 w-4 font-bold text-xs">{t?.payment?.nb || "NB"}</div>
                            <span className="text-xs">{t?.payment?.net || "Net"}</span>
                        </TabsTrigger>
                        <TabsTrigger value="wallet" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                            <Wallet className="h-4 w-4" />
                            <span className="text-xs">{t?.payment?.wallet || "Wallet"}</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        <TabsContent value="upi" className="space-y-4">
                            <p className="text-sm text-gray-500 mb-4">{t?.payment?.upiDesc || "Pay using PhonePe, Paytm, or Google Pay"}</p>
                            <div className="flex gap-2">
                                <Input placeholder={t?.payment?.upiPlaceholder || "Enter UPI ID (e.g. 9876543210@upi)"} />
                                <Button type="button" onClick={() => toast.success("UPI ID Verified!")}>
                                    {t?.payment?.verify || "Verify"}
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="cod" className="space-y-4">
                            <div className="border border-green-200 bg-green-50 p-4 rounded-lg flex gap-3 text-green-800 text-sm">
                                <Truck className="h-5 w-5 flex-shrink-0" />
                                <p>{t?.payment?.codDesc || "Pay cash when your order is delivered to your doorstep. No extra charges."}</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="card" className="space-y-4">
                            <Input placeholder="Card Number" />
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="MM / YY" />
                                <Input placeholder="CVV" />
                            </div>
                            <Input placeholder="Cardholder Name" />
                        </TabsContent>

                        <TabsContent value="netbanking" className="space-y-4">
                            <select className="w-full p-2 border rounded-md">
                                <option>State Bank of India</option>
                                <option>HDFC Bank</option>
                                <option>ICICI Bank</option>
                                <option>Axis Bank</option>
                            </select>
                        </TabsContent>

                        <TabsContent value="wallet" className="space-y-4">
                            <RadioGroup defaultValue="phonepe">
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <RadioGroupItem value="phonepe" id="w1" />
                                    <Label htmlFor="w1">PhonePe Wallet</Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <RadioGroupItem value="paytm" id="w2" />
                                    <Label htmlFor="w2">Paytm Wallet</Label>
                                </div>
                            </RadioGroup>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

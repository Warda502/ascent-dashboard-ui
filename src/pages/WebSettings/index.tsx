
import { useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export default function WebSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  
  // Set the active tab based on the current path
  const getCurrentTab = () => {
    const pathname = location.pathname;
    if (pathname.includes("supported-models")) {
      return "supported-models";
    } else if (pathname.includes("pricing")) {
      return "pricing";
    } else if (pathname.includes("payment-methods")) {
      return "payment-methods";
    } else if (pathname.includes("discount-offers")) {
      return "discount-offers";
    }
    return "supported-models"; // Default tab
  };
  
  const [activeTab, setActiveTab] = useState(getCurrentTab());

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/web-settings/${value}`);
  };

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="p-6">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="supported-models">
              {t("supportedModels") || "Supported Models"}
            </TabsTrigger>
            <TabsTrigger value="pricing">
              {t("pricing") || "Pricing"}
            </TabsTrigger>
            <TabsTrigger value="payment-methods">
              {t("paymentMethods") || "Payment Methods"}
            </TabsTrigger>
            <TabsTrigger value="discount-offers">
              {t("discountOffers") || "Discount Offers"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="supported-models" className="pt-4">
            {activeTab === "supported-models" && <Outlet />}
          </TabsContent>
          
          <TabsContent value="pricing" className="pt-4">
            {activeTab === "pricing" && <Outlet />}
          </TabsContent>
          
          <TabsContent value="payment-methods" className="pt-4">
            {activeTab === "payment-methods" && <Outlet />}
          </TabsContent>
          
          <TabsContent value="discount-offers" className="pt-4">
            {activeTab === "discount-offers" && <Outlet />}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

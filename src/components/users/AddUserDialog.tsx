
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/hooks/useLanguage";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUser: any) => Promise<boolean> | boolean;
}

export function AddUserDialog({
  isOpen,
  onClose,
  onSave
}: AddUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credits, setCredits] = useState("0");
  const [userType, setUserType] = useState("Credits License");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Saudi Arabia");
  const [subscriptionMonths, setSubscriptionMonths] = useState("3");
  const [showSubscriptionMonths, setShowSubscriptionMonths] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, isRTL } = useLanguage();

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", 
    "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", 
    "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", 
    "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", 
    "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", 
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", 
    "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", 
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", 
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", 
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
    "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", 
    "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", 
    "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", 
    "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", 
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
    "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", 
    "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", 
    "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", 
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", 
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
    "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", 
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", 
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", 
    "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", 
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", 
    "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", 
    "Zambia", "Zimbabwe"
  ];

  useEffect(() => {
    setShowSubscriptionMonths(userType === "Monthly License");
  }, [userType]);

  const validateForm = () => {
    if (!name.trim()) {
      toast(t("error") || "خطأ", {
        description: "الاسم مطلوب"
      });
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      toast(t("error") || "خطأ", {
        description: "البريد الإلكتروني غير صحيح"
      });
      return false;
    }
    
    if (!password || password.length < 6) {
      toast(t("error") || "خطأ", {
        description: "كلمة المرور يجب أن تكون على الأقل 6 أحرف"
      });
      return false;
    }
    
    if (!phone.trim()) {
      toast(t("error") || "خطأ", {
        description: "رقم الهاتف مطلوب"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formattedCredits = credits + ".0";
    const newUser = {
      Name: name,
      Email: email,
      Password: password,
      Credits: formattedCredits,
      User_Type: userType,
      Phone: phone,
      Country: country,
      Block: "Not Blocked",
      subscriptionMonths: userType === "Monthly License" ? subscriptionMonths : undefined
    };
    
    try {
      setLoading(true);
      console.log("Submitting new user:", {
        ...newUser,
        Password: "[HIDDEN]"
      });
      
      const success = await onSave(newUser);
      
      if (success === true) {
        // Reset form fields
        setName("");
        setEmail("");
        setPassword("");
        setCredits("0");
        setUserType("Credits License");
        setPhone("");
        setCountry("Saudi Arabia");
        setSubscriptionMonths("3");
        
        // Close the dialog
        onClose();
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast(t("error") || "خطأ", {
        description: t("addUserError") || "فشل في إضافة المستخدم"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir={isRTL ? "rtl" : "ltr"} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addNewUser") || "إضافة مستخدم جديد"}</DialogTitle>
          <DialogDescription>
            {t("enterNewUserData") || "أدخل بيانات المستخدم الجديد"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("name") || "الاسم"} <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="أدخل الاسم الكامل"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">{t("email") || "البريد الإلكتروني"} <span className="text-red-500">*</span></Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="example@domain.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">{t("password") || "كلمة المرور"} <span className="text-red-500">*</span></Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                minLength={6}
                placeholder="على الأقل 6 أحرف"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="userType">{t("userType") || "نوع المستخدم"}</Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger id="userType">
                  <SelectValue placeholder={t("selectUserType") || "اختر نوع المستخدم"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credits License">{t("creditsLicense") || "رخصة رصيد"}</SelectItem>
                  <SelectItem value="Monthly License">{t("monthlyLicense") || "رخصة شهرية"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {showSubscriptionMonths ? (
              <div className="grid gap-2">
                <Label htmlFor="subscriptionMonths">{t("subscriptionPeriod") || "مدة الاشتراك"}</Label>
                <Select value={subscriptionMonths} onValueChange={setSubscriptionMonths}>
                  <SelectTrigger id="subscriptionMonths">
                    <SelectValue placeholder={t("selectSubscriptionPeriod") || "اختر مدة الاشتراك"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">{t("threeMonths") || "3 أشهر"}</SelectItem>
                    <SelectItem value="6">{t("sixMonths") || "6 أشهر"}</SelectItem>
                    <SelectItem value="9">{t("nineMonths") || "9 أشهر"}</SelectItem>
                    <SelectItem value="12">{t("twelveMonths") || "12 أشهر"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="credits">{t("credit") || "الرصيد"}</Label>
                <Input 
                  id="credits" 
                  type="number" 
                  value={credits} 
                  onChange={e => setCredits(e.target.value)} 
                  required 
                  min="0"
                  placeholder="0"
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("phone") || "رقم الهاتف"} <span className="text-red-500">*</span></Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                required 
                placeholder="+966xxxxxxxxx"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="country">{t("country") || "الدولة"}</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder={t("selectCountry") || "اختر الدولة"} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(countryName => (
                    <SelectItem key={countryName} value={countryName}>
                      {countryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button type="submit" disabled={loading}>
              {loading ? (t("adding") || "جاري الإضافة...") : (t("addUser") || "إضافة المستخدم")}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                {t("cancel") || "إلغاء"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

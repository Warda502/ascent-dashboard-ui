import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported languages
export type Language = 'en' | 'ar';

// Define the translation interface
export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

// Context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
  isRTL: boolean;
}

// Create translations
export const translations: Translations = {
  dashboard: {
    en: "Dashboard",
    ar: "الرئيسية"
  },
  operations: {
    en: "Operations",
    ar: "العمليات"
  },
  users: {
    en: "Users Manager",
    ar: "إدارة المستخدمين"
  },
  settings: {
    en: "Settings",
    ar: "الإعدادات"
  },
  search: {
    en: "Search...",
    ar: "بحث..."
  },
  filter: {
    en: "Filter",
    ar: "تصفية"
  },
  successfulOperations: {
    en: "Successful Operations",
    ar: "العمليات الناجحة"
  },
  failedOperations: {
    en: "Failed Operations",
    ar: "العمليات الفاشلة"
  },
  showAll: {
    en: "Show All",
    ar: "إظهار الكل"
  },
  basicView: {
    en: "Basic View",
    ar: "عرض أساسي"
  },
  detailedView: {
    en: "Detailed View",
    ar: "عرض مفصل"
  },
  loading: {
    en: "Loading data...",
    ar: "جاري تحميل البيانات..."
  },
  noData: {
    en: "No operations found",
    ar: "لا توجد عمليات مسجلة"
  },
  export: {
    en: "Export Data",
    ar: "تصدير البيانات"
  },
  refresh: {
    en: "Refresh Data",
    ar: "تحديث البيانات"
  },
  exported: {
    en: "Exported",
    ar: "تم التصدير"
  },
  exportSuccess: {
    en: "Data exported successfully",
    ar: "تم تصدير البيانات بنجاح"
  },
  operationID: {
    en: "Operation ID",
    ar: "رقم العملية"
  },
  operationType: {
    en: "Operation Type",
    ar: "نوع العملية"
  },
  serialNumber: {
    en: "Serial Number",
    ar: "الرقم التسلسلي"
  },
  brand: {
    en: "Brand",
    ar: "العلامة التجارية"
  },
  model: {
    en: "Model",
    ar: "الموديل"
  },
  imei: {
    en: "IMEI",
    ar: "IMEI"
  },
  user: {
    en: "User",
    ar: "المستخدم"
  },
  credit: {
    en: "Credit",
    ar: "الرصيد"
  },
  time: {
    en: "Time",
    ar: "الوقت"
  },
  status: {
    en: "Status",
    ar: "الحالة"
  },
  android: {
    en: "Android",
    ar: "أندرويد"
  },
  baseband: {
    en: "Baseband",
    ar: "الباسباند"
  },
  carrier: {
    en: "Carrier",
    ar: "المشغل"
  },
  securityPatch: {
    en: "Security Patch",
    ar: "تحديث الأمان"
  },
  uid: {
    en: "UID",
    ar: "UID"
  },
  hwid: {
    en: "HWID",
    ar: "HWID"
  },
  actions: {
    en: "Actions",
    ar: "الإجراءات"
  },
  details: {
    en: "Details",
    ar: "التفاصيل"
  },
  refund: {
    en: "Refund",
    ar: "استرداد"
  },
  operationsManagement: {
    en: "View and manage system operations",
    ar: "عرض وإدارة العمليات المسجلة في النظام"
  },
  totalOperations: {
    en: "Total Operations",
    ar: "إجمالي العمليات"
  },
  refundSuccess: {
    en: "Refund completed",
    ar: "تم الاسترداد"
  },
  refundDescription: {
    en: "Credit has been refunded successfully",
    ar: "تم استرداد الرصيد بنجاح"
  },
  addUser: {
    en: "Add User",
    ar: "إضافة مستخدم جديد"
  },
  addCredit: {
    en: "Add Credit",
    ar: "إضافة رصيد"
  },
  viewDetails: {
    en: "View",
    ar: "عرض"
  },
  edit: {
    en: "Edit",
    ar: "تعديل"
  },
  renew: {
    en: "Renew",
    ar: "تجديد"
  },
  delete: {
    en: "Delete",
    ar: "حذف"
  },
  usersTitle: {
    en: "Users List",
    ar: "قائمة المستخدمين"
  },
  usersDescription: {
    en: "Manage all system users from here",
    ar: "يمكنك إدارة جميع المستخدمين من هنا"
  },
  searchUsers: {
    en: "Search for users...",
    ar: "بحث عن مستخدم..."
  },
  email: {
    en: "Email",
    ar: "البريد الإلكتروني"
  },
  userType: {
    en: "User Type",
    ar: "نوع المستخدم"
  },
  country: {
    en: "Country",
    ar: "الدولة"
  },
  startDate: {
    en: "Start Date",
    ar: "تاريخ البداية"
  },
  expiryDate: {
    en: "Expiry Date",
    ar: "تاريخ الانتهاء"
  },
  noUsers: {
    en: "No users match your search",
    ar: "لا يوجد مستخدمين مطابقين لبحثك"
  },
  operationDetails: {
    en: "Operation Details",
    ar: "تفاصيل العملية"
  },
  close: {
    en: "Close",
    ar: "إغلاق"
  },
  home: {
    en: "Home",
    ar: "الرئيسية"
  },
  logout: {
    en: "Logout",
    ar: "تسجيل الخروج"
  },
  welcome: {
    en: "Welcome",
    ar: "مرحبًا"
  },
  userManagement: {
    en: "User Management",
    ar: "إدارة المستخدمين"
  },
  allRightsReserved: {
    en: "© 2025 Pegasus Tool - All Rights Reserved",
    ar: "© 2025 بيجاسوس تول - جميع الحقوق محفوظة"
  },
  pegasusTool: {
    en: "Pegasus Tool",
    ar: "بيجاسوس تول"
  },
  updateSuccess: {
    en: "Updated",
    ar: "تم التحديث"
  },
  updateUserSuccess: {
    en: "User information updated successfully",
    ar: "تم تحديث بيانات المستخدم بنجاح"
  },
  deleteSuccess: {
    en: "Deleted",
    ar: "تم الحذف"
  },
  deleteUserSuccess: {
    en: "User deleted successfully",
    ar: "تم حذف المستخدم بنجاح"
  },
  addSuccess: {
    en: "Added",
    ar: "تمت الإضافة"
  },
  addUserSuccess: {
    en: "User added successfully",
    ar: "تم إضافة المستخدم بنجاح"
  },
  renewSuccess: {
    en: "Renewed",
    ar: "تم التجديد"
  },
  renewUserSuccess: {
    en: "User account renewed successfully",
    ar: "تم تجديد حساب المستخدم بنجاح"
  },
  addCreditSuccess: {
    en: "Credit Added",
    ar: "تمت إضافة الرصيد"
  },
  addCreditDescription: {
    en: "Credit added successfully",
    ar: "تم إضافة الرصيد بنجاح"
  },
  selectUser: {
    en: "Select user",
    ar: "اختر مستخدم"
  },
  creditAmount: {
    en: "Credit Amount",
    ar: "قيمة الرصيد"
  },
  creditExplanation: {
    en: "The amount will be added with the .0 identifier",
    ar: "سيتم إضافة المبلغ مع علامة .0"
  },
  cancel: {
    en: "Cancel",
    ar: "إلغاء"
  },
  add: {
    en: "Add",
    ar: "إضافة"
  },
  adding: {
    en: "Adding...",
    ar: "جاري الإضافة..."
  },
  current: {
    en: "Current",
    ar: "الحالي"
  },
  fetchSuccessTitle: {
    en: "Data Loaded",
    ar: "تم تحميل البيانات"
  },
  fetchSuccessDescription: {
    en: "Data loaded successfully",
    ar: "تم جلب البيانات بنجاح"
  },
  login: {
    en: "Login",
    ar: "تسجيل الدخول"
  },
  password: {
    en: "Password",
    ar: "كلمة المرور"
  },
  loggingIn: {
    en: "Logging in...",
    ar: "جاري تسجيل الدخول..."
  },
  noAccount: {
    en: "Don't have an account?",
    ar: "ليس لديك حساب؟"
  },
  createAccount: {
    en: "Create a new account",
    ar: "إنشاء حساب جديد"
  },
  welcomeMessage: {
    en: "Welcome to User Management System",
    ar: "مرحباً بك في نظام إدارة المستخدمين"
  },
  systemDescription: {
    en: "An integrated system for managing users and tracking activities with an easy-to-use interface",
    ar: "نظام متكامل لإدارة المستخدمين وتتبع أنشطتهم بواجهة سهلة الاستخدام"
  },
  loginSuccess: {
    en: "Login successful",
    ar: "تم تسجيل الدخول بنجاح"
  },
  loadingData: {
    en: "Loading data...",
    ar: "جاري الآن جلب البيانات..."
  },
  error: {
    en: "Error",
    ar: "خطأ"
  },
  unexpectedError: {
    en: "Unexpected error",
    ar: "حدث خطأ غير متوقع"
  },
  loginError: {
    en: "Login error",
    ar: "حدث خطأ في تسجيل الدخول"
  },
  logoutSuccess: {
    en: "Successfully logged out",
    ar: "تم تسجيل الخروج بنجاح"
  },
  userDetails: {
    en: "User Details",
    ar: "تفاصيل المستخدم"
  },
  completeUserInfo: {
    en: "Complete user information",
    ar: "معلومات كاملة عن المستخدم"
  },
  name: {
    en: "Name",
    ar: "الاسم"
  },
  phone: {
    en: "Phone Number",
    ar: "رقم الهاتف"
  },
  activation: {
    en: "Activation",
    ar: "التفعيل"
  },
  renewUser: {
    en: "Renew User Account",
    ar: "تجديد حساب المستخدم"
  },
  chooseRenewalMonths: {
    en: "Choose the number of months to renew the account",
    ar: "اختر عدد الأشهر التي تود تجديد الحساب بها"
  },
  numberOfMonths: {
    en: "Number of Months",
    ar: "عدد الأشهر"
  },
  selectMonths: {
    en: "Select months",
    ar: "اختر عدد الأشهر"
  },
  threeMonths: {
    en: "3 Months",
    ar: "3 أشهر"
  },
  sixMonths: {
    en: "6 Months",
    ar: "6 أشهر"
  },
  nineMonths: {
    en: "9 Months",
    ar: "9 أشهر"
  },
  twelveMonths: {
    en: "12 Months",
    ar: "12 أشهر"
  },
  editUser: {
    en: "Edit User",
    ar: "تعديل المستخدم"
  },
  editUserDescription: {
    en: "Edit user information",
    ar: "قم بتعديل بيانات المستخدم"
  },
  activate: {
    en: "Activate",
    ar: "تفعيل"
  },
  block: {
    en: "Block",
    ar: "حظر"
  },
  saveChanges: {
    en: "Save Changes",
    ar: "حفظ التغييرات"
  },
  updateUserError: {
    en: "Failed to update user data",
    ar: "فشل في حفظ بيانات المستخدم"
  },
  addNewUser: {
    en: "Add New User",
    ar: "إضافة مستخدم جديد"
  },
  enterNewUserData: {
    en: "Enter new user information",
    ar: "أدخل بيانات المستخدم الجديد"
  },
  selectUserType: {
    en: "Select user type",
    ar: "اختر نوع المستخدم"
  },
  creditsLicense: {
    en: "Credits License",
    ar: "رخصة رصيد"
  },
  monthlyLicense: {
    en: "Monthly License",
    ar: "رخصة شهرية"
  },
  subscriptionPeriod: {
    en: "Subscription Period",
    ar: "مدة الاشتراك"
  },
  selectSubscriptionPeriod: {
    en: "Select subscription period",
    ar: "اختر مدة الاشتراك"
  },
  selectCountry: {
    en: "Select country",
    ar: "اختر الدولة"
  },
  addUserError: {
    en: "Failed to add user",
    ar: "فشل في إضافة المستخدم"
  },
  signupTitle: {
    en: "Create Account",
    ar: "إنشاء حساب"
  },
  signupDescription: {
    en: "Fill in the information to create your account",
    ar: "املأ المعلومات لإنشاء حسابك"
  },
  createAccountBtn: {
    en: "Create Account",
    ar: "إنشاء الحساب"
  },
  dashboardTitle: {
    en: "Dashboard",
    ar: "لوحة التحكم"
  },
  dashboardDescription: {
    en: "Overview of system activity",
    ar: "نظرة عامة على نشاط النظام"
  },
  totalUsers: {
    en: "Total Users",
    ar: "إجمالي المستخدمين"
  },
  activeUsers: {
    en: "Active Users",
    ar: "المستخدمين النشطين"
  },
  blockedUsers: {
    en: "Blocked Users",
    ar: "المستخدمين المحظورين"
  },
  settingsTitle: {
    en: "Settings",
    ar: "الإعدادات"
  },
  settingsDescription: {
    en: "Manage your system settings",
    ar: "إدارة إعدادات النظام"
  },
  language: {
    en: "Language",
    ar: "اللغة"
  },
  english: {
    en: "English",
    ar: "الإنجليزية"
  },
  arabic: {
    en: "Arabic",
    ar: "العربية"
  },
  theme: {
    en: "Theme",
    ar: "السمة"
  },
  light: {
    en: "Light",
    ar: "فاتح"
  },
  dark: {
    en: "Dark",
    ar: "داكن"
  },
  system: {
    en: "System",
    ar: "النظام"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  translations,
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Detect browser language, defaulting to English if not Arabic
  const detectLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'ar' ? 'ar' : 'en';
  };

  const [language, setLanguage] = useState<Language>(detectLanguage());
  const isRTL = language === 'ar';

  // Function to translate text
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    console.warn(`Translation key not found: ${key}`);
    return key;
  };

  // Apply RTL/LTR direction to document
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const value = {
    language,
    setLanguage,
    t,
    translations,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

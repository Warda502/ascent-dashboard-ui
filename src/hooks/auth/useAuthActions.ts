import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "../useLanguage";
import { AuthActions } from "./types";
import { validate2FAToken } from "@/integrations/supabase/client";
import { useAuthFix } from "./useAuthFix";

// Key for tracking login status
const LOGIN_IN_PROGRESS_KEY = "login_in_progress";
const TwoFactorVerifiedKey = "auth_2fa_verified";

export const useAuthActions = (): AuthActions => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { checkUserCredentials } = useAuthFix();

  const checkSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session check error:", error);
        return false;
      }
      
      if (!data.session) {
        console.log("No active session found in checkSession");
        return false;
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      if (data.session.expires_at && data.session.expires_at < currentTime) {
        console.log("Session expired");
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Error in checkSession:", err);
      return false;
    }
  }, []);

  const handleSessionExpired = useCallback(() => {
    console.log("Handling session expiration");
    
    localStorage.removeItem(TwoFactorVerifiedKey);
    localStorage.removeItem(LOGIN_IN_PROGRESS_KEY);
    
    if (window.location.pathname !== '/login') {
      toast(t("sessionExpired") || "انتهت صلاحية الجلسة", {
        description: t("pleaseLoginAgain") || "يرجى تسجيل الدخول مجددًا"
      });
      
      navigate('/login?sessionExpired=true');
    }
  }, [navigate, t]);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      
      localStorage.setItem(LOGIN_IN_PROGRESS_KEY, 'true');
      
      // Use fixed credential check
      const userData = await checkUserCredentials(email);
      
      if (userData) {
        // Check if user is blocked
        if (userData.block === 'Blocked') {
          toast(t("accountBlocked"), {
            description: t("accountBlockedDescription")
          });
          localStorage.removeItem(LOGIN_IN_PROGRESS_KEY);
          return false;
        }

        // Check if user has no credits (for regular users)
        if (userData.email_type && userData.email_type.toLowerCase() !== 'admin') {
          if (userData.credits) {
            const creditsValue = parseFloat(userData.credits.toString().replace(/"/g, ''));
            if (!isNaN(creditsValue) && creditsValue <= 0) {
              toast(t("noCreditsLeft"), {
                description: t("noCreditsLeftDescription")
              });
              localStorage.removeItem(LOGIN_IN_PROGRESS_KEY);
              return false;
            }
          }
        }
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        localStorage.removeItem(LOGIN_IN_PROGRESS_KEY);
        throw error;
      }
      
      console.log("Login successful via useAuthActions");
      
      // Only show success toast if 2FA is not required
      if (!userData?.two_factor_enabled) {
        toast(t("loginSuccess"), {
          description: t("welcomeBack")
        });
        
        localStorage.removeItem(LOGIN_IN_PROGRESS_KEY);
        navigate('/dashboard');
      }
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast(t("loginFailed"), {
        description: error instanceof Error ? error.message : t("unexpectedError")
      });
      return false;
    }
  };

  const verifyTwoFactor = async (userId: string, token: string) => {
    try {
      console.log("Verifying 2FA token for user:", userId, "Token:", token);
      
      const isValid = await validate2FAToken(userId, token);
      console.log("2FA validation result:", isValid);
      
      if (isValid) {
        localStorage.setItem(TwoFactorVerifiedKey, 'true');
        
        toast(t("loginSuccess") || "Login successful", {
          description: t("welcomeBack") || "Welcome back"
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 200);
      } else {
        localStorage.removeItem(TwoFactorVerifiedKey);
        
        toast(t("invalidOTP") || "Invalid verification code", {
          description: t("invalidOTPDescription") || "Please try again with the correct code"
        });
      }
      
      return isValid;
    } catch (error) {
      console.error("2FA verification error:", error);
      localStorage.removeItem(TwoFactorVerifiedKey);
      
      toast(t("verificationFailed") || "Verification failed", {
        description: error instanceof Error ? error.message : t("unexpectedError") || "An unexpected error occurred"
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      const isSessionValid = await checkSession();
      
      if (!isSessionValid) {
        console.log("No valid session found, cleaning up local state");
        
        localStorage.removeItem(TwoFactorVerifiedKey);
        localStorage.removeItem(LOGIN_IN_PROGRESS_KEY);
        
        navigate('/login?loggedOut=true');
        return true;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem(TwoFactorVerifiedKey); 
      localStorage.removeItem(LOGIN_IN_PROGRESS_KEY);
      
      toast(t("logoutSuccess"), {
        description: t("comeBackSoon")
      });
      
      navigate('/login?loggedOut=true');
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      toast(t("logoutFailed"), {
        description: error instanceof Error ? error.message : t("unexpectedError")
      });
      return false;
    }
  };

  return {
    login,
    logout,
    checkSession,
    handleSessionExpired,
    verifyTwoFactor
  };
};

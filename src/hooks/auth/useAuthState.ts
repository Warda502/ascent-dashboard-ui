import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser, UserRole, AuthState } from "./types";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { useAuthFix } from "./useAuthFix";

// Key for storing 2FA verification state in localStorage
const TwoFactorVerifiedKey = "auth_2fa_verified";

export const useAuthState = (): AuthState => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false);
  const [twoFactorVerified, setTwoFactorVerified] = useState<boolean>(() => {
    const stored = localStorage.getItem(TwoFactorVerifiedKey);
    return stored === 'true';
  });

  const { fetchUserDataWithoutRLS } = useAuthFix();

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      console.log("Fetching user data with fixed approach for ID:", userId);
      
      const userData = await fetchUserDataWithoutRLS(userId);
      
      if (!userData) {
        console.error("No user data returned from fixed fetch");
        return null;
      }

      // Check if user has 2FA enabled
      const hasTwoFactorEnabled = userData.twoFactorEnabled || false;
      setNeedsTwoFactor(hasTwoFactorEnabled);
      
      // Check if 2FA has been previously verified for this user
      const isVerified = localStorage.getItem(TwoFactorVerifiedKey) === 'true';
      console.log("2FA verification status from localStorage:", isVerified);
      
      if (hasTwoFactorEnabled) {
        setTwoFactorVerified(isVerified);
      } else {
        // No 2FA needed, so it's "verified" by default
        setTwoFactorVerified(true);
        localStorage.removeItem(TwoFactorVerifiedKey);
      }
      
      return userData;
    } catch (err) {
      console.error("Failed to fetch user data with fixed approach:", err);
      return null;
    }
  }, [fetchUserDataWithoutRLS]);

  // Method to mark 2FA as verified
  const setTwoFactorComplete = useCallback(() => {
    console.log("Marking 2FA as verified and storing in localStorage");
    setTwoFactorVerified(true);
    localStorage.setItem(TwoFactorVerifiedKey, 'true');
    setIsAuthenticated(true);
  }, []);

  // Method to clear 2FA verification (used on logout)
  const clearTwoFactorVerification = useCallback(() => {
    console.log("Clearing 2FA verification status");
    localStorage.removeItem(TwoFactorVerifiedKey);
    setTwoFactorVerified(false);
  }, []);

  const handleSession = useCallback(async (session: Session | null) => {
    if (!session) {
      console.log("No active session - clearing auth state");
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
      setNeedsTwoFactor(false);
      setTwoFactorVerified(false);
      localStorage.removeItem(TwoFactorVerifiedKey);
      return;
    }
    
    console.log("Processing session for:", session.user.email);
    
    // Fetch user data with fixed approach
    setTimeout(async () => {
      const userData = await fetchUserData(session.user.id);
      if (userData) {
        console.log("Setting user data:", userData);
        setUser(userData as AuthUser);
        setRole(userData.role as UserRole);
        
        const requiresTwoFactor = userData.twoFactorEnabled || false;
        console.log("User requires 2FA:", requiresTwoFactor);
        
        const isVerified = localStorage.getItem(TwoFactorVerifiedKey) === 'true';
        console.log("Is 2FA already verified (localStorage):", isVerified);
        
        const isFullyAuthenticated = !requiresTwoFactor || isVerified;
        console.log("Setting authentication state:", {
          isAuthenticated: isFullyAuthenticated,
          needsTwoFactor: requiresTwoFactor,
          twoFactorVerified: isVerified
        });
        
        setIsAuthenticated(isFullyAuthenticated);
      } else {
        console.error("Failed to fetch user data after login");
        setIsAuthenticated(false);
      }
    }, 500);
  }, [fetchUserData]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const setupAuthListener = async () => {
      try {
        console.log("Setting up auth listener");
        setLoading(true);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event: AuthChangeEvent, session) => {
            console.log("Auth state changed:", event, "Session exists:", !!session);
            
            switch(event) {
              case 'SIGNED_OUT':
                setRole(null);
                setUser(null);
                setIsAuthenticated(false);
                setNeedsTwoFactor(false);
                localStorage.removeItem(TwoFactorVerifiedKey);
                setTwoFactorVerified(false);
                break;
              
              case 'SIGNED_IN':
              case 'TOKEN_REFRESHED':
              case 'USER_UPDATED':
              case 'INITIAL_SESSION':
                if (session) {
                  setTimeout(() => {
                    handleSession(session);
                  }, 0);
                }
                break;
            }
          }
        );

        unsubscribe = () => {
          subscription.unsubscribe();
        };

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
        } else {
          console.log("Initial session check:", session ? "Session exists" : "No session");
          await handleSession(session);
        }
        
      } catch (err) {
        console.error("Setup auth listener error:", err);
      } finally {
        setLoading(false);
        setSessionChecked(true);
      }
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [handleSession]);

  // Sync isAuthenticated whenever 2FA status changes
  useEffect(() => {
    if (user) {
      const isFullyAuthenticated = !needsTwoFactor || twoFactorVerified;
      console.log("Updating authentication state based on 2FA:", {
        needsTwoFactor,
        twoFactorVerified,
        isFullyAuthenticated
      });
      setIsAuthenticated(isFullyAuthenticated);
    }
  }, [needsTwoFactor, twoFactorVerified, user]);

  return {
    loading,
    role,
    user,
    isAuthenticated,
    isAdmin: role === 'admin',
    sessionChecked,
    needsTwoFactor,
    twoFactorVerified,
    setTwoFactorComplete,
    clearTwoFactorVerification
  };
};

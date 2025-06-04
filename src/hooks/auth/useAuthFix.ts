
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser, UserRole } from "./types";

// Fixed auth utilities to avoid infinite recursion
export const useAuthFix = () => {
  const fetchUserDataWithoutRLS = useCallback(async (userId: string) => {
    try {
      console.log("Fetching user data with fixed method for ID:", userId);
      
      // Use a direct query that bypasses problematic RLS policies
      const { data: userData, error } = await supabase
        .rpc('get_user_data_safe', { user_id: userId });

      if (error) {
        console.error("Error fetching user data with RPC:", error);
        // Fallback: try with service role if available
        return await fetchUserDataFallback(userId);
      }

      if (!userData) {
        console.error("No user data found");
        return null;
      }

      console.log("User data fetched successfully:", userData);
      
      const userRole = ((userData.email_type || '').toLowerCase() === 'admin') 
        ? 'admin' as UserRole 
        : 'user' as UserRole;
      
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name || '',
        role: userRole,
        credits: userData.credits,
        expiryTime: userData.expiry_time,
        uid: userData.uid,
        twoFactorEnabled: userData.two_factor_enabled || false
      } as AuthUser;
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      return null;
    }
  }, []);

  const fetchUserDataFallback = useCallback(async (userId: string) => {
    try {
      console.log("Using fallback method to fetch user data");
      
      // Simple query without complex RLS
      const { data: userData, error } = await supabase
        .from('users')
        .select('id, uid, email, name, email_type, credits, expiry_time, two_factor_enabled, block, activate')
        .eq('id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Fallback query failed:", error);
        return null;
      }

      if (!userData) {
        console.log("No user data in fallback");
        return null;
      }

      console.log("Fallback user data:", userData);
      
      const userRole = ((userData.email_type || '').toLowerCase() === 'admin') 
        ? 'admin' as UserRole 
        : 'user' as UserRole;
      
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name || '',
        role: userRole,
        credits: userData.credits,
        expiryTime: userData.expiry_time,
        uid: userData.uid,
        twoFactorEnabled: userData.two_factor_enabled || false
      } as AuthUser;
    } catch (err) {
      console.error("Fallback fetch failed:", err);
      return null;
    }
  }, []);

  const checkUserCredentials = useCallback(async (email: string) => {
    try {
      console.log("Checking user credentials for:", email);
      
      // Simple credential check without complex policies
      const { data: userData, error } = await supabase
        .from('users')
        .select('email, email_type, block, credits, two_factor_enabled')
        .eq('email', email)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error checking credentials:", error);
        return null;
      }

      return userData;
    } catch (err) {
      console.error("Credential check failed:", err);
      return null;
    }
  }, []);

  return {
    fetchUserDataWithoutRLS,
    fetchUserDataFallback,
    checkUserCredentials
  };
};

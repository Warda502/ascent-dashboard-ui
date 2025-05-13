
// Import directly from React
import { useToast as useToastHook, toast as toastFunction } from "@/hooks/use-toast";

// Re-export the hooks
export const useToast = useToastHook;
export const toast = toastFunction;

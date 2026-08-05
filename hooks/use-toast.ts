"use client";

import { useMemo } from "react";
import { useToast as useToastOriginal } from "@/components/ui/use-toast";

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info" | "loading";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToastFn = (options: ToastOptions) => { id: string; dismiss: () => void; update: (props: any) => void };

export function useToast() {
  const toast = useToastOriginal();

  // Core toast function with defaults
  const showToast: ToastFn = (options: ToastOptions) => {
    const variant = options.variant === "success" || options.variant === "warning" || options.variant === "info" || options.variant === "loading"
      ? "default" as const
      : (options.variant as "default" | "destructive") || "default";
    return toast.toast({
      duration: 5000,
      ...options,
      variant,
    });
  };

  // Helper methods for different toast types
  const helpers = {
    success: (title: string, description?: string) =>
      showToast({ title, description, variant: "success" }),
    
    error: (title: string, description?: string) =>
      showToast({ title, description, variant: "destructive" }),
    
    warning: (title: string, description?: string) =>
      showToast({ title, description, variant: "warning" }),
    
    info: (title: string, description?: string) =>
      showToast({ title, description, variant: "info" }),
    
    loading: (title: string, description?: string) =>
      showToast({ title, description, variant: "loading" }),
    
    // Promise-based toast for async operations
    promise: async <T>(
      promise: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: Error) => string);
      }
    ) => {
      const loadingToast = showToast({ 
        title: options.loading, 
        variant: "loading",
        duration: Infinity, // Keep loading until resolved
      });

      try {
        const result = await promise;
        toast.dismiss(loadingToast.id);
        
        const successMessage = typeof options.success === "function"
          ? options.success(result)
          : options.success;
        
        showToast({ title: successMessage, variant: "success" });
        return result;
      } catch (error) {
        toast.dismiss(loadingToast.id);
        
        const errorMessage = typeof options.error === "function"
          ? options.error(error as Error)
          : options.error;
        
        showToast({ title: errorMessage, variant: "destructive" });
        throw error;
      }
    },
  };

  return useMemo(() => ({
    ...toast,
    ...helpers,
    toast: showToast,
  }), [toast]);
}


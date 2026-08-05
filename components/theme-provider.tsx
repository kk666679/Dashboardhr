"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { tenantBrandCssVariables, type TenantBrandOverrides } from "@/styles/design-tokens";

export type Theme = "light" | "dark" | "system" | "contrast";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark" | "contrast";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "dark",
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  /** Optional tenant-specific semantic brand overrides. */
  tenantBrand?: TenantBrandOverrides;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = true,
  tenantBrand,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark" | "contrast">(
    defaultTheme === "system" ? "dark" : defaultTheme,
  );

  // Read persisted theme on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored === "light" || stored === "dark" || stored === "system" || stored === "contrast") {
        setThemeState(stored);
      }
    } catch {}
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (t: Theme) => {
      const resolved = t === "system" ? (mq.matches ? "dark" : "light") : t;
      setResolvedTheme(resolved);

      if (disableTransitionOnChange) {
        root.style.setProperty("transition", "none");
        requestAnimationFrame(() => root.style.removeProperty("transition"));
      }

      root.classList.remove("light", "dark", "contrast");
      root.classList.add(resolved);
    };

    apply(theme);

    if (enableSystem && theme === "system") {
      const handler = () => apply("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme, disableTransitionOnChange, enableSystem]);

  useEffect(() => {
    const root = document.documentElement;
    const variables = tenantBrandCssVariables(tenantBrand ?? {});
    Object.entries(variables).forEach(([name, value]) => root.style.setProperty(name, value));
    return () => Object.keys(variables).forEach((name) => root.style.removeProperty(name));
  }, [tenantBrand]);

  const setTheme = (t: Theme) => {
    try {
      localStorage.setItem("theme", t);
    } catch {}
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Typed design-token contract for TypeScript consumers (charts, canvas, and
 * dynamically themed components). CSS tokens in `styles/theme.css` expose the
 * same semantic names to stylesheets.
 */
export const designTokens = {
  font: { sans: "Inter", mono: "JetBrains Mono" },
  typography: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30, "4xl": 40, "5xl": 48 },
  spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80, 24: 96 },
  duration: { instant: 0, fast: 150, base: 200, slow: 400, deliberate: 500 },
  easing: { standard: "cubic-bezier(0.2, 0, 0, 1)", out: "cubic-bezier(0, 0, 0.2, 1)", inOut: "cubic-bezier(0.4, 0, 0.2, 1)" },
  elevation: { xs: "var(--shadow-xs)", sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)", xl: "var(--shadow-xl)", "2xl": "var(--shadow-2xl)" },
  zIndex: { base: 0, raised: 10, dropdown: 100, sticky: 200, overlay: 300, modal: 400, popover: 500, toast: 600, tooltip: 700 },
} as const;

export type DesignTokens = typeof designTokens;
export type TenantBrandOverrides = Partial<Record<"brand" | "brandHover" | "brandActive" | "brandForeground", string>>;

export function tenantBrandCssVariables(brand: TenantBrandOverrides): Record<string, string> {
  return {
    ...(brand.brand && { "--brand": brand.brand }),
    ...(brand.brandHover && { "--brand-hover": brand.brandHover }),
    ...(brand.brandActive && { "--brand-active": brand.brandActive }),
    ...(brand.brandForeground && { "--brand-foreground": brand.brandForeground }),
  };
}

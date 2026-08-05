// Re-export ThemeProvider from the canonical location so both
// app/[locale]/layout.tsx and components can import from either path.
export { ThemeProvider, useTheme } from "@/components/theme-provider";

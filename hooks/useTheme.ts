"use client";

import { useTheme as useThemeContext } from "@/app/providers/ThemeProvider";

export function useTheme() {
  return useThemeContext();
}

"use client";

import { Moon, Sun, Monitor, Contrast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const icons = { dark: Sun, light: Moon, system: Monitor, contrast: Contrast };
const labels = { dark: "Light mode", light: "High contrast mode", contrast: "System theme", system: "Dark mode" };

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const reduced = useReducedMotion() ?? false;

  const nextTheme = (): "dark" | "light" | "contrast" | "system" => {
    // cycle: system → dark → light → contrast → system
    if (theme === "system") return "dark";
    if (theme === "dark") return "light";
    if (theme === "light") return "contrast";
    return "system";
  };

  const currentKey = (theme === "system" ? resolvedTheme : theme) ?? "light";
  const Icon = icons[currentKey as keyof typeof icons] ?? Moon;
  const label = labels[theme as keyof typeof labels] ?? "Toggle theme";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(nextTheme())}
      aria-label={label}
      title={label}
      className="relative overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={currentKey}
          initial={reduced ? undefined : { opacity: 0, rotate: -30, scale: 0.7 }}
          animate={reduced ? undefined : { opacity: 1, rotate: 0, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0, rotate: 30, scale: 0.7 }}
          transition={reduced ? undefined : { duration: 0.22, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

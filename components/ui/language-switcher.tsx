"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { changeLanguage, currentLanguage, languages } = useTranslation();
  const current = languages.find((l) => l.code === currentLanguage) ?? languages[0];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering a placeholder on the server
  // and initial client render. The LanguageDetector plugin (i18next-browser-languagedetector)
  // may resolve a different locale on the client (e.g. from cookie/localStorage/navigator),
  // which would cause the server-rendered text to differ from the client.
  // Once mounted, the full localized content is rendered safely.
  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="gap-2">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">&nbsp;</span>
        <span className="sm:hidden">&nbsp;</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {current.flag} {current.name}
          </span>
          <span className="sm:hidden">{current.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={currentLanguage === lang.code ? "bg-muted font-medium" : ""}
          >
            {lang.flag} {lang.name}
            {currentLanguage === lang.code && " ✓"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

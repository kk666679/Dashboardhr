"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = "Search…",
  className,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch?.(value);
    },
    [onSearch],
  );

  return (
    <div className={cn("relative w-full", className)}>
      <SearchIcon
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[var(--foreground-subtle)]"
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className={cn(
          "h-8 pl-8 pr-3 text-sm",
          "bg-[var(--surface-1)] border-[var(--border)]",
          "placeholder:text-[var(--foreground-subtle)]",
          "focus-visible:ring-1 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand)]",
          "transition-[border-color,box-shadow] duration-150",
        )}
      />
    </div>
  );
}

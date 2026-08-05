"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface EnhancedMermaidProps {
  chart: string;
  className?: string;
}

mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
});

export function EnhancedMermaid({ chart, className }: EnhancedMermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.run({
        nodes: [containerRef.current],
      });
    }
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: chart }}
    />
  );
}

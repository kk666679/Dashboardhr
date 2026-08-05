"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

export default function Marquee({
  children,
  duration = 30,
  className,
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={
          isInView
            ? {
                x: ["0%", "-50%"],
              }
            : { x: "0%" }
        }
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}


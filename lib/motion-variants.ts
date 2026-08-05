import type { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

export const cardHoverVariants: Variants = {
  hover: {
    scale: 1.02,
    y: -5,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

export const floatingVariants: Variants = {
  float: {
    y: [-10, 10, -10],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

export const scanVariants: Variants = {
  scan: {
    rotate: [0, 360],
    transition: { duration: 3, repeat: Infinity, ease: "linear" },
  },
};

export const radarVariants: Variants = {
  scan: {
    rotate: [0, 360],
    transition: { duration: 4, repeat: Infinity, ease: "linear" },
  },
};

export const slideUpVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

"use client";

import React, { ReactNode } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  children: ReactNode;
  id?: string;
  gradient?: string;
  blur?: string;
  className?: string;
  animation?: 'scale' | 'fade' | 'slide' | 'none';
  delay?: number;
}

export function GlassmorphicCard({
  children,
  gradient = 'from-white/20 to-white/10',
  blur = 'backdrop-blur-md',
  className = '',
  animation = 'fade',
  delay = 0,
}: GlassmorphicCardProps) {
  const variants = {
    scale: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { type: 'spring', stiffness: 300, damping: 30, delay },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5, delay },
    },
    slide: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.5, delay },
    },
  };

  return (
    <motion.div
      variants={variants[animation] || variants.fade}
      initial="initial"
      animate="animate"
      className={cn(
        `bg-gradient-to-br ${gradient} border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 ${blur}`,
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className = '' }: StaggerContainerProps) {
  return (
    <LayoutGroup>
      <div className={cn('grid gap-6', className)}>
        {children}
      </div>
    </LayoutGroup>
  );
}

interface StaggerItemProps {
  children: ReactNode;
}

export function StaggerItem({ children }: StaggerItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

interface SlideInProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
}: SlideInProps) {
  const variants = {
    up: { initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    down: { initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    left: { initial: { x: -50, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    right: { initial: { x: 50, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  };

  return (
    <motion.div
      variants={variants[direction]}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

interface GlassButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  asChild?: boolean;
  size?: string;
}

export function GlassButton({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
}: GlassButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-white/20 hover:from-purple-600 hover:to-pink-600',
    secondary: 'bg-white/10 text-white border-white/30 hover:bg-white/20',
    outline: 'bg-transparent text-white border-2 border-white/30 hover:bg-white/10',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-white/20 hover:from-red-600 hover:to-rose-600',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variants[variant], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

interface GlassInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
}

export function GlassInput({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  icon,
  className = '',
}: GlassInputProps) {
  return (
    <div className={cn('relative group', className)}>
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300',
          'hover:bg-white/20'
        )}
      />
    </div>
  );
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

export function AnimatedCounter({ value, duration = 2 }: AnimatedCounterProps) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration * 60); // 60 FPS

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}


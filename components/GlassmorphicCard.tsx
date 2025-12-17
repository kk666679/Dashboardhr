import React from 'react';
import { motion } from "./MotionWrapper";

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: string;
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  delay?: number;
  onClick?: () => void;
  hover?: boolean;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className = '',
  blur = 'md',
  gradient = 'from-white/70 to-white/50',
  animation = 'fade',
  delay = 0,
  onClick,
  hover = true,
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5, delay },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay, type: 'spring', stiffness: 100 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5, delay, type: 'spring', stiffness: 100 },
    },
    none: {
      initial: {},
      animate: {},
      transition: {},
    },
  };

  const hoverAnimation = hover
    ? {
        whileHover: { scale: 1.02, y: -5 },
        whileTap: { scale: 0.98 },
      }
    : {};

  return (
    <motion.div
      className={`
        bg-gradient-to-br ${gradient}
        dark:from-gray-800/70 dark:to-gray-700/50
        ${blurClasses[blur]}
        border border-white/20 dark:border-gray-600/30
        shadow-xl shadow-purple-500/10 dark:shadow-purple-500/5
        rounded-2xl
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      transition={{ duration: 0.5, delay: 0.1 }}
      {...hoverAnimation}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(value * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
  duration = 3,
  yOffset = 10,
}) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-yOffset, yOffset, -yOffset] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

interface PulseElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const PulseElement: React.FC<PulseElementProps> = ({
  children,
  delay = 0,
  duration = 2,
}) => {
  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  delay = 0,
}) => {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
};

interface RotateInProps {
  children: React.ReactNode;
  delay?: number;
}

export const RotateIn: React.FC<RotateInProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
};

export const GlassButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const variants = {
    primary: 'from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90',
    secondary: 'from-blue-500/80 to-cyan-500/80 hover:from-blue-600/90 hover:to-cyan-600/90',
    success: 'from-green-500/80 to-emerald-500/80 hover:from-green-600/90 hover:to-emerald-600/90',
    danger: 'from-red-500/80 to-rose-500/80 hover:from-red-600/90 hover:to-rose-600/90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      className={`
        bg-gradient-to-r ${variants[variant]}
        backdrop-blur-md
        text-white
        rounded-lg
        font-semibold
        border border-white/20
        shadow-lg
        ${sizes[size]}
        ${className}
      `}
      whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export const GlassInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  className?: string;
}> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  icon,
  className = '',
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full
          bg-white/10
          backdrop-blur-md
          border border-white/20
          rounded-lg
          px-4 py-3
          ${icon ? 'pl-10' : ''}
          text-gray-900
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-purple-500/50
          focus:border-purple-500/50
          transition-all
        `}
      />
    </motion.div>
  );
};

export const ParallaxCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};
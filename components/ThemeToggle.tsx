import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 hover:shadow-lg"
      aria-label="Toggle theme"
    >
      {/* Toggle Switch */}
      <motion.div
        className="w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center"
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? 90 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <Sun className="w-4 h-4 text-yellow-500" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : -90,
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <Moon className="w-4 h-4 text-blue-400" />
        </motion.div>
      </motion.div>

      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun className="w-3 h-3 text-yellow-600 dark:text-gray-500 transition-colors duration-300" />
        <Moon className="w-3 h-3 text-gray-400 dark:text-blue-400 transition-colors duration-300" />
      </div>
    </button>
  );
}

export function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-3 rounded-xl transition-all duration-300 ${
        isDark
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
      }`}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-5 h-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : -180,
          scale: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5" />
      </motion.div>
      <div className="w-5 h-5 opacity-0" /> {/* Spacer */}
    </motion.button>
  );
}

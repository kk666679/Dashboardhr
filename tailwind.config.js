/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
    './frontend/**/*.{ts,tsx}',
    './styles/**/*.{css}'
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Sidebar colors
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Chart colors
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "DM Sans", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        mono: ["var(--font-mono)", "Space Mono", "monospace"],
      },
      fontSize: {
        base: "var(--font-size)",
      },
      fontWeight: {
        normal: "var(--font-weight-normal)",
        medium: "var(--font-weight-medium)",
      },
      spacing: {
        "spacing": "var(--spacing)",
      },
      letterSpacing: {
        normal: "var(--tracking-normal)",
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        "xs": "var(--shadow-xs)",
        "sm": "var(--shadow-sm)",
        "DEFAULT": "var(--shadow)",
        "md": "var(--shadow-md)",
        "lg": "var(--shadow-lg)",
        "xl": "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        // Neo-brutalism shadows
        "neo": "4px 4px 0px 0px rgba(0, 0, 0, 1)",
        "neo-sm": "2px 2px 0px 0px rgba(0, 0, 0, 1)",
        "neo-lg": "6px 6px 0px 0px rgba(0, 0, 0, 1)",
        "neo-xl": "8px 8px 0px 0px rgba(0, 0, 0, 1)",
      },
      borderWidth: {
        "neo": "3px",
        "neo-sm": "2px", 
        "neo-lg": "4px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
      screens: {
        'xs': '475px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    // Custom plugin for neo-brutalism utilities
    function({ addUtilities, theme }) {
      const neoUtilities = {
        '.neo-shadow': {
          boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        },
        '.neo-shadow-sm': {
          boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 1)',
        },
        '.neo-shadow-lg': {
          boxShadow: '6px 6px 0px 0px rgba(0, 0, 0, 1)',
        },
        '.neo-shadow-xl': {
          boxShadow: '8px 8px 0px 0px rgba(0, 0, 0, 1)',
        },
        '.neo-border': {
          border: '3px solid black',
        },
        '.neo-border-sm': {
          border: '2px solid black',
        },
        '.neo-border-lg': {
          border: '4px solid black',
        },
      };
      
      addUtilities(neoUtilities);
    },
  ],
}

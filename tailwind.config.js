/** @type {import('tailwindcss').Config} */
/**
 * Soft UI 토큰 (구 neon #1CCF60 config 폐기).
 * .js 를 유지 — Next/PostCSS가 .ts 보다 .js 를 우선 로드하던 경로와 맞춤.
 * RGB 채널로 bg-ink/40 · bg-surface-card/95 지원.
 */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "rgb(var(--cp-brand-rgb) / <alpha-value>)",
          hover: "rgb(var(--cp-brand-hover-rgb) / <alpha-value>)",
          muted: "rgb(var(--cp-brand-muted-rgb) / <alpha-value>)",
          ink: "rgb(var(--cp-brand-ink-rgb) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--cp-ink-rgb) / <alpha-value>)",
          secondary: "rgb(var(--cp-ink-secondary-rgb) / <alpha-value>)",
          muted: "rgb(var(--cp-ink-muted-rgb) / <alpha-value>)",
          subtle: "rgb(var(--cp-ink-subtle-rgb) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--cp-surface-rgb) / <alpha-value>)",
          elevated: "rgb(var(--cp-surface-elevated-rgb) / <alpha-value>)",
          card: "rgb(var(--cp-surface-card-rgb) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--cp-border-rgb) / <alpha-value>)",
          strong: "rgb(var(--cp-border-strong-rgb) / <alpha-value>)",
        },
        danger: "rgb(var(--cp-danger-rgb) / <alpha-value>)",
        warning: "rgb(var(--cp-warning-rgb) / <alpha-value>)",
        primary: {
          50: "#e6f0ea",
          100: "#d0e4da",
          200: "#a8cdb8",
          300: "#7bb396",
          400: "#559f7d",
          500: "#3d8b6e",
          600: "#2f6f57",
          700: "#275c48",
          800: "#1e4d3a",
          900: "#16382b",
        },
        gray: {
          50: "#efede8",
          100: "#eeede8",
          200: "#e6e5e0",
          300: "#d2d1cb",
          400: "#9a9a92",
          500: "#6f6f67",
          600: "#57574f",
          700: "#3f3f39",
          800: "#2a2a26",
          900: "#1f1f1d",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      borderRadius: {
        sm: "var(--cp-radius-sm)",
        md: "var(--cp-radius-md)",
        lg: "var(--cp-radius-lg)",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "var(--cp-elevation-raised)",
        float: "var(--cp-elevation-floating)",
        overlay: "var(--cp-elevation-overlay)",
        raised: "var(--cp-elevation-raised)",
        floating: "var(--cp-elevation-floating)",
      },
      transitionDuration: {
        cp: "180ms",
        "cp-quick": "120ms",
        "cp-normal": "180ms",
        "cp-moderate": "220ms",
      },
      transitionTimingFunction: {
        cp: "cubic-bezier(0.16, 1, 0.3, 1)",
        "cp-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "cp-in": "cubic-bezier(0.4, 0, 1, 1)",
        "cp-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

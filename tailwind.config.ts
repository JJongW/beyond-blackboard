import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 크레파스 tokens (accent ~10%)
        brand: {
          DEFAULT: "var(--cp-brand)",
          hover: "var(--cp-brand-hover)",
          muted: "var(--cp-brand-muted)",
          ink: "var(--cp-brand-ink)",
        },
        ink: {
          DEFAULT: "var(--cp-ink)",
          secondary: "var(--cp-ink-secondary)",
          muted: "var(--cp-ink-muted)",
          subtle: "var(--cp-ink-subtle)",
        },
        surface: {
          DEFAULT: "var(--cp-surface)",
          elevated: "var(--cp-surface-elevated)",
          card: "var(--cp-surface-card)",
        },
        line: {
          DEFAULT: "var(--cp-border)",
          strong: "var(--cp-border-strong)",
        },
        danger: "var(--cp-danger)",
        warning: "var(--cp-warning)",
        // primary-* 호환 → 세이지 에메랄드 (형광 #1CCF60 폐기)
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
          50: "#f6f5f2",
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
        "18": "4.5rem",
        "88": "22rem",
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

export default config;

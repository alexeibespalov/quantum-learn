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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f0f7fa",
          100: "#dbeaf0",
          200: "#bcdbe6",
          300: "#8fc3d6",
          400: "#6393a6", // Wilderness 1
          500: "#46788b",
          600: "#3a6173",
          700: "#32505f",
          800: "#2d444f",
          900: "#283a42",
          950: "#18252b",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#fcf5f3",
          100: "#f8eae6",
          200: "#f2d2c7",
          300: "#eab09d",
          400: "#bf785e", // Wilderness 2
          500: "#b85d3f",
          600: "#a64a2e",
          700: "#8a3b25",
          800: "#703223",
          900: "#5b2b22",
          950: "#31130e",
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
        // Custom mapping for specific "Wilderness" usage
        wilderness: {
          teal: "#6393A6",
          terracotta: "#BF785E",
          peach: "#F2CBBD",
          rust: "#A65B4B",
          maroon: "#733B36",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
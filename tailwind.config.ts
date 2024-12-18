import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";
import fluid, { extract, screens, fontSize } from "fluid-tailwind";

const { fontFamily } = require("tailwindcss/defaultTheme");
const config = withUt({
  darkMode: ["class"],
  content: {
    files: [
      "./pages/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./app/**/*.{ts,tsx}",
      "./src/**/*.{ts,tsx}",
    ],
    extract,
  },
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      ...screens,
      smaller: "460px",
    },
    fontSize,
    extend: {
      boxShadow: {
        "blue-glow": "0 0 20px 12px rgba(0, 123, 255, 0.8)",
        "blue-glow-bigger": "0 0 30px 25px rgba(0, 123, 255, 0.8)",
        "blue-glow-biggest": "0 0 60px 45px rgba(0, 123, 255, 0.8)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          ["dark-blue"]: "var(--navy-blue)",
          ["light-blue"]: "var(--brandeis-blue)",
          purple: "var(--lavander-indigo)",
          muted: "var(--alice-blue)",
        },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      backgroundImage: {
        "search-filter": "url('/assets/hero-search-bg-image.jpg')",
      },
      screens: {
        xs: "20rem",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    fluid,
  ],
}) satisfies Config;

export default config;

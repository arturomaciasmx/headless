import { plugin } from "postcss";
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: {
            opacity: "1",
          },
        },
        blink: {
          "0%": { opacity: "0.2" },
          "20%": { opacity: "1" },
          "100%": { opacity: "0.2" },
        },
      },
      animation: {
        adeIn: "fadeIn 0.3s easy-in-out",
        blink: "blink 1.4s both infinite",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    // @ts-expect-error types
    plugin((matchUtilities, theme) => {
      matchUtilities(
        {
          // @ts-expect-error types
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            };
          },
        },
        {
          values: theme("transitionDelay"),
        }
      );
    }),
  ],
} satisfies Config;

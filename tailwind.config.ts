import type { Config } from "tailwindcss";
import plugin from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["var(--font-geist-sans)"],
    },
    keyframes: {
      fadeIn: {
        from: { opacity: "0" },
        to: { opacity: "1" },
      },
    },
    blink: {
      "0%": { opacity: "0.2" },
      "20%": { opacity: "1" },
      "100%": { opacity: "0.2" },
    },
    animation: {
      fadeIn: "fadeIn 0.3s ease-in-out",
      blink: "blink 1.4s both infinite",
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    //@ts-expect-error type
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          //@ts-expect-error type
          "animation-delay": (value) => {
            return {
              "animation-delaly": value,
            };
          },
        },
        {
          values: theme("transition-delay"),
        }
      );
    }),
  ],
} satisfies Config;

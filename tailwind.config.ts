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
        bio: {
          green: "#0b6b3a",
          "green-hover": "#07572f",
          "green-2": "#16824a",
          "green-soft": "#e9f5ec",
          cream: "#f8faf4",
          ink: "#132019",
          muted: "#68756d",
          line: "#e2e9e3",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-thai)", "sans-serif"],
      },
      boxShadow: {
        bio: "0 18px 50px rgba(31, 66, 43, 0.10)",
        "bio-btn": "0 10px 24px rgba(11, 107, 58, 0.18)",
        "bio-light": "0 10px 30px rgba(27, 58, 37, 0.10)",
        "bio-card": "0 8px 16px rgba(35, 64, 43, 0.1)",
        "bio-tablet": "0 25px 60px rgba(24, 46, 31, 0.25)",
        "bio-modal": "0 30px 80px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;

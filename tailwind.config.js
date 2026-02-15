/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warmer, softer dark theme
        bg: "#18181B", // Zinc 950
        surface: "#27272A", // Zinc 800
        text: "#F4F4F5", // Zinc 100
        muted: "#A1A1AA", // Zinc 400
        border: "#3F3F46", // Zinc 700

        // Natural accents
        primary: "#2DD4BF", // Teal 400 (Research/Tech)
        secondary: "#FB923C", // Orange 400 (Warmth/Human)
        accent: "#8B5CF6", // Violet 500 (Creative)
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Lora"', 'serif'], // For headings
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')",
      }
    },
  },
  plugins: [],
}

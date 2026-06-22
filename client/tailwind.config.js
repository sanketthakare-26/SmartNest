/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0A0E17',
          card: '#121A2C',
          border: '#1E293B',
          muted: '#64748B',
        },
        primary: {
          DEFAULT: '#06B6D4', // Cyan
          hover: '#0891B2',
          light: '#22D3EE',
        },
        secondary: {
          DEFAULT: '#6366F1', // Indigo
          hover: '#4F46E5',
          light: '#818CF8',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'glass-hover': '0 8px 32px 0 rgba(6, 182, 212, 0.15)',
      }
    },
  },
  plugins: [],
}

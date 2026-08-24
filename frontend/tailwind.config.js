/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          dark: '#0a0e27',
          surface: '#1a1f3a',
          accent: '#00ff88',
          error: '#ff3366',
          warning: '#ffaa00',
          success: '#00ff88',
          primary: '#00d4ff',
        },
      },
      animation: {
        pulse_slow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        pulse_fast: 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
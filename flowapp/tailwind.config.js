/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#f0f5ff',
          100: '#d0e4f8',
          200: '#85b7eb',
          300: '#3b82d4',
          400: '#1a4a8c',
          500: '#0a2a5c',
          600: '#06183a',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

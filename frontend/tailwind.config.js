/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          50: '#fdfbf7',
          100: '#f7f2e9',
          200: '#eee3d0',
          300: '#e0cdae',
          400: '#cfb186',
          500: '#bc9462',
          600: '#a37a4d',
          700: '#845f3c',
          800: '#5e432b',
          900: '#3e2a1b',
          950: '#23150d',
        },
        matcha: {
          50: '#f2fbf4',
          100: '#e1f6e6',
          500: '#10b981',
          700: '#047857',
          800: '#065f46'
        }
      }
    },
  },
  plugins: [],
}

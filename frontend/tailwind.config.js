/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'dark-purple': '#261d7b',
        'light-purple': '#b9bcd7',
      },
    },
  },
  plugins: [],
};

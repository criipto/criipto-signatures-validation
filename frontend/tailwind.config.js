/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      backgroundColor: {
        'dark-purple': '#261d7b',
        'light-purple': '#edeefb',
        'bright-purple': '#5f4fec',
        'light-orange': '#e3a48b',
      },
    },
  },
  plugins: [],
};

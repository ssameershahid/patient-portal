import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#E8F0E8',
          100: '#D4DFD2',
          200: '#C1D5C3',
          300: '#8BAF8E',
          400: '#6B9C72',
          500: '#4A7C59',
          600: '#3A5A3E',
          700: '#2C3E2D',
          800: '#1E2B20',
          900: '#111A12',
        },
        warm: {
          50: '#FDF8F0',
          100: '#FAF0E4',
          200: '#F0D8B8',
          300: '#DDB580',
          400: '#D4A06A',
          500: '#C4884D',
          600: '#B47B42',
          700: '#9A6A3A',
          800: '#6B4A28',
          900: '#3D2A16',
        },
        cream: {
          50: '#FDFAF5',
          100: '#FAF6EF',
          200: '#F8EEE2',
          300: '#EBE1D4',
          400: '#E8E2D8',
          500: '#D4CFC7',
          600: '#ADA89E',
          700: '#8B8578',
          800: '#5A5549',
          900: '#3D3730',
        },
        error: {
          DEFAULT: '#C45D4D',
          light: '#FEF2F0',
        },
        info: {
          DEFAULT: '#4A7C8E',
          light: '#EDF5F8',
        },
      },
      fontFamily: {
        heading: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'pill': '999px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

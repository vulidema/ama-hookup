import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f5',
          100: '#fbf1eb',
          200: '#f5dfd1',
          300: '#efcdb7',
          400: '#e9bb9d',
          500: '#e3a983',
          600: '#dd9769',
          700: '#d7854f',
          800: '#d17335',
          900: '#cb611b',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#ebf0f6',
          200: '#d7e1ec',
          300: '#c3d2e3',
          400: '#afc3d9',
          500: '#9bb4cf',
          600: '#87a5c5',
          700: '#7396bb',
          800: '#5f87b1',
          900: '#4b78a7',
        },
        clay: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#ede8e1',
          300: '#e5ddd3',
          400: '#ddd2c6',
          500: '#d5c7b8',
          600: '#cdbbaa',
          700: '#c5af9c',
          800: '#bda38e',
          900: '#b59780',
        },
        cream: '#fdf8f3',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'slide-in-up': 'slideInUp 0.3s ease-out',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        slideInUp: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
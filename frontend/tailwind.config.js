/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eefdf4',
          100: '#d7f9e5',
          200: '#b2f2ce',
          300: '#79e6ad',
          400: '#3fd186',
          500: '#18b865',
          600: '#0d9650',
          700: '#0c7742',
          800: '#0d5e37',
          900: '#0c4d2f',
        },
        dark: {
          900: '#080f0a',
          800: '#0d1a10',
          700: '#122016',
          600: '#1a2e1e',
          500: '#223828',
          400: '#2d4a36',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
      }
    },
  },
  plugins: [],
}

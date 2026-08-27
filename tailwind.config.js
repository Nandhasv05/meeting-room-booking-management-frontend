/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0F2015',
          900: '#122315',
          800: '#1A3322',
          700: '#244A30',
          600: '#2F5E3D',
        },
        brand: {
          50: '#EDF5F0',
          100: '#D5E8DC',
          400: '#3D7A55',
          500: '#2A5A3C',
          600: '#1A3322',
          900: '#122315',
          950: '#0F2015',
        },
        mist: '#E8F0EB',
        ink: '#122315',
        signal: '#2F7A4E',
        ember: {
          DEFAULT: '#1A3322',
          soft: '#2F5E3D',
          mute: 'rgba(18, 35, 21, 0.1)',
        },
        stone: {
          50: '#F5F7F6',
          100: '#E8F0EB',
          200: '#D3DED7',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.625rem',
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 32, 21, 0.04), 0 10px 26px -18px rgba(15, 32, 21, 0.35)',
        panel: '0 1px 2px rgba(15, 32, 21, 0.04), 0 16px 40px -24px rgba(15, 32, 21, 0.35)',
        lift: '0 24px 60px -28px rgba(15, 32, 21, 0.45)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.82)', opacity: '0.55' },
          '70%': { transform: 'scale(1.12)', opacity: '0' },
          '100%': { transform: 'scale(1.12)', opacity: '0' },
        },
        'logo-breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        rise: 'rise 0.45s ease-out both',
        fade: 'fade 0.35s ease-out both',
        'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
        'logo-breathe': 'logo-breathe 2.2s ease-in-out infinite',
        slideIn: 'slideIn 0.28s ease-out both',
      },
    },
  },
  plugins: [],
};

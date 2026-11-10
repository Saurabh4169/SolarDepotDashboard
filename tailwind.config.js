/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#02070A',
        'midnight-50': '#0a1820',
        'midnight-100': '#0d1e28',
        'midnight-200': '#102634',
        electric: {
          DEFAULT: '#0297DE',
          50: '#EAF6FC',
          100: '#DDF1FA',
          200: '#b8e3f5',
          300: '#8fd0ee',
          400: '#3fb1e8',
          500: '#0297DE',
          600: '#0278b8',
          700: '#025e91',
          800: '#013f61',
          900: '#012a42',
        },
        cantaloupe: {
          DEFAULT: '#FC734D',
          400: '#fd8a6a',
          500: '#FC734D',
          600: '#e85a34',
          700: '#c54320',
        },
        navy: {
          DEFAULT: '#071B2A',
          600: '#102e45',
          700: '#0b2436',
        },
        bg: '#F7FAFC',
        offwhite: '#F7FAFC',
        ice: '#EAF6FC',
        pale: '#DDF1FA',
        iceblue: '#EAF6FC',
        paleblue: '#DDF1FA',
        neutralgrey: '#F1F5F8',
        text: {
          DEFAULT: '#0B1B2B',
          body: '#334155',
          muted: '#64748B',
        },
      },
      backgroundImage: {
        'grad-dark': 'linear-gradient(135deg, #02070A 0%, #071B2A 55%, #0b2436 100%)',
        'grad-sidebar': 'linear-gradient(180deg, #02070A 0%, #071B2A 40%, #0b2f4a 75%, #0278b8 100%)',
        'grad-electric': 'linear-gradient(135deg, #3fb1e8 0%, #0297DE 55%, #0278b8 100%)',
        'grad-cta': 'linear-gradient(135deg, #fd8a6a 0%, #FC734D 60%, #e85a34 100%)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(2, 151, 222, 0.4)',
        'glow-lg': '0 0 50px -10px rgba(2, 151, 222, 0.55)',
        soft: '0 10px 30px -10px rgba(7, 27, 42, 0.12)',
        'soft-lg': '0 20px 40px -15px rgba(7, 27, 42, 0.2)',
        orange: '0 0 25px -6px rgba(252, 115, 77, 0.45)',
        phone: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
      borderRadius: {
        'phone': '44px',
        'phone-inner': '38px',
      }
    },
  },
  plugins: [],
};


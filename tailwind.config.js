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
        electric: '#0297DE',
        'electric-50': '#EAF6FC',
        'electric-100': '#DDF1FA',
        'electric-200': '#b8e3f5',
        'electric-300': '#8fd0ee',
        'electric-400': '#3fb1e8',
        'electric-500': '#0297DE',
        'electric-600': '#0278b8',
        'electric-700': '#025e91',
        'electric-800': '#013f61',
        'electric-900': '#012a42',
        cantaloupe: '#FC734D',
        'cantaloupe-400': '#fd8a6a',
        'cantaloupe-500': '#FC734D',
        'cantaloupe-600': '#e85a34',
        'cantaloupe-700': '#c54320',
        offwhite: '#F7FAFC',
        iceblue: '#EAF6FC',
        paleblue: '#DDF1FA',
        neutralgrey: '#F1F5F8',
        navy: '#071B2A',
        'navy-700': '#0b2436',
        'navy-600': '#102e45',
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


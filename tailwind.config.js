const { tint, shade } = require('polished')
const plugin = require('tailwindcss/plugin')

// base colors
const brand = '#007ec1'

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './tailwind.config.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: brand,
          light: tint(0.3, brand), // <- lightBlue
          lighter: tint(0.55, brand), // <- lighterBlue
          150: tint(0.85, brand), // <-lightBlueBackground
          100: tint(0.94, brand), // <- bluewhite
          50: tint(0.96, brand), // <- lightBackground
        },
      },
      borderWidth: {
        3: '3px',
      },
    },
    screens: {
      mobile: '500px',
      sm: '800px',
      md: '1024px',
      lg: '1216px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities, addComponents }) {
      addComponents({
        '.serlo-link': {
          '@apply text-brand no-underline break-words hover:underline': {},
        },
      })

      addUtilities({
        '.boxshadow-brand': {
          boxShadow: `0 0 10px ${brand}`,
        },
        '@media print': {
          '.serlo-no-after-content:after': {
            content: '"" !important',
          },
        },
      })
    }),
  ],
}

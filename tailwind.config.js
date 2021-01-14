const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.ts', './public/**/*.html'],
  theme: {
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Avenir', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      zIndex: {
        '-10': '-10',
      },
    },
  },
  variants: {},
  plugins: [],
}

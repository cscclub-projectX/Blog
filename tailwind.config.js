module.exports = {
  content: [],
  theme: {
    extend: {
      width: {
        '1/6': '16.666667%',
        '2/6': '33.333333%',
        '4/6': '66.666667%',
        '5/6': '83.333333%',
      },
      margin: {
        '1/6': '16.666667%',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 
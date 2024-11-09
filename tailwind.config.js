/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust if you use other file extensions
  ],
  theme: {
    extend: {
      keyframes: {
        dash: {
          to: {
            'stroke-dashoffset': '-8'
          }
        }
      },
      animation: {
        'dash': 'dash 1s linear infinite'
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'coally-dark-blue': '#012169', 
        'coally-orange': '#FF6F3D', 
      },
    },
  },
  plugins: [],
};

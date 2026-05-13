module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#d2a75b',
        'brand-dark': '#0e1012',
        'brand-muted': '#7f7a6c',
        'brand-surface': '#151718'
      },
      boxShadow: {
        glow: '0 20px 60px rgba(210, 167, 91, 0.16)'
      }
    }
  },
  plugins: [],
}

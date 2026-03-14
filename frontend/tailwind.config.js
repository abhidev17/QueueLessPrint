/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        secondary: "#ec4899",
        dark: "#0f172a",
        light: "#f8fafc",
      },
      backgroundImage: {
        gradient: "linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

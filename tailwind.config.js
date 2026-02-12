/** @type {import('tailwindcss').Config} */
export default {
  // Aquest apartat diu a Tailwind on buscar les classes que fas servir
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Aquí definim els teus colors personalitzats
      colors: {
        // PRIMARY (Lila - El color de marca)
        primary: {
          50: '#f5f3ff',  // Fons molt clars
          100: '#ede9fe',
          500: '#8b5cf6',
          600: '#7c3aed', // COLOR PRINCIPAL (Botons, títols)
          700: '#6d28d9', // Hover
        },
        // SECONDARY (Rosa suau / Lila clar)
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff', // Fons decoratius
          500: '#e879f9', // Elements destacats suaus
          600: '#d946ef',
        },
        // ACCENT (Blau - Per accions alternatives o informació)
        accent: {
          50: '#f0f9ff',
          500: '#0ea5e9', // Sky blue
          600: '#0284c7',
        }
      }
    },
  },
  plugins: [],
}
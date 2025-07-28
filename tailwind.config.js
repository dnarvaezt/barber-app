/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Habilitar modo oscuro con clases
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'], // Solo temas por defecto, sin dim
    darkTheme: 'dark', // Especificar el tema oscuro
    base: true, // Aplicar estilos base
    styled: true, // Incluir estilos de componentes
    utils: true, // Incluir utilidades
    prefix: '', // Sin prefijo
    logs: false, // Desactivar logs en producción
  },
}

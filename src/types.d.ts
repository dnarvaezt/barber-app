/// <reference types="vite/client" />

// Declaraciones de módulos
declare module '*.md' {
  const content: string
  export default content
}

declare module 'github-markdown-css' {
  const content: string
  export default content
}

// Constantes globales
declare const __APP_VERSION__: string
declare const __BASE_PATH__: string

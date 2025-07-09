/// <reference types="vite/client" />

declare module '*.md' {
  const content: string
  export default content
}

declare const __APP_VERSION__: string
declare const __BASE_PATH__: string

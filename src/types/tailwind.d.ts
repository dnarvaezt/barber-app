declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Extend the existing scss.d.ts to include Tailwind
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

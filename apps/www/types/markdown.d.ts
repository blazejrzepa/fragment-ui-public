/**
 * Type declarations for markdown file imports with ?raw query
 * This allows TypeScript to recognize imports like: import content from './file.md?raw'
 */
declare module '*.md?raw' {
  const content: string;
  export default content;
}


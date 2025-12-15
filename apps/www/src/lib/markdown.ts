import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

// Get the directory of this file to resolve paths relative to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Go up from src/lib/markdown.ts to apps/www
const appRoot = path.resolve(__dirname, "../..");

/**
 * Read and parse a Markdown file with frontmatter
 * Uses both filesystem (dev) and import-based (production) approaches
 */
export async function readMarkdown(filePath: string) {
  try {
    // Normalize the path - remove leading "app/" if present
    const normalizedPath = filePath.startsWith("app/") 
      ? filePath.slice(4) 
      : filePath;
    
    // Try to read from filesystem first (works in dev and if files are available)
    const fsPath = path.join(appRoot, normalizedPath);
    
    let fileContents: string;
    
    if (fs.existsSync(fsPath)) {
      // Use filesystem (dev/local)
      fileContents = fs.readFileSync(fsPath, "utf8");
    } else {
      // Try to import as raw string (production/build time)
      // This requires webpack raw-loader or similar
      try {
        // For production, we'll need to use a different approach
        // Try reading from process.cwd() as fallback
        const cwdPath = path.join(process.cwd(), normalizedPath);
        if (fs.existsSync(cwdPath)) {
          fileContents = fs.readFileSync(cwdPath, "utf8");
        } else {
          // Last resort: try relative to app root
          const relativePath = path.join(process.cwd(), "apps/www", normalizedPath);
          if (fs.existsSync(relativePath)) {
            fileContents = fs.readFileSync(relativePath, "utf8");
          } else {
            throw new Error(`Markdown file not found: ${filePath}. Tried: ${fsPath}, ${cwdPath}, ${relativePath}`);
          }
        }
      } catch (importError) {
        console.error(`Failed to read markdown file ${filePath}:`, importError);
        throw importError;
      }
    }
    
    // Parse frontmatter
    const { data, content } = matter(fileContents);
    
    // Process markdown to HTML with syntax highlighting
    let processedHtml = (await remark()
      .use(remarkGfm) // GitHub Flavored Markdown support
      .use(remarkRehype, { allowDangerousHtml: true }) // Convert to rehype AST
      .use(rehypeSlug) // Add id attributes to headings (fixes hydration mismatch)
      .use(rehypePrettyCode, {
        // Theme configuration for code blocks
        theme: {
          dark: "github-dark",
          light: "github-light",
        },
        // Keep background - Shiki will apply theme colors
        keepBackground: true, // Let Shiki handle background, we'll override with CSS
        // Default language for code blocks without language specified
        defaultLang: "plaintext",
        // Grid for better line alignment
        grid: false,
        // Transformers for additional features
        transformers: [],
        // Filter out meta string (e.g., "showLineNumbers" from code blocks)
        filterMetaString: (string) => string.replace(/filename="[^"]*"/, ""),
      })
      .use(rehypeStringify, { allowDangerousHtml: true }) // Convert to HTML string
      .process(content)).toString();
    
    // Post-process HTML to remove empty lines from code blocks
    // rehype-pretty-code wraps each line in <span data-line="X">...</span>
    // Empty lines become <span data-line="X"></span> or <span data-line="X"><span></span></span>
    // Strategy: Remove all <span data-line> elements that contain only whitespace
    // Use a more aggressive approach - remove spans that don't contain any visible content
    
    // Remove empty <span data-line> elements that contain only whitespace and optional nested empty spans
    // This regex matches spans with data-line that contain only whitespace, newlines, and optional nested empty spans
    // We need to match spans that don't contain any actual text content (only whitespace and empty nested spans)
    let previousHtml = "";
    let iterations = 0;
    const maxIterations = 10; // Prevent infinite loops
    
    while (previousHtml !== processedHtml && iterations < maxIterations) {
      previousHtml = processedHtml;
      iterations++;
      
      // Remove empty spans with data-line that contain only whitespace and optional nested empty spans
      // Match: <span data-line="..."> followed by optional whitespace/newlines, optional nested empty spans, and closing </span>
      processedHtml = processedHtml.replace(
        /<span[^>]*data-line[^>]*>[\s\n]*(<span[^>]*>[\s\n]*<\/span>[\s\n]*)*<\/span>/g,
        ""
      );
      
      // Also remove spans that contain only whitespace and nested spans with only whitespace
      processedHtml = processedHtml.replace(
        /<span[^>]*data-line[^>]*>[\s\n]*(<span[^>]*>[\s\n]*<\/span>[\s\n]*)+<\/span>/g,
        ""
      );
    }
    
    // Clean up any remaining whitespace/newlines between code lines
    // Remove multiple consecutive newlines and whitespace between closing </span> and opening <span data-line>
    processedHtml = processedHtml.replace(
      /(<\/span>)\s*\n\s*\n\s*(<span[^>]*data-line[^>]*>)/g,
      "$1\n$2"
    );
    
    return {
      frontmatter: data as Record<string, any>,
      content: processedHtml,
    };
  } catch (error) {
    console.error(`Error reading markdown file ${filePath}:`, error);
    // Return fallback content instead of throwing
    return {
      frontmatter: { title: "Error" },
      content: `<p>Error loading content. Please check the file path: ${filePath}</p><p>Error details: ${error instanceof Error ? error.message : String(error)}</p>`,
    };
  }
}

/**
 * Get all markdown files in a directory
 */
export function getMarkdownFiles(dirPath: string): string[] {
  const fullPath = path.join(process.cwd(), dirPath);
  
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  
  return fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(dirPath, file));
}


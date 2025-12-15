import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

// Cache for processed markdown content
// Key: markdown content hash, Value: processed result
const markdownCache = new Map<string, { frontmatter: Record<string, any>; content: string }>();

/**
 * Simple hash function for cache keys
 */
function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// Lazy-loaded Shiki processor to avoid loading themes on every request
let shikiProcessor: any = null;

function getShikiProcessor() {
  if (!shikiProcessor) {
    shikiProcessor = remark()
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
      .use(rehypeStringify, { allowDangerousHtml: true }); // Convert to HTML string
  }
  return shikiProcessor;
}

/**
 * Process markdown content string to HTML
 * This is used when markdown is imported as a string (via webpack raw-loader or similar)
 * 
 * Uses caching to avoid reprocessing the same content multiple times
 */
export async function processMarkdownContent(markdownContent: string) {
  // Check cache first
  const cacheKey = hashContent(markdownContent);
  const cached = markdownCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Parse frontmatter
  const { data, content } = matter(markdownContent);
  
  // Process markdown to HTML with syntax highlighting
  // Use lazy-loaded processor to avoid reinitializing Shiki on every request
  const processor = getShikiProcessor();
  let processedHtml = (await processor.process(content)).toString();
  
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
  
  const result = {
    frontmatter: data as Record<string, any>,
    content: processedHtml,
  };
  
  // Cache the result (limit cache size to prevent memory issues)
  if (markdownCache.size > 50) {
    // Remove oldest entry (simple FIFO)
    const firstKey = markdownCache.keys().next().value;
    if (firstKey) {
      markdownCache.delete(firstKey);
    }
  }
  markdownCache.set(cacheKey, result);
  
  return result;
}


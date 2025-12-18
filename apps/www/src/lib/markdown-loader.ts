import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

// Cache for processed markdown content
// Key: markdown content hash, Value: processed result
const markdownCache = new Map<
  string,
  { frontmatter: Record<string, any>; content: string }
>();

/**
 * Simple hash function for cache keys
 */
function hashContent(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

function stripBom(input: string) {
  return input.replace(/^\uFEFF/, "");
}

/**
 * If gray-matter can't parse frontmatter (e.g. weird encodings), do a minimal fallback:
 * - Extract first `--- ... ---` block
 * - Parse simple `key: value` pairs
 * - Remove the entire block from markdown body
 */
function fallbackFrontmatter(markdown: string): {
  data: Record<string, any>;
  content: string;
} {
  const normalized = stripBom(markdown);
  if (!normalized.startsWith("---")) {
    return { data: {}, content: normalized };
  }

  const end = normalized.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, content: normalized };
  }

  const fmRaw = normalized.slice(3, end).trim();
  const body = normalized.slice(end + "\n---".length).replace(/^\n+/, "");

  const data: Record<string, any> = {};
  for (const line of fmRaw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    value = value.replace(/^"|"$/g, "").replace(/^'|'$/g, "");

    if (key) data[key] = value;
  }

  return { data, content: body };
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
  const normalizedMarkdown = stripBom(markdownContent);

  // Check cache first
  const cacheKey = hashContent(normalizedMarkdown);
  const cached = markdownCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Parse frontmatter
  let data: Record<string, any> = {};
  let body = normalizedMarkdown;

  try {
    const parsed = matter(normalizedMarkdown);
    data = parsed.data as Record<string, any>;
    body = parsed.content;
  } catch {
    const fallback = fallbackFrontmatter(normalizedMarkdown);
    data = fallback.data;
    body = fallback.content;
  }

  // Process markdown to HTML with syntax highlighting
  // Use lazy-loaded processor to avoid reinitializing Shiki on every request
  const processor = getShikiProcessor();
  let processedHtml = (await processor.process(body)).toString();

  // Post-process HTML to remove empty lines from code blocks
  // rehype-pretty-code wraps each line in <span data-line="X">...</span>
  // Empty lines become <span data-line="X"></span> or <span data-line="X"><span></span></span>
  // Strategy: Remove all <span data-line> elements that contain only whitespace
  // Use a more aggressive approach - remove spans that don't contain any visible content

  let previousHtml = "";
  let iterations = 0;
  const maxIterations = 10; // Prevent infinite loops

  while (previousHtml !== processedHtml && iterations < maxIterations) {
    previousHtml = processedHtml;
    iterations++;

    // Remove empty spans with data-line that contain only whitespace and optional nested empty spans
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
  processedHtml = processedHtml.replace(
    /(<\/span>)\s*\n\s*\n\s*(<span[^>]*data-line[^>]*>)/g,
    "$1\n$2"
  );

  const result = {
    frontmatter: data,
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

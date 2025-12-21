/**
 * Document ingestion utilities
 * 
 * Converts uploaded documents (PDF, MD, TXT) into text chunks
 * for use in variant generation.
 */

/**
 * Extract text from a file
 * 
 * @param file - File object (PDF, MD, TXT)
 * @returns Extracted text content
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type || file.name.split(".").pop()?.toLowerCase();
  
  if (fileType === "text/plain" || file.name.endsWith(".txt")) {
    return await file.text();
  }
  
  if (fileType === "text/markdown" || file.name.endsWith(".md")) {
    return await file.text();
  }
  
  if (fileType === "application/pdf" || file.name.endsWith(".pdf")) {
    // For PDF, we'll need to extract text
    // For now, return a placeholder - in production, use pdf-parse or similar
    throw new Error("PDF parsing not yet implemented. Please convert to TXT or MD first.");
  }
  
  // Default: try to read as text
  try {
    return await file.text();
  } catch (error) {
    throw new Error(`Unsupported file type: ${fileType || "unknown"}`);
  }
}

/**
 * Split text into chunks for processing
 * 
 * @param text - Full text content
 * @param maxChunkSize - Maximum characters per chunk
 * @returns Array of text chunks
 */
export function chunkText(text: string, maxChunkSize: number = 2000): string[] {
  const chunks: string[] = [];
  const lines = text.split("\n");
  let currentChunk = "";
  
  for (const line of lines) {
    if (currentChunk.length + line.length + 1 > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = line;
    } else {
      currentChunk += (currentChunk ? "\n" : "") + line;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Document analysis structure
 */
export interface DocumentAnalysis {
  title?: string;
  description?: string;
  requirements?: string[];
  sections?: string[];
  fullText?: string;
}

/**
 * Extract key sections from document
 * 
 * @param text - Full text content
 * @returns Object with sections (title, description, requirements, etc.)
 */
export function extractSections(text: string): DocumentAnalysis {
  const sections: DocumentAnalysis = {};
  
  // Try to extract title (first line or # heading)
  const titleMatch = text.match(/^#\s+(.+)$/m) || text.match(/^(.+)$/m);
  if (titleMatch) {
    sections.title = titleMatch[1].trim();
  }
  
  // Extract markdown sections
  const sectionMatches = text.matchAll(/^##\s+(.+)$/gm);
  const extractedSections: string[] = [];
  for (const match of sectionMatches) {
    extractedSections.push(match[1].trim());
  }
  if (extractedSections.length > 0) {
    sections.sections = extractedSections;
  }
  
  // Extract requirements (lines starting with - or *)
  const requirementMatches = text.matchAll(/^[-*]\s+(.+)$/gm);
  const requirements: string[] = [];
  for (const match of requirementMatches) {
    requirements.push(match[1].trim());
  }
  if (requirements.length > 0) {
    sections.requirements = requirements;
  }
  
  // Extract description (text after title, before first section)
  const titleEnd = titleMatch ? text.indexOf(titleMatch[0]) + titleMatch[0].length : 0;
  const firstSectionStart = text.indexOf("##", titleEnd);
  if (firstSectionStart > titleEnd) {
    const descriptionText = text.substring(titleEnd, firstSectionStart).trim();
    // Clean up description (remove markdown formatting)
    const cleanedDescription = descriptionText
      .replace(/^#+\s*/gm, "")
      .replace(/^\*\*|\*\*$/g, "")
      .replace(/^_|_$/g, "")
      .trim();
    if (cleanedDescription.length > 0 && cleanedDescription.length < 500) {
      sections.description = cleanedDescription;
    }
  }
  
  // Store full text for context
  sections.fullText = text;
  
  return sections;
}


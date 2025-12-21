/**
 * Utility functions for playground
 */

import type { UIProject } from "@/hooks/use-ui-projects";
import type { ChatSession } from "@/types/chat";
import type { UiDsl } from "../../app/studio/dsl/types";

/**
 * Get active project from projects array
 */
export function getActiveProject(
  projects: UIProject[],
  activeProjectId: string | null
): UIProject | null {
  if (!activeProjectId) return null;
  return projects.find((p) => p.id === activeProjectId) || null;
}

/**
 * Get active session from sessions array
 */
export function getActiveSession(
  sessions: ChatSession[],
  activeSessionId: string | null
): ChatSession | null {
  if (!activeSessionId) return null;
  return sessions.find((s) => s.id === activeSessionId) || null;
}

/**
 * Parse DSL from project (handles both string and object formats)
 */
export function parseProjectDsl(dsl: any): UiDsl | null {
  if (!dsl) return null;
  if (typeof dsl === "string") {
    try {
      return JSON.parse(dsl);
    } catch (e) {
      console.warn("Failed to parse DSL from string:", e);
      return null;
    }
  }
  return dsl;
}

/**
 * Check if code belongs to a specific project
 */
export function codeBelongsToProject(
  codeProjectId: string | null,
  projectId: string | null,
  code: string
): boolean {
  return codeProjectId === projectId && code.length > 0;
}

/**
 * Extract component name from code
 */
export function extractComponentName(code: string, fallback: string = "Component"): string {
  const match = code.match(/(?:function|const|export\s+(?:default\s+)?function)\s+(\w+)/);
  return match ? match[1] : fallback;
}

/**
 * Create a project title from prompt
 */
export function createProjectTitle(prompt: string, maxLength: number = 30): string {
  if (prompt.length <= maxLength) return prompt.trim();
  return prompt.substring(0, maxLength).trim() + "...";
}

/**
 * Check if prompt is a generation request
 */
export function isGenerationRequest(prompt: string): boolean {
  const trimmed = prompt.trim();
  return (
    /^(dodaj|add|zmie[ńn]|change|usu[ńn]|remove|delete|update|modify|stw[óo]rz|create|zbuduj|build|zr[óo]b|make|ustaw|set|generuj|generate|wygeneruj)/i.test(trimmed) ||
    /(?:stw[óo]rz|create|zbuduj|build|zr[óo]b|make|generuj|generate|wygeneruj)\s+(?:nowy|new)?\s*(?:komponent|component|formularz|form|ui|interfejs|interface|dashboard|panel|ekran|screen|strona|page|aplikacja|app)/i.test(trimmed) ||
    /(?:dodaj|add|zmie[ńn]|change|usu[ńn]|remove|delete|update|modify|stw[óo]rz|create|zbuduj|build|zr[óo]b|make|ustaw|set|generuj|generate|wygeneruj)\s+/i.test(trimmed)
  );
}

/**
 * Check if prompt is a new component request
 */
export function isNewComponentRequest(prompt: string): boolean {
  const trimmed = prompt.trim();
  return (
    /^(stw[óo]rz|create|zbuduj|build|zr[óo]b|make|generuj|generate|wygeneruj)\s+(?:a\s+)?(?:nowy|new)?\s*(?:komponent|component|formularz|form|ui|interfejs|interface|dashboard|panel|ekran|screen)/i.test(trimmed) ||
    /^(stw[óo]rz|create|zbuduj|build|zr[óo]b|make|generuj|generate|wygeneruj)\s+(?:a\s+)?[\w-]+\s+(?:komponent|component|formularz|form|ui|interfejs|interface|dashboard|panel|ekran|screen)/i.test(trimmed) ||
    /(?:stw[óo]rz|create|zbuduj|build|zr[óo]b|make|generuj|generate|wygeneruj)\s+(?:nowy|new)\s+(?:komponent|component|formularz|form|ui|interfejs|interface|dashboard|panel|ekran|screen)/i.test(trimmed) ||
    /(?:nowy|new)\s+(?:komponent|component|formularz|form|ui|interfejs|interface|dashboard|panel|ekran|screen)/i.test(trimmed)
  );
}

/**
 * Check if prompt is a patch command
 */
export function isPatchCommand(prompt: string): boolean {
  const trimmed = prompt.trim();
  return (
    /^(change|set|update|make|remove|delete|add|insert|move|reorder|rename|dodaj|daj|zmie[ńn]|usu[ńn]|ustaw)\s+/i.test(trimmed) ||
    /(?:change|set|update|make|remove|delete|add|insert|move|reorder|rename|dodaj|daj|zmie[ńn]|usu[ńn]|ustaw)\s+(?:the\s+)?(?:label|text|title|placeholder|variant|size|required|disabled|nag[łl][óo]wek|opis|header|heading|description)/i.test(trimmed) ||
    /(?:dodaj|daj|add|insert)\s+(?:nag[łl][óo]wek|header|heading|opis|description|tytu[łl]|title)/i.test(trimmed)
  );
}


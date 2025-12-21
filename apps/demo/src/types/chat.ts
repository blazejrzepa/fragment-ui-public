/**
 * Type definitions for chat functionality
 */

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

import type { GenerationMetadata } from "./generation";

export interface LogEntry {
  id: string;
  step: "chat" | "generate" | "preview" | "a11y";
  status: "pending" | "success" | "error";
  message: string;
  timestamp: Date;
}

export interface A11yResults {
  violations: Array<{
    id: string;
    impact: "minor" | "moderate" | "serious" | "critical";
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{
      html: string;
      target: string[];
      failureSummary: string;
    }>;
  }>;
  passes: number;
  incomplete: number;
  inapplicable: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  isGenerating?: boolean; // Track if session is currently generating
  logs?: LogEntry[]; // Terminal logs
  a11yResults?: A11yResults | null; // Accessibility results
  isFavourite?: boolean; // Track if session is marked as favourite
  // Removed: code, generationMetadata - these belong to UIProject, not ChatSession
}


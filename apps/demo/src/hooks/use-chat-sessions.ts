/**
 * Custom hook for managing chat sessions with localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";
import type { ChatSession } from "../types/chat";
import { useDebouncedLocalStorage } from "./use-debounced-local-storage";

const CHAT_SESSIONS_KEY = "fragment-ui-playground-chat-sessions";
const ACTIVE_SESSION_KEY = "fragment-ui-playground-active-session-id";

export function useChatSessions() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    try {
      const savedSessions = localStorage.getItem(CHAT_SESSIONS_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_SESSION_KEY);

      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        const sessionsWithDates = parsed.map((session: any) => {
          // Remove code and generationMetadata (migration for old data)
          const { code, generationMetadata, ...sessionWithoutCode } = session;
          return {
            ...sessionWithoutCode,
            createdAt: new Date(session.createdAt),
            // Reset isGenerating to false when loading from localStorage
            // (generation state should not persist across page refreshes)
            isGenerating: false,
            messages: session.messages ? session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })) : [],
            logs: session.logs ? session.logs.map((log: any) => ({
              ...log,
              timestamp: new Date(log.timestamp),
            })) : [],
            a11yResults: session.a11yResults || null,
          };
        });
        setChatSessions(sessionsWithDates);

        if (savedActiveId && sessionsWithDates.find((s: ChatSession) => s.id === savedActiveId)) {
          setActiveSessionId(savedActiveId);
        }
      }
    } catch (error) {
      // Error loading chat sessions - handled silently
      if (process.env.NODE_ENV === "development") {
        console.error("Error loading chat sessions from localStorage:", error);
      }
    }
  }, [mounted]);

  // Debounced save to localStorage whenever sessions change
  useDebouncedLocalStorage(CHAT_SESSIONS_KEY, chatSessions, 500);
  
  // Also save immediately on beforeunload to prevent data loss
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(chatSessions));
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error saving chat sessions on beforeunload:", error);
        }
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [chatSessions, mounted]);
  
  // Save active session ID immediately (no debounce needed, it's just a string)
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    try {
      if (activeSessionId) {
        localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
      } else {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }
    } catch (error) {
      // Error saving active session ID - handled silently
      if (process.env.NODE_ENV === "development") {
        console.error("Error saving active session ID to localStorage:", error);
      }
    }
  }, [activeSessionId, mounted]);

  const updateSession = useCallback((sessionId: string, updates: Partial<ChatSession>) => {
    setChatSessions((prev) => {
      return prev.map((session) => (session.id === sessionId ? { ...session, ...updates } : session));
    });
  }, []);

  const addSession = useCallback((session: ChatSession) => {
    setChatSessions((prev) => [...prev, session]);
  }, []);

  const removeSession = useCallback((sessionId: string) => {
    setChatSessions((prev) => prev.filter((session) => session.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
  }, [activeSessionId]);

  return {
    chatSessions,
    activeSessionId,
    setChatSessions,
    setActiveSessionId,
    updateSession,
    addSession,
    removeSession,
    mounted,
  };
}


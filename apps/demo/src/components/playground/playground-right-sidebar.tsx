"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { ArrowUp, Square, Mic, Upload } from "lucide-react";
import { Textarea, Spinner, Tooltip } from "@fragment_ui/ui";
import type { Message } from "@/types/chat";

// Type declarations for Speech Recognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface PlaygroundRightSidebarProps {
  messages: Message[];
  inputMessage: string;
  isGenerating: boolean;
  isCurrentlyGenerating: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onStopGeneration?: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPromptClick?: (prompt: string) => void;
  onVariantsGenerated?: (variants: any[]) => void; // Callback when variants are generated from document
}

// Memoized message item component for performance
const MessageItem = React.memo(function MessageItem({ message }: { message: Message }) {
  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.role === "user"
            ? "text-[color:var(--foreground-primary)]"
            : "text-[color:var(--color-fg-base)]"
        }`}
        style={message.role === "user" 
          ? { backgroundColor: "var(--foreground-tertiary)" }
          : message.role === "assistant" 
            ? { backgroundColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" } 
            : undefined}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
});

export const PlaygroundRightSidebar = React.memo(function PlaygroundRightSidebar({
  messages,
  inputMessage,
  isGenerating,
  isCurrentlyGenerating,
  onInputChange,
  onSendMessage,
  onStopGeneration,
  onKeyPress,
  onPromptClick,
  onVariantsGenerated,
}: PlaygroundRightSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const inputMessageRef = useRef(inputMessage);

  // Keep inputMessageRef in sync
  useEffect(() => {
    inputMessageRef.current = inputMessage;
  }, [inputMessage]);

  // Check if browser supports speech recognition
  const SpeechRecognition = 
    typeof window !== 'undefined' && 
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;

  // Initialize speech recognition
  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const Recognition = SpeechRecognition;
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Can be made configurable

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Update input with both interim and final transcripts
      if (finalTranscript) {
        onInputChange(inputMessageRef.current + finalTranscript);
      } else if (interimTranscript) {
        // Show interim results (optional - can be removed if not desired)
        // onInputChange(inputMessageRef.current + interimTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        // User stopped speaking, stop recognition
        recognition.stop();
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [SpeechRecognition, onInputChange]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Memoize toggle handler
  const handleToggleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not available');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  }, [recognitionRef, isListening]);

  // Memoize button visibility to avoid re-renders
  const buttonVisibility = useMemo(() => {
    const hasText = inputMessage.trim().length > 0;
    return {
      showMicrophone: !hasText && !isGenerating,
      showSendButton: hasText && !isGenerating,
      showStopButton: isGenerating,
    };
  }, [inputMessage, isGenerating]);

  // Memoize rendered messages for performance (only re-render when messages change)
  // For long lists (> 50 messages), only render last 50 for better performance
  const renderedMessages = useMemo(() => {
    if (messages.length === 0) return null;
    
    const messagesToRender = messages.length > 50 
      ? messages.slice(-50) 
      : messages;
    
    return messagesToRender.map((message) => (
      <MessageItem key={message.id} message={message} />
    ));
  }, [messages]);

  // Handle document upload for variant generation
  const handleDocumentUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Extract text from file
      const { extractTextFromFile, extractSections } = await import("@/lib/docs/ingest");
      const text = await extractTextFromFile(file);
      
      // Deep analysis of document structure
      console.log("[Variants] Analyzing document structure...");
      const documentAnalysis = extractSections(text);
      console.log("[Variants] Document analysis:", {
        title: documentAnalysis.title,
        sections: documentAnalysis.sections?.length || 0,
        requirements: documentAnalysis.requirements?.length || 0,
      });
      
      // Build enriched prompt from analyzed structure
      let enrichedPrompt = text; // Start with full text
      
      // If we have structured sections, create a more detailed prompt
      if (documentAnalysis.title || documentAnalysis.sections || documentAnalysis.requirements) {
        const promptParts: string[] = [];
        
        if (documentAnalysis.title) {
          promptParts.push(`Title: ${documentAnalysis.title}`);
        }
        
        if (documentAnalysis.sections && documentAnalysis.sections.length > 0) {
          promptParts.push(`\nSections:\n${documentAnalysis.sections.map(s => `- ${s}`).join("\n")}`);
        }
        
        if (documentAnalysis.requirements && documentAnalysis.requirements.length > 0) {
          promptParts.push(`\nRequirements:\n${documentAnalysis.requirements.map(r => `- ${r}`).join("\n")}`);
        }
        
        // Combine structured info with full text for context
        enrichedPrompt = `${promptParts.join("\n")}\n\nFull Document:\n${text}`;
      }
      
      console.log("[Variants] Enriched prompt length:", enrichedPrompt.length);
      console.log("[Variants] Document preview:", enrichedPrompt.substring(0, 300));
      
      // Generate DSL from analyzed document using existing API
      const generateResponse = await fetch("/api/dsl/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: enrichedPrompt,
          documentAnalysis: documentAnalysis, // Pass analysis for better context
        }),
      });
      
      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error("[Variants] DSL generation failed:", errorText);
        throw new Error("Failed to generate DSL from document");
      }
      
      const generateData = await generateResponse.json();
      const baseDsl = generateData.dsl;
      
      console.log("[Variants] Generated DSL:", {
        type: baseDsl?.type,
        id: baseDsl?.id,
        title: baseDsl?.title,
        childrenCount: baseDsl?.children?.length || 0,
        childrenTypes: baseDsl?.children?.map((c: any) => c.type) || [],
      });
      
      if (!baseDsl) {
        throw new Error("No DSL generated from document");
      }
      
      // Generate variants from the DSL
      const variantsResponse = await fetch("/api/variants/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dsl: baseDsl,
          count: 3,
          emphasis: undefined, // Auto - all types
        }),
      });
      
      if (!variantsResponse.ok) {
        throw new Error("Failed to generate variants");
      }
      
      const variantsData = await variantsResponse.json();
      
      // Generate TSX for each variant
      const { generateCodeFromDSL } = await import("@/lib/dsl-codegen");
      // Import registry - handle both default and named exports
      let registryData;
      try {
        const registryModule = await import("@fragment_ui/registry/registry.json");
        registryData = registryModule.default || registryModule;
      } catch {
        // Fallback: fetch from API
        const registryResponse = await fetch("/api/registry");
        registryData = await registryResponse.json();
      }
      
      const variantsWithCode = await Promise.all(
        variantsData.variants.map(async (variant: any) => {
          try {
            const tsx = generateCodeFromDSL(variant.dsl, registryData);
            return { ...variant, tsx };
          } catch (e) {
            console.error("Error generating TSX:", e);
            return variant;
          }
        })
      );
      
      console.log("[Variants] Generated variants:", variantsWithCode);
      
      // Call callback if provided
      if (onVariantsGenerated) {
        console.log("[Variants] Calling onVariantsGenerated callback");
        onVariantsGenerated(variantsWithCode);
      } else {
        console.warn("[Variants] onVariantsGenerated callback not provided");
      }
      
      // Add message to chat about variants
      const message = `Generated ${variantsWithCode.length} variants from document "${file.name}". Best variant score: ${variantsWithCode[0]?.score?.score || "N/A"}/100. Check the variants dialog to see all options.`;
      onInputChange(message);
      
    } catch (error) {
      console.error("Error processing document:", error);
      onInputChange(`Error processing document: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  }, [onVariantsGenerated, onInputChange]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleDocumentUpload(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [handleDocumentUpload]);

  // Memoize empty state
  const emptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center h-full text-center text-[color:var(--color-fg-muted)] px-4">
      <div className="flex flex-col items-center justify-center w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <p className="text-base text-[color:var(--foreground-primary)] font-semibold">
            AI Copilot
          </p>
          <p 
            className="text-xs leading-relaxed"
            style={{ color: "var(--foreground-secondary)" }}
          >
            Tell me what to build. I turn it into UI-DSL and output React using the Fragment UI design system.
          </p>
        </div>
      </div>
    </div>
  ), []);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" ref={chatContainerRef}>
        {messages.length === 0 ? emptyState : renderedMessages}
        {isCurrentlyGenerating && (
          <div className="flex justify-start">
            <div className="rounded-lg p-3" style={{ backgroundColor: "color-mix(in srgb, var(--foreground-primary) 5%, transparent)" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[color:var(--color-brand-primary)] rounded-full animate-pulse"></div>
                <span className="text-sm text-[color:var(--color-fg-muted)]">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 flex-shrink-0" style={{ backgroundColor: "var(--background-primary)" }}>
        <div className="relative w-full">
          <Textarea
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="Describe what you want to build or modify..."
            rows={3}
            className="resize-none w-full pr-12 pb-2 focus:outline-none focus:ring-0"
            style={{ 
              borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)", 
              paddingBottom: "40px",
              paddingRight: "48px",
              borderRadius: "6px",
              outline: "none",
              boxShadow: "none",
              color: "var(--foreground-tertiary)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = "none";
              e.currentTarget.style.borderColor = "color-mix(in srgb, var(--foreground-primary) 10%, transparent)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.color = "var(--foreground-primary)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
              e.currentTarget.style.borderColor = "color-mix(in srgb, var(--foreground-primary) 10%, transparent)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.color = "var(--foreground-tertiary)";
            }}
            disabled={isGenerating || isUploading}
          />
          {/* Upload Document Button */}
          <Tooltip content="Upload document (TXT, MD) to generate variants">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isGenerating || isUploading}
              className="absolute flex items-center justify-center rounded-full transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[color:var(--color-surface-2)]"
              style={{ 
                bottom: "14px",
                right: buttonVisibility.showMicrophone || buttonVisibility.showSendButton ? "38px" : "10px",
                width: "22px",
                height: "22px",
                backgroundColor: isUploading 
                  ? "var(--color-brand-primary)" 
                  : "transparent"
              }}
              aria-label="Upload document"
            >
              {isUploading ? (
                <Spinner className="w-4 h-4" style={{ color: "var(--background-primary)" }} />
              ) : (
                <Upload className="w-4 h-4" style={{ color: "var(--foreground-secondary)" }} />
              )}
            </button>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.text"
            onChange={handleFileChange}
            className="hidden"
          />
          {buttonVisibility.showMicrophone && SpeechRecognition && (
            <button
              onClick={handleToggleVoiceInput}
              className="absolute flex items-center justify-center rounded-full transition-colors z-10"
              style={{ 
                bottom: "14px",
                right: "10px",
                width: "22px",
                height: "22px",
                backgroundColor: isListening 
                  ? "var(--color-brand-primary)" 
                  : "var(--foreground-primary)"
              }}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
            >
              <Mic className="w-4 h-4" style={{ color: "var(--background-primary)" }} />
            </button>
          )}
          {buttonVisibility.showSendButton && (
            <button
              onClick={onSendMessage}
              disabled={!inputMessage.trim()}
              className="absolute flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
              style={{ 
                bottom: "14px",
                right: "10px",
                width: "22px",
                height: "22px",
                backgroundColor: "var(--foreground-primary)"
              }}
              aria-label="Send message"
            >
              <ArrowUp className="w-4 h-4" style={{ color: "var(--background-primary)" }} />
            </button>
          )}
          {buttonVisibility.showStopButton && onStopGeneration && (
            <button
              onClick={onStopGeneration}
              className="absolute flex items-center justify-center rounded-full transition-colors z-10"
              style={{ 
                bottom: "14px",
                right: "10px",
                width: "22px",
                height: "22px",
                backgroundColor: "var(--foreground-primary)"
              }}
              aria-label="Stop generation"
            >
              <Square className="w-3 h-3" style={{ color: "var(--background-primary)", fill: "var(--background-primary)" }} />
            </button>
          )}
        </div>
        <p className="text-xs mt-2 text-right" style={{ color: "var(--foreground-tertiary)" }}>
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
});


import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { detectChatIntent, isQuestion } from "@/lib/chat/intent-detector";
import {
  getOrCreateSession,
  updateSessionAsset,
  addMessageToHistory,
  getSession,
  addPatchToHistory,
  type ChatSession,
} from "@/lib/chat/session-manager";
import { parsePatchIntent } from "@/lib/chat/patch-intent-parser";
import type { UiPage } from "@fragment_ui/ui-dsl";

/**
 * API Route for AI chat responses
 * 
 * This endpoint provides conversational AI responses for the Playground chat.
 * It uses OpenAI API to generate natural language responses about component generation.
 * 
 * Now includes:
 * - Intent detection (generate vs edit)
 * - Session state management (Asset/Revision tracking)
 * - Patch history tracking
 */

// Initialize OpenAI client (if API key is available)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

interface ChatRequest {
  message: string;
  sessionId?: string; // Session ID for tracking state
  context?: {
    dsl?: any;
    code?: string;
    messages?: Array<{ role: "user" | "assistant"; content: string }>;
    assetId?: string;
    revisionId?: string;
  };
}

const SYSTEM_PROMPT = `You are a technical AI assistant similar to GitHub Copilot. Keep responses extremely brief and technical.

Response format:
- Maximum 2-3 sentences
- Focus on what was done or what's happening
- Mention key Fragment UI components used (e.g., "Using Button, Input, Card")
- No explanations, no examples, no code blocks
- No suggestions unless explicitly asked

Examples of good responses:
- "Generated ProductCard component using Card, CardMedia, CardContent, and Typography."
- "Searching for component patterns..."
- "Updating form validation logic."
- "Added Button with variant='primary' and onClick handler."

Bad responses (too verbose):
- Long explanations
- Lists of features
- Implementation patterns
- Next steps suggestions
- Code examples

Be direct, technical, and brief.`;

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { 
          error: "OpenAI API key not configured",
          fallback: true,
          message: "AI chat is not available. Please configure OPENAI_API_KEY environment variable."
        },
        { status: 503 }
      );
    }

    const body: ChatRequest = await request.json();
    const { message, sessionId, context } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get or create session
    const effectiveSessionId = sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const session = getOrCreateSession(effectiveSessionId);
    
    // Update session with context if provided
    if (context?.assetId && context?.revisionId) {
      updateSessionAsset(
        effectiveSessionId,
        context.assetId,
        context.revisionId,
        context.dsl,
        context.code
      );
    } else if (context?.dsl) {
      // Update DSL even without asset/revision IDs
      session.currentDSL = context.dsl;
      if (context.code) session.currentCode = context.code;
    }
    
    // Detect intent (use updated session - refresh to get latest)
    const currentSession = getSession(effectiveSessionId) || session;
    
    // Debug: log session state
    if (context?.dsl && !currentSession.currentDSL) {
      console.warn("[Chat API] DSL in context but not in session, updating...");
      currentSession.currentDSL = context.dsl;
    }
    const intentResult = detectChatIntent(message, {
      currentAssetId: currentSession.currentAssetId,
      currentRevisionId: currentSession.currentRevisionId,
      hasExistingDSL: !!currentSession.currentDSL || !!context?.dsl,
    });
    
    // Add user message to history
    addMessageToHistory(effectiveSessionId, "user", message, intentResult.intent);
    
    // If it's a question, handle differently
    if (isQuestion(message)) {
      // For questions, provide informational response
      const questionResponse = {
        message: "I can help you generate or edit components. Try: 'create a dashboard' or 'change the button color'.",
        intent: "unknown",
        sessionId: effectiveSessionId,
        metadata: {
          isQuestion: true,
        },
      };
      
      addMessageToHistory(effectiveSessionId, "assistant", questionResponse.message);
      
      return NextResponse.json(questionResponse);
    }

    // If intent is edit or patch, parse patch operations
    let parsedPatches = null;
    let appliedPatchesResult = null;
    
    // Check if we have DSL (from session or context)
    const dslToUse = currentSession.currentDSL || context?.dsl;
    
    if ((intentResult.intent === "edit" || intentResult.intent === "patch") && dslToUse) {
      try {
        parsedPatches = parsePatchIntent(
          message,
          dslToUse as UiPage,
          intentResult.targetId
        );
        
        // If patches were parsed, apply them automatically
        if (parsedPatches.patches.length > 0) {
          console.log("[Chat API] Applying", parsedPatches.patches.length, "patches");
          // Apply patches using internal function (avoid circular dependency)
          const { applyPatch } = await import("@/lib/dsl-patch");
          const { generateCodeFromDSL } = await import("@/lib/dsl-codegen");
          const { validatePage } = await import("@fragment_ui/ui-dsl");
          
          let currentDSL = dslToUse as UiPage;
          const allDiagnostics: any[] = [];
          
          // Apply patches sequentially
          for (const patch of parsedPatches.patches) {
            const result = applyPatch(currentDSL, patch, undefined);
            currentDSL = result.dsl;
            allDiagnostics.push(...result.diagnostics);
          }
          
          // Validate and regenerate code
          try {
            console.log("[Chat API] Patches applied, validating DSL...");
            const validation = validatePage(currentDSL, undefined);
            const hasErrors = validation.diagnostics.filter((d: any) => d.level === "error").length > 0;
            
            console.log("[Chat API] Validation result:", { 
              valid: validation.valid, 
              hasErrors, 
              diagnosticsCount: validation.diagnostics.length,
              errors: validation.diagnostics.filter((d: any) => d.level === "error").map((d: any) => d.message)
            });
            
            // Always try to generate code, even if validation has warnings
            // Only skip if there are critical errors that would break code generation
            const criticalErrors = validation.diagnostics.filter((d: any) => 
              d.level === "error" && 
              (d.code === "INVALID_COMPONENT" || d.code === "MISSING_REQUIRED_PROP")
            );
            
            if (criticalErrors.length === 0) {
              console.log("[Chat API] Validation passed (no critical errors), generating code...");
              try {
                // Load registry for code generation
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002";
                let registry: any = { components: {} };
                try {
                  const registryResponse = await fetch(`${baseUrl}/api/registry`);
                  if (registryResponse.ok) {
                    const registryData = await registryResponse.json();
                    registry = { components: registryData.components || {} };
                    console.log("[Chat API] Registry loaded, components:", Object.keys(registry.components).length);
                  } else {
                    console.warn("[Chat API] Registry response not OK:", registryResponse.status);
                  }
                } catch (regError) {
                  console.warn("[Chat API] Failed to load registry, using empty:", regError);
                }
                
                console.log("[Chat API] Calling generateCodeFromDSL...");
                const newCode = generateCodeFromDSL(currentDSL, registry, { includeImports: true });
                console.log("[Chat API] Code generated, length:", newCode?.length || 0);
                
                // Update session (refresh reference)
                const updatedSession = getSession(effectiveSessionId);
                if (updatedSession) {
                  updatedSession.currentDSL = currentDSL;
                  updatedSession.currentCode = newCode;
                } else {
                  currentSession.currentDSL = currentDSL;
                  currentSession.currentCode = newCode;
                }
                
                // Create new Revision if we have Asset/Revision context
                let newRevisionId: string | undefined;
                if (session.currentAssetId && session.currentRevisionId) {
                  try {
                    // Create Revision using inline function (avoid import issues)
                    // TODO: Use proper import once package exports are fixed
                    function createRevision(params: {
                      assetId: string;
                      dslJson: any;
                      tsxCode: string;
                      createdBy: string;
                      parentRevisionId?: string;
                      patches?: any[];
                      chatSessionId?: string;
                      metadata?: any;
                    }): { revisionId: string; [key: string]: any } {
                      return {
                        revisionId: crypto.randomUUID(),
                        assetId: params.assetId,
                        createdAt: new Date().toISOString(),
                        createdBy: params.createdBy,
                        dslJson: params.dslJson,
                        tsxCode: params.tsxCode,
                        metadata: params.metadata ?? {},
                        parentRevisionId: params.parentRevisionId,
                        patches: params.patches,
                        chatSessionId: params.chatSessionId
                      };
                    }
                    
                    const revision = createRevision({
                      assetId: session.currentAssetId,
                      dslJson: currentDSL,
                      tsxCode: newCode,
                      createdBy: "system", // TODO: Get from auth context
                      parentRevisionId: session.currentRevisionId,
                      patches: parsedPatches.patches,
                      chatSessionId: effectiveSessionId,
                      metadata: {
                        patchesApplied: parsedPatches.patches.length,
                        intent: intentResult.intent,
                      },
                    });
                    newRevisionId = revision.revisionId;
                    
                    // Update session with new revision
                    const updatedSession = getSession(effectiveSessionId);
                    if (updatedSession) {
                      updatedSession.currentRevisionId = newRevisionId;
                    }
                    
                    console.log("[Chat API] Created new Revision:", newRevisionId);
                  } catch (revisionError) {
                    console.warn("[Chat API] Failed to create Revision:", revisionError);
                    // Continue without Revision
                  }
                }
                
                appliedPatchesResult = {
                  dsl: currentDSL,
                  code: newCode,
                  diagnostics: allDiagnostics,
                  patchesApplied: parsedPatches.patches.length,
                  revisionId: newRevisionId,
                };
              } catch (codeError) {
                console.error("[Chat API] Code generation error:", codeError);
                console.error("[Chat API] Error stack:", codeError instanceof Error ? codeError.stack : String(codeError));
                // Still return DSL even if code generation fails
                const updatedSession = getSession(effectiveSessionId);
                if (updatedSession) {
                  updatedSession.currentDSL = currentDSL;
                }
                appliedPatchesResult = {
                  dsl: currentDSL,
                  code: null,
                  diagnostics: allDiagnostics,
                  patchesApplied: parsedPatches.patches.length,
                };
              }
            } else {
              console.warn("[Chat API] DSL validation failed, skipping code generation");
              // Still update DSL even if validation fails
              const updatedSession = getSession(effectiveSessionId);
              if (updatedSession) {
                updatedSession.currentDSL = currentDSL;
              }
              appliedPatchesResult = {
                dsl: currentDSL,
                code: null,
                diagnostics: allDiagnostics,
                patchesApplied: parsedPatches.patches.length,
              };
            }
          } catch (validationError) {
            console.error("[Chat API] Validation error:", validationError);
            // Still apply patches even if validation fails
            const updatedSession = getSession(effectiveSessionId);
            if (updatedSession) {
              updatedSession.currentDSL = currentDSL;
            }
            appliedPatchesResult = {
              dsl: currentDSL,
              code: null,
              diagnostics: allDiagnostics,
              patchesApplied: parsedPatches.patches.length,
            };
          }
        }
      } catch (error) {
        console.error("[Chat API] Patch parsing/application error:", error);
        // Continue with normal chat flow
      }
    }

    // Build conversation history
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add intent context to system prompt
    if (intentResult.intent !== "unknown") {
      messages.push({
        role: "system",
        content: `User intent: ${intentResult.intent} (confidence: ${intentResult.confidence}). ${intentResult.intent === "edit" ? "User wants to modify existing component." : intentResult.intent === "generate" ? "User wants to create new component." : "User wants to apply patch operations."}`,
      });
    }

    // Add context if available
    const currentDSL = session.currentDSL || context?.dsl;
    if (currentDSL) {
      messages.push({
        role: "system",
        content: `Current component context: ${JSON.stringify(currentDSL, null, 2).substring(0, 2000)}`, // Limit context size
      });
    }

    // Add conversation history from session
    const sessionHistory = session.conversationHistory.slice(-6); // Last 3 exchanges
    for (const msg of sessionHistory) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Also add context messages if provided (for backward compatibility)
    if (context?.messages && context.messages.length > 0) {
      const recentMessages = context.messages.slice(-6);
      for (const msg of recentMessages) {
        // Avoid duplicates
        if (!sessionHistory.some(sh => sh.content === msg.content && sh.timestamp)) {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      }
    }

    // Add current user message
    messages.push({
      role: "user",
      content: message,
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature: 0.3, // Lower temperature for more focused, technical responses
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0].message.content || "";
    
    // Add assistant message to history
    addMessageToHistory(effectiveSessionId, "assistant", assistantMessage);

    return NextResponse.json({
      message: assistantMessage,
      intent: intentResult.intent,
      sessionId: effectiveSessionId,
      patches: parsedPatches?.patches || undefined,
      appliedPatches: appliedPatchesResult ? {
        dsl: appliedPatchesResult.dsl,
        code: appliedPatchesResult.code,
        patchesApplied: appliedPatchesResult.patchesApplied,
      } : undefined,
      metadata: {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        method: "openai",
        confidence: intentResult.confidence,
        targetId: intentResult.targetId,
        patchOperations: intentResult.patchOperations,
        parsedPatches: parsedPatches ? {
          count: parsedPatches.patches.length,
          confidence: parsedPatches.confidence,
          diagnostics: parsedPatches.diagnostics,
        } : undefined,
        appliedPatches: appliedPatchesResult ? {
          success: true,
          patchesApplied: appliedPatchesResult.patchesApplied,
          diagnostics: appliedPatchesResult.diagnostics,
        } : undefined,
        hasExistingDSL: !!session.currentDSL || !!context?.dsl,
        currentAssetId: session.currentAssetId,
        currentRevisionId: session.currentRevisionId,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        fallback: true,
        message: "I encountered an error. The component was generated using the UI-DSL generator.",
      },
      { status: 500 }
    );
  }
}


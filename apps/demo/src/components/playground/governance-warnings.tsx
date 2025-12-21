/**
 * Governance Warnings Component
 * 
 * EPIC F: F3 - Enforcement Points (Studio UI Integration)
 * 
 * Displays soft warnings from Governance Rule Engine in Studio.
 * These are non-blocking warnings shown during development.
 */

"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { AlertTriangle, CheckCircle2, XCircle, Info, BarChart3, Play } from "lucide-react";
import { Button } from "@fragment_ui/ui";
import type { RuleViolation } from "@/lib/governance";
import type { PolicyBundle } from "@/lib/governance";
import { enforceStudio, getRulesFromBundles } from "@/lib/governance";
import type { UiPage } from "@fragment_ui/ui-dsl";
import type { EnforcementResult } from "@/lib/governance";
import { executeRules } from "@/lib/governance";
import type { RuleExecutionContext } from "@/lib/governance";
import type { ComponentTestCell, TestCategory, TestStatus, IssueItem } from "@/types/quality";

export interface GovernanceWarningsProps {
  code: string;
  dsl?: UiPage | null;
  storiesCode?: string;
  policyBundles?: PolicyBundle[];
  className?: string;
}

/**
 * Governance Warnings Component
 * 
 * Shows soft warnings from Governance rules that don't block development
 * but should be addressed before submission.
 */
export function GovernanceWarnings({
  code,
  dsl,
  storiesCode,
  policyBundles = ["core-ds"],
  className = "",
}: GovernanceWarningsProps) {
  const [violations, setViolations] = useState<RuleViolation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isCheckingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousCodeRef = useRef<string>("");
  const [enforcementResult, setEnforcementResult] = useState<EnforcementResult | null>(null);
  const [ruleResults, setRuleResults] = useState<Array<{
    ruleId: string;
    ruleName: string;
    passed: boolean;
    violations: number;
    status?: "passed" | "failed" | "warn" | "not_implemented" | "missing";
  }>>([]);
  
  // Store results in memory (keyed by code hash for persistence)
  const resultsCacheRef = useRef<Map<string, {
    enforcementResult: EnforcementResult | null;
    ruleResults: Array<{ ruleId: string; ruleName: string; passed: boolean; violations: number }>;
    violations: RuleViolation[];
  }>>(new Map());
  
  // Request deduplication: track in-flight requests to avoid duplicate calls
  const inFlightRequestsRef = useRef<Set<string>>(new Set());

  // Extract component name from code
  // First try to find the actual component name used in JSX (e.g., <Accordion> -> "Accordion")
  // Then fall back to function name (e.g., "accordionExample" -> try to extract "Accordion")
  const componentName = useMemo(() => {
    // List of known component names from the UI library
    const knownComponents = [
      "Button", "Input", "Badge", "Card", "Separator", "Spinner", "Progress",
      "Accordion", "AlertDialog", "Avatar", "Breadcrumbs", "Checkbox", "RadioGroup",
      "Select", "Switch", "Textarea", "Dialog", "Table", "Tabs", "Skeleton", "Slider",
      "FormField", "Carousel", "Combobox", "CommandPalette", "ContextMenu", "DatePicker",
      "DropdownMenu", "HoverCard", "NavigationMenu", "Pagination", "Popover", "Sheet",
      "Tooltip", "VirtualList", "VirtualTable", "Menubar", "Calendar", "Collapsible",
      "Toggle", "ToggleGroup", "ScrollArea", "Resizable", "DataTable", "FormEnhanced",
      "FormArray", "MultiSelect", "Stepper", "Timeline", "TreeView", "Alert",
      "AspectRatio", "FileUpload", "Radio", "Rating", "SegmentedControl", "SplitButton",
      "TagInput", "Kbd", "Form", "FormContainer", "PasswordInput",
    ];
    
    // Try to find component name in JSX (e.g., <Accordion>, <AccordionItem>, etc.)
    for (const comp of knownComponents) {
      // Look for JSX usage: <ComponentName, <ComponentName>, or ComponentName(
      const jsxPattern = new RegExp(`<${comp}(?:\\s|>|/)|${comp}\\(`, 'i');
      if (jsxPattern.test(code)) {
        return comp;
      }
    }
    
    // Fall back to extracting from function name and try to match known components
    const functionMatch = code.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/);
    if (functionMatch) {
      const functionName = functionMatch[1];
      
      // Try to extract component name from function name
      // e.g., "accordionExample" -> "Accordion"
      // e.g., "buttonDemo" -> "Button"
      for (const comp of knownComponents) {
        if (functionName.toLowerCase().includes(comp.toLowerCase()) || 
            comp.toLowerCase().includes(functionName.toLowerCase())) {
          return comp;
        }
      }
      
      // If no match, try to capitalize first letter (e.g., "accordion" -> "Accordion")
      const capitalized = functionName.charAt(0).toUpperCase() + functionName.slice(1);
      if (knownComponents.includes(capitalized)) {
        return capitalized;
      }
    }
    
    return undefined;
  }, [code]);

  // Generate cache key from code
  const cacheKey = useMemo(() => {
    if (!code || code.trim() === "") return "";
    // Simple hash: use code length and first/last 100 chars as key
    const codeHash = `${code.length}-${code.substring(0, 100)}-${code.substring(Math.max(0, code.length - 100))}`;
    return codeHash;
  }, [code]);

  // Helper to save results to localStorage
  const saveResultsToStorage = useCallback((componentName: string, results: {
    enforcementResult: EnforcementResult | null;
    ruleResults: Array<{ ruleId: string; ruleName: string; passed: boolean; violations: number }>;
    violations: RuleViolation[];
  }) => {
    if (typeof window === "undefined" || !componentName) return;
    
    try {
      const storageKey = `governance-test-results-${componentName}`;
      localStorage.setItem(storageKey, JSON.stringify({
        ...results,
        timestamp: Date.now(),
        cacheKey, // Store cache key to verify it matches
      }));
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[GovernanceWarnings] Failed to save results to localStorage:", error);
      }
    }
  }, [cacheKey]);

  // Helper to load results from localStorage
  const loadResultsFromStorage = useCallback((componentName: string): {
    enforcementResult: EnforcementResult | null;
    ruleResults: Array<{ ruleId: string; ruleName: string; passed: boolean; violations: number }>;
    violations: RuleViolation[];
  } | null => {
    if (typeof window === "undefined" || !componentName) return null;
    
    try {
      const storageKey = `governance-test-results-${componentName}`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      // Verify cache key matches (code hasn't changed)
      if (parsed.cacheKey !== cacheKey) {
        // Code changed, remove old results
        localStorage.removeItem(storageKey);
        return null;
      }
      
      // Check if results are not too old (24 hours)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (parsed.timestamp && Date.now() - parsed.timestamp > maxAge) {
        localStorage.removeItem(storageKey);
        return null;
      }
      
      return {
        enforcementResult: parsed.enforcementResult,
        ruleResults: parsed.ruleResults,
        violations: parsed.violations,
      };
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[GovernanceWarnings] Failed to load results from localStorage:", error);
      }
      return null;
    }
  }, [cacheKey]);

  // Cache for rule engine results to avoid re-running on every render
  const ruleEngineCacheRef = useRef<Map<string, EnforcementResult>>(new Map());
  const ruleEngineTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Run Governance rule engine checks automatically when code changes
  // This checks for violations like hardcoded colors, raw HTML, etc.
  // OPTIMIZED: Only run when code actually changes, with longer debounce, and cache results
  useEffect(() => {
    if (!code || code.trim() === "" || !dsl) {
      return;
    }

    // Clear any pending rule engine check
    if (ruleEngineTimeoutRef.current) {
      clearTimeout(ruleEngineTimeoutRef.current);
    }

    // Create cache key from code hash (simple hash)
    const codeHash = code.length.toString() + code.substring(0, 50).replace(/\s/g, '');
    const cacheKey = `rule-engine-${codeHash}`;

    // Check cache first
    const cached = ruleEngineCacheRef.current.get(cacheKey);
    if (cached) {
      // Use cached result
      setViolations((prevViolations) => {
        const existingRuleIds = new Set(prevViolations.map(v => v.ruleId));
        const newRuleViolations = cached.violations.filter(
          v => !existingRuleIds.has(v.ruleId)
        );
        return [...prevViolations, ...newRuleViolations];
      });
      return;
    }

    // Debounce rule engine checks (longer debounce to avoid blocking)
    // Only run if code hasn't changed for 2 seconds
    ruleEngineTimeoutRef.current = setTimeout(async () => {
      // Double-check code hasn't changed during debounce
      if (!code || code.trim() === "" || !dsl) {
        return;
      }

      // Request deduplication: check if request is already in flight
      if (inFlightRequestsRef.current.has(cacheKey)) {
        console.log("[GovernanceWarnings] Request already in flight, skipping duplicate");
        return;
      }

      // Mark request as in flight
      inFlightRequestsRef.current.add(cacheKey);

      try {
        const context: RuleExecutionContext = {
          tsx: code,
          dsl: dsl as any,
          storiesCode,
          componentName: componentName || "Unknown",
        };

        // Run Governance rule engine (soft warnings for Studio)
        const ruleEngineResult = await enforceStudio(context, policyBundles);
        
        // Cache result
        ruleEngineCacheRef.current.set(cacheKey, ruleEngineResult);
        // Limit cache size to prevent memory leaks (LRU: remove oldest entries)
        const MAX_CACHE_SIZE = 20; // Increased from 10 to 20 for better performance
        if (ruleEngineCacheRef.current.size > MAX_CACHE_SIZE) {
          // Remove oldest entries (first 5)
          const keysToRemove = Array.from(ruleEngineCacheRef.current.keys()).slice(0, 5);
          keysToRemove.forEach(key => {
            ruleEngineCacheRef.current.delete(key);
          });
        }
        
        // Merge rule engine violations with existing violations from tests
        // Rule engine violations are for immediate feedback (hardcoded colors, etc.)
        setViolations((prevViolations) => {
          // Filter out rule engine violations that are already in prevViolations
          const existingRuleIds = new Set(prevViolations.map(v => v.ruleId));
          const newRuleViolations = ruleEngineResult.violations.filter(
            v => !existingRuleIds.has(v.ruleId)
          );
          
          // Combine: keep test violations, add rule engine violations
          return [...prevViolations, ...newRuleViolations];
        });

        // Update enforcement result (merge with existing if any)
        if (ruleEngineResult) {
          setEnforcementResult((prev) => {
            if (!prev) {
              return ruleEngineResult;
            }
            // Merge: combine violations, sum errors/warnings
            return {
              passed: prev.passed && ruleEngineResult.passed,
              errors: prev.errors + ruleEngineResult.errors,
              warnings: prev.warnings + ruleEngineResult.warnings,
              violations: [...prev.violations, ...ruleEngineResult.violations],
              blocksApproval: false, // Studio never blocks
            };
          });
        }
      } catch (error) {
        console.warn("[GovernanceWarnings] Error running rule engine checks:", error);
        // Don't show error to user - rule engine checks are optional
      } finally {
        // Remove from in-flight requests
        inFlightRequestsRef.current.delete(cacheKey);
      }
    }, 2000); // Increased debounce to 2 seconds to reduce load

    return () => {
      if (ruleEngineTimeoutRef.current) {
        clearTimeout(ruleEngineTimeoutRef.current);
        ruleEngineTimeoutRef.current = null;
      }
    };
  }, [code, dsl, storiesCode, componentName, policyBundles]);

  // Load cached test results when component changes (NO automatic API calls)
  useEffect(() => {
    // Don't reset results if we're currently running tests
    if (isCheckingRef.current || isLoading) {
      return;
    }
    
    const codeChanged = previousCodeRef.current !== code;
    previousCodeRef.current = code;

    if (!componentName || !code || code.trim() === "") {
      setViolations([]);
      setEnforcementResult(null);
      setRuleResults([]);
      setIsLoading(false);
      return;
    }

    // Try to load from memory cache first
    const cached = resultsCacheRef.current.get(cacheKey);
    if (cached) {
      console.log("[GovernanceWarnings] Loading from memory cache:", {
        cacheKey,
        hasEnforcementResult: !!cached.enforcementResult,
        ruleResultsCount: cached.ruleResults.length,
      });
      setViolations(cached.violations);
      setEnforcementResult(cached.enforcementResult);
      setRuleResults(cached.ruleResults);
      setIsLoading(false);
      setError(null);
      return;
    }

    // If not in memory, try to load from localStorage
    const stored = loadResultsFromStorage(componentName);
    if (stored) {
      console.log("[GovernanceWarnings] Loading from localStorage:", {
        componentName,
        hasEnforcementResult: !!stored.enforcementResult,
        ruleResultsCount: stored.ruleResults.length,
      });
      setViolations(stored.violations);
      setEnforcementResult(stored.enforcementResult);
      setRuleResults(stored.ruleResults);
      setIsLoading(false);
      setError(null);
      // Also restore to memory cache
      resultsCacheRef.current.set(cacheKey, stored);
      return;
    }

      // No cached results - show empty state (no loading, no API call)
    // BUT: Don't reset if we already have results (tests may have just completed)
    if (enforcementResult === null && ruleResults.length === 0) {
      setViolations([]);
      setEnforcementResult(null);
      setRuleResults([]);
      setIsLoading(false);
      setError(null);
    }
  }, [componentName, cacheKey, code, loadResultsFromStorage]);
  
  // Cleanup on unmount - cancel any ongoing processes
  useEffect(() => {
    return () => {
      // Cancel any ongoing checks
      isCheckingRef.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (ruleEngineTimeoutRef.current) {
        clearTimeout(ruleEngineTimeoutRef.current);
        ruleEngineTimeoutRef.current = null;
      }
      // Clear rule engine cache on unmount to prevent memory leaks
      ruleEngineCacheRef.current.clear();
    };
  }, []);

  // Function to map QualityDashboard test results to Governance format
  const mapTestResultsToGovernance = (
    testCells: ComponentTestCell[],
    componentName: string | undefined
  ): {
    ruleResults: Array<{ ruleId: string; ruleName: string; passed: boolean; violations: number }>;
    violations: RuleViolation[];
  } => {
    if (!componentName) {
      return { ruleResults: [], violations: [] };
    }

    const categoryLabels: Record<TestCategory, string> = {
      a11y: "A11y",
      unit: "Unit",
      e2e: "E2E",
      visual: "Visual",
      performance: "Perf",
      responsive: "RWD",
      interactions: "Inter.",
      states: "States",
    };

    const ruleResults: Array<{ ruleId: string; ruleName: string; passed: boolean; violations: number }> = [];
    const violations: RuleViolation[] = [];

    // Filter test cells for this component
    // Try exact match first, then case-insensitive, then partial match
    let componentTests = testCells.filter((cell) => cell.component === componentName);
    
    if (componentTests.length === 0 && componentName) {
      // Try case-insensitive match
      componentTests = testCells.filter((cell) => 
        cell.component.toLowerCase() === componentName.toLowerCase()
      );
    }
    
    if (componentTests.length === 0 && componentName) {
      // Try partial match
      const componentNameLower = componentName.toLowerCase();
      componentTests = testCells.filter((cell) => 
        cell.component.toLowerCase().includes(componentNameLower) ||
        componentNameLower.includes(cell.component.toLowerCase())
      );
    }

    // Get all test categories
    const categories: TestCategory[] = ["a11y", "unit", "e2e", "visual", "performance", "responsive", "interactions", "states"];

    categories.forEach((category) => {
      const testCell = componentTests.find((cell) => cell.category === category);
      const status = testCell?.status || "missing";
      
      // IMPORTANT: "missing" status means test is not implemented, not failed
      // Only mark as "passed" if status is explicitly "pass"
      // Mark as "not implemented" if status is "missing"
      const passed = status === "pass";
      const notImplemented = status === "missing";
      const violationsCount = testCell?.issues || 0;

      ruleResults.push({
        ruleId: category,
        ruleName: categoryLabels[category],
        passed: passed && !notImplemented, // Only passed if not missing
        violations: violationsCount,
        // Add status for UI display
        status: notImplemented ? "not_implemented" : (status === "pass" ? "passed" : status),
      } as any);

      // Create violations for failed/warned tests (but not for missing/not implemented)
      if (status === "fail" || status === "warn") {
        violations.push({
          ruleId: category,
          ruleName: categoryLabels[category],
          severity: status === "fail" ? "error" : "warning",
          message: `${categoryLabels[category]} test ${status === "fail" ? "failed" : "warned"}: ${testCell?.topIssues?.join(", ") || "See details"}`,
          location: {
            file: componentName,
          },
        });
      } else if (notImplemented) {
        // Add info violation for not implemented tests (so they show up but as info, not error)
        violations.push({
          ruleId: category,
          ruleName: categoryLabels[category],
          severity: "info",
          message: `${categoryLabels[category]} test is not currently implemented. This test category requires additional setup.`,
          location: {
            file: componentName,
          },
        });
      }
    });

    return { ruleResults, violations };
  };

  // Function to run QualityDashboard tests for component
  const runChecks = React.useCallback(async () => {
    if (!code || code.trim() === "") {
      return;
    }

    if (!componentName) {
      setError("Component name could not be extracted from code");
      return;
    }

    // Check if already checking
    if (isCheckingRef.current) {
      return;
    }

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    // Mark as checking
    isCheckingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    // Clear any cached results to force fresh execution
    if (cacheKey) {
      resultsCacheRef.current.delete(cacheKey);
    }
    
    // Add minimum delay to ensure loading state is visible
    await new Promise(resolve => setTimeout(resolve, 300));

    // Auto-hide loading after 120 seconds (fallback safety - tests may take longer)
    // BUT: Don't stop checking for results - tests may still be running
    loadingTimeoutRef.current = setTimeout(() => {
      console.warn("[GovernanceWarnings] Loading timeout - hiding loading state, but continuing to check for results");
      setIsLoading(false);
      // DON'T set isCheckingRef.current = false here - we still want to fetch results
    }, 120000);
    
    // Track if component unmounted or user navigated away
    let isCancelled = false;
    
    try {
      // First, trigger test run for this component ONLY
      // Pass component name to filter tests to only this component
      console.log("[GovernanceWarnings] Starting test run for component:", componentName);
      const runResponse = await fetch("/api/tests/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          component: componentName,
          // Don't pass category - we want all test categories for this component
        }),
      });

      if (!runResponse.ok) {
        throw new Error("Failed to start test run");
      }

      const runResult = await runResponse.json();
      console.log("[GovernanceWarnings] Test run started:", runResult);
      
      // Poll for test completion (with extended timeout - tests can take 2+ minutes)
      // Also check if results are available even if status is still "running"
      let attempts = 0;
      const maxAttempts = 180; // 180 seconds (3 minutes) - tests can take longer
      let resultsAvailable = false;
      
      while (attempts < maxAttempts && !isCancelled && !resultsAvailable) {
        // OPTIMIZED: Increase polling interval to 2 seconds to reduce load
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds (was 1 second)
        
        // Check if component unmounted (but don't cancel if just loading timeout)
        // Only cancel if isCheckingRef was explicitly set to false (user action)
        if (!isCheckingRef.current && attempts < 30) {
          // Only cancel early if it's been less than 60 seconds (likely user action)
          console.log("[GovernanceWarnings] Check cancelled early (likely user action)");
          isCancelled = true;
          break;
        }
        
        // OPTIMIZED: Check test status less frequently (every 2 attempts = every 4 seconds)
        if (attempts % 2 === 0) {
          try {
            const statusResponse = await fetch("/api/tests/status");
            if (statusResponse.ok) {
              const status = await statusResponse.json();
              console.log("[GovernanceWarnings] Test status check:", {
                attempt: attempts + 1,
                overallStatus: status.overallStatus,
              });
              
              if (status.overallStatus === "completed" || status.overallStatus === "error") {
                console.log("[GovernanceWarnings] Tests completed, waiting for results to be saved...");
                // Wait a bit more for results to be saved
                await new Promise(resolve => setTimeout(resolve, 3000)); // Increased to 3 seconds
                resultsAvailable = true;
                break;
              }
            } else {
              console.warn("[GovernanceWarnings] Failed to fetch test status:", statusResponse.status);
            }
          } catch (error) {
            console.warn("[GovernanceWarnings] Error checking test status:", error);
            // Continue polling even if status check fails
          }
        }
        
        // IMPORTANT: Also check if results are already available (even if status is "running")
        // Some tests may complete and save results before status is updated
        // OPTIMIZED: Check less frequently (every 5 attempts = every 10 seconds) to reduce API calls
        if (attempts > 0 && attempts % 5 === 0) {
          try {
            const componentsResponse = await fetch("/api/tests/components");
            if (componentsResponse.ok) {
              const allTestCells = await componentsResponse.json();
              
              // Log all component names for debugging
              if (attempts === 3) {
                const uniqueComponents = [...new Set(allTestCells.map((cell: ComponentTestCell) => cell.component))];
                console.log("[GovernanceWarnings] Available components in results:", uniqueComponents);
                console.log("[GovernanceWarnings] Looking for component:", componentName);
              }
              
              // Try exact match first, then case-insensitive, then partial match
              let componentTestCells = allTestCells.filter((cell: ComponentTestCell) => cell.component === componentName);
              
              if (componentTestCells.length === 0 && componentName) {
                // Try case-insensitive match
                componentTestCells = allTestCells.filter((cell: ComponentTestCell) => 
                  cell.component.toLowerCase() === componentName.toLowerCase()
                );
              }
              
              if (componentTestCells.length === 0 && componentName) {
                // Try partial match
                const componentNameLower = componentName.toLowerCase();
                componentTestCells = allTestCells.filter((cell: ComponentTestCell) => 
                  cell.component.toLowerCase().includes(componentNameLower) ||
                  componentNameLower.includes(cell.component.toLowerCase())
                );
              }
              
              console.log("[GovernanceWarnings] Checking for results:", {
                attempt: attempts + 1,
                componentName,
                componentTestCellsCount: componentTestCells.length,
                allTestCellsCount: allTestCells.length,
                componentTestCells: componentTestCells.map((cell: ComponentTestCell) => ({
                  component: cell.component,
                  category: cell.category,
                  status: cell.status,
                })),
              });
              
              if (componentTestCells.length > 0) {
                // Check if we have any non-"missing" results
                const hasRealResults = componentTestCells.some((cell: ComponentTestCell) => 
                  cell.status && cell.status !== "missing"
                );
                
                if (hasRealResults) {
                  console.log("[GovernanceWarnings] Results available even though status is 'running', breaking polling");
                  resultsAvailable = true;
                  break;
                } else {
                  console.log("[GovernanceWarnings] Found component cells but all are 'missing', continuing to wait...");
                }
              }
            }
          } catch (error) {
            // Ignore errors when checking for results
            console.warn("[GovernanceWarnings] Error checking for results:", error);
          }
        }
        
        attempts++;
      }
      
      if (attempts >= maxAttempts) {
        console.warn("[GovernanceWarnings] Polling timeout reached, but will still try to fetch results");
      }
      
      // Even if polling timed out, try to fetch results (tests may have completed)
      // Only skip if explicitly cancelled (user action)
      if (isCancelled && attempts < 60) {
        console.log("[GovernanceWarnings] Skipping result fetch - cancelled early");
        return;
      }

      // Fetch test results and filter for this component ONLY
      // Retry multiple times in case results are still being saved (tests may take time to save)
      console.log("[GovernanceWarnings] Fetching test results for component:", componentName);
      let allTestCells: ComponentTestCell[] = [];
      let retries = 0;
      const maxRetries = 10; // Increased retries - results may take time to save
      
      while (retries < maxRetries) {
        try {
        const componentsResponse = await fetch("/api/tests/components");
        if (componentsResponse.ok) {
          allTestCells = await componentsResponse.json();
          
          // Filter test cells to ONLY this component
          const componentTestCells = allTestCells.filter((cell) => cell.component === componentName);
            
            console.log("[GovernanceWarnings] Fetched test results:", {
              retry: retries + 1,
              allTestCellsCount: allTestCells.length,
              componentTestCellsCount: componentTestCells.length,
              componentName,
            });
          
          // If we have results for this component, break
          if (componentTestCells.length > 0) {
              console.log("[GovernanceWarnings] Found results for component, breaking retry loop");
            break;
          }
          } else {
            console.warn("[GovernanceWarnings] Failed to fetch test results:", componentsResponse.status);
          }
        } catch (error) {
          console.error("[GovernanceWarnings] Error fetching test results:", error);
        }
        
        // Wait before retrying (longer wait for later retries)
        const waitTime = retries < 3 ? 1000 : 2000; // 1s for first 3, then 2s
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retries++;
      }
      
      if (retries >= maxRetries && allTestCells.length === 0) {
        console.warn("[GovernanceWarnings] Max retries reached, no results found. Will still try to process empty results.");
      }
      
      // Map test results to Governance format (only for this component)
      // Try exact match first, then case-insensitive, then partial match
      let componentTestCells = allTestCells.filter((cell) => cell.component === componentName);
      
      // If no exact match, try case-insensitive
      if (componentTestCells.length === 0) {
        componentTestCells = allTestCells.filter((cell) => 
          cell.component.toLowerCase() === componentName.toLowerCase()
        );
        if (componentTestCells.length > 0) {
          console.log("[GovernanceWarnings] Found case-insensitive match:", {
            expected: componentName,
            found: componentTestCells[0].component,
          });
        }
      }
      
      // If still no match, try partial match (e.g., "accordionExample" matches "Accordion")
      if (componentTestCells.length === 0) {
        const componentNameLower = componentName.toLowerCase();
        componentTestCells = allTestCells.filter((cell) => 
          cell.component.toLowerCase().includes(componentNameLower) ||
          componentNameLower.includes(cell.component.toLowerCase())
        );
        if (componentTestCells.length > 0) {
          console.log("[GovernanceWarnings] Found partial match:", {
            expected: componentName,
            found: componentTestCells.map(c => c.component),
          });
        }
      }
      const { ruleResults, violations: mappedViolations } = mapTestResultsToGovernance(componentTestCells, componentName);
      
      console.log("[GovernanceWarnings] Mapped test results:", {
        componentName,
        componentTestCellsCount: componentTestCells.length,
        allTestCellsCount: allTestCells.length,
        ruleResultsCount: ruleResults.length,
        violationsCount: mappedViolations.length,
        ruleResults: ruleResults.map(r => ({ ruleId: r.ruleId, ruleName: r.ruleName, passed: r.passed, violations: r.violations })),
      });
      
      // Always set results - even if empty, this indicates tests completed
      // IMPORTANT: ruleResults will always have 8 items (one per category), even if all are "missing"
      // But we need to ensure enforcementResult is set to mark tests as completed
      setRuleResults(ruleResults);
      
      // Calculate enforcement result
      // Even if no violations, we still create a result to indicate tests completed
      const errorCount = mappedViolations.filter((v) => v.severity === "error").length;
      const warningCount = mappedViolations.filter((v) => v.severity === "warning").length;
      
      // CRITICAL: Always create an enforcementResult, even if all tests are "missing"
      // This marks that tests were run (or attempted to run)
      const result: EnforcementResult = {
        passed: errorCount === 0,
        errors: errorCount,
        warnings: warningCount,
        violations: mappedViolations.map((v) => ({
          ruleId: v.ruleId,
          ruleName: v.ruleName,
          severity: v.severity,
          message: v.message,
          location: v.location,
        })),
        blocksApproval: false, // Studio never blocks
      };

      console.log("[GovernanceWarnings] Setting results in state:", {
        ruleResultsCount: ruleResults.length,
        violationsCount: mappedViolations.length,
        errorCount,
        warningCount,
        hasResult: !!result,
        result: {
          passed: result.passed,
          errors: result.errors,
          warnings: result.warnings,
          violationsCount: result.violations.length,
        },
      });

      // Set violations with all required fields
      // IMPORTANT: Use functional updates to ensure state is set correctly
      setViolations(mappedViolations);
      setEnforcementResult(result); // This is critical - it marks tests as completed
      setError(null);

      // Force a small delay to ensure state updates are processed
      // This helps with React's batching and ensures the UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("[GovernanceWarnings] Results set in state, component should re-render with results");

      // Save results to cache (both memory and localStorage)
      if (cacheKey && componentName) {
        const results = {
          enforcementResult: result,
          ruleResults,
          violations: mappedViolations,
        };
        
        // Save to memory cache
        resultsCacheRef.current.set(cacheKey, results);
        
        // Save to localStorage for persistence across component unmounts
        saveResultsToStorage(componentName, results);
      }
      
      console.log("[GovernanceWarnings] Test results saved:", {
        ruleResultsCount: ruleResults.length,
        violationsCount: mappedViolations.length,
        hasEnforcementResult: !!result,
      });
    } catch (err: any) {
      console.error("[GovernanceWarnings] Error running tests:", err);
      setError(err.message || "Failed to run tests");
      // Don't clear results on error - keep any partial results
      // setViolations([]);
      // setEnforcementResult(null);
      // setRuleResults([]);
    } finally {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setIsLoading(false);
      // Only reset isCheckingRef if we're done (not just loading timeout)
      // This allows results to be fetched even after loading timeout
      isCheckingRef.current = false;
      console.log("[GovernanceWarnings] Test run completed, isCheckingRef reset");
    }
  }, [code, componentName, cacheKey]);

  // Group violations by severity
  const violationsBySeverity = useMemo(() => {
    const grouped: Record<string, RuleViolation[]> = {
      error: [],
      warning: [],
      info: [],
    };

    violations.forEach((v) => {
      if (v.severity in grouped) {
        grouped[v.severity].push(v);
      }
    });

    return grouped;
  }, [violations]);

  const errorCount = violationsBySeverity.error.length;
  const warningCount = violationsBySeverity.warning.length;
  const infoCount = violationsBySeverity.info.length;
  const totalCount = errorCount + warningCount + infoCount;

  // Calculate test results summary
  // IMPORTANT: Don't count "not_implemented" tests as failed - they're just not available
  const totalRules = ruleResults.length || (enforcementResult ? Math.max(5, enforcementResult.errors + enforcementResult.warnings + (enforcementResult.passed ? 3 : 0)) : 0);
  const implementedRules = ruleResults.filter((r) => r.status !== "not_implemented" && r.status !== "missing").length;
  const passedRules = ruleResults.filter((r) => r.passed && r.status !== "not_implemented" && r.status !== "missing").length;
  const failedRules = ruleResults.filter((r) => !r.passed && r.status !== "not_implemented" && r.status !== "missing").length;
  const notImplementedRules = ruleResults.filter((r) => r.status === "not_implemented" || r.status === "missing").length;
  // Pass rate should only consider implemented tests
  const passRate = implementedRules > 0 ? (passedRules / implementedRules) : (enforcementResult && enforcementResult.passed ? 1 : 0);

  // Only show panel if we have code
  if (!code || code.trim() === "") {
    return null;
  }

  // Check if we have results to display
  // We have results if we have ruleResults (always 8 categories) OR enforcementResult
  // But we should show results even if all are "missing" - that's still a result
  const hasResults = ruleResults.length > 0 || enforcementResult;
  
  // Always show panel in Governance tab (even if no results yet)
  // The className prop can be used to control visibility in different contexts
  // If className includes "always-show", always render even without results
  const alwaysShow = className.includes("always-show");
  
  // Show welcome screen if no results and not loading
  // hasResults is true if we have ruleResults (always 8 categories) OR enforcementResult
  // ruleResults.length is always 8 (all categories), so we check if we have enforcementResult
  // which indicates tests were run and completed
  // IMPORTANT: ruleResults.length is always 8 (even for "missing" status), so we need to check enforcementResult
  const testsCompleted = enforcementResult !== null;
  
  console.log("[GovernanceWarnings] Render state:", {
    alwaysShow,
    isLoading,
    testsCompleted,
    hasEnforcementResult: enforcementResult !== null,
    ruleResultsLength: ruleResults.length,
    totalCount,
    error,
    totalRules,
    passedRules,
    failedRules,
  });
  
  if (alwaysShow && !testsCompleted && totalCount === 0 && !error) {
    return (
      <div 
        className={`${className} flex flex-col items-center justify-center`} 
        style={{ 
          minHeight: "calc(100vh - 200px)",
          paddingTop: "calc(50vh - 200px)",
          paddingBottom: "calc(50vh - 200px)",
        }}
      >
        <div className="text-center space-y-4 max-w-md">
          {isLoading ? (
            <>
              <h2 className="text-base font-semibold" style={{ color: "var(--foreground-primary)" }}>
                Running Tests...
              </h2>
              <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                Please wait while we run accessibility, responsiveness, and visual compliance tests for your component.
              </p>
              <div className="pt-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[color:var(--foreground-primary)] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
                    Tests in progress...
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground-primary)" }}>
            Governance Test
          </h2>
          <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
            Run in-depth accessibility, responsiveness, and visual compliance tests for your component.
          </p>
          <div className="pt-4">
            <Button
              variant="solid"
              size="sm"
              onClick={runChecks}
              disabled={!code || code.trim() === "" || isCheckingRef.current || isLoading}
              loading={isLoading}
              loadingText={isLoading ? "Running..." : undefined}
              leadingIcon={!isLoading ? <Play className="w-4 h-4" /> : undefined}
              className="h-8 px-3"
              style={{
                backgroundColor: "var(--foreground-primary)",
                color: "var(--background-primary)",
              }}
            >
              Run Test
            </Button>
          </div>
            </>
          )}
        </div>
      </div>
    );
  }
  
  // Only show panel if loading, has results, has violations, or has error
  // OR if alwaysShow is true (for dedicated Governance tab)
  if (!alwaysShow && !isLoading && !hasResults && totalCount === 0 && !error) {
    return null;
  }

  // If error occurred, show it
  if (error) {
    return (
      <div className={`${className} space-y-2 pb-4 border-b`} style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <h3 className="text-xs font-semibold" style={{ color: "var(--foreground-primary)" }}>
            Governance Checks
          </h3>
        </div>
        <div className="flex items-center gap-2 text-yellow-600 text-xs">
          <span>Failed to load: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-2 pb-4 border-b`} style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }} data-testid="governance-warnings-panel">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        {isLoading && !hasResults ? (
          <>
            <BarChart3 className="w-4 h-4 animate-pulse" style={{ color: "var(--foreground-secondary)" }} />
            <h3 className="text-xs font-semibold" style={{ color: "var(--foreground-primary)" }}>
              Governance Checks
            </h3>
          </>
        ) : (
          <>
            <h3 className="text-xs font-semibold" style={{ color: "var(--foreground-primary)" }}>
              Results
            </h3>
            {totalCount > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ 
              backgroundColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
              color: "var(--foreground-primary)"
            }} data-testid="governance-violations-count">
              {totalCount}
            </span>
            )}
            {totalCount === 0 && totalRules > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded text-green-600" data-testid="governance-pass-rate">
                {Math.round(passRate * 100)}%
              </span>
            )}
          </>
        )}
      </div>

      {/* Run Checks Button - Always show, but disabled during loading */}
      {(!hasResults || alwaysShow) && (
        <div className="mb-3">
          <Button
            variant="solid"
            size="sm"
            onClick={runChecks}
            disabled={!code || code.trim() === "" || isCheckingRef.current || isLoading}
            loading={isLoading}
            loadingText={isLoading ? "Running..." : undefined}
            leadingIcon={!isLoading ? <Play className="w-4 h-4" /> : undefined}
            className="h-8 px-3"
            style={{
              backgroundColor: "var(--foreground-primary)",
              color: "var(--background-primary)",
            }}
          >
            Run Test
          </Button>
        </div>
      )}
      
      {/* Test Results Summary - Always show in always-show mode, or when we have results */}
      {!isLoading && (alwaysShow || (enforcementResult || ruleResults.length > 0) && totalRules > 0) && (
        <div className="space-y-0 mb-3" data-testid="governance-test-results">
          {totalRules > 0 ? (
            <>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-xs font-medium" style={{ color: "var(--foreground-secondary)" }}>Pass Rate:</span>
                <span className={`text-sm font-semibold ${
                  passRate >= 1 ? "text-green-600" :
                  passRate >= 0.8 ? "text-yellow-600" :
                  "text-red-600"
                }`}>
                  {Math.round(passRate * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-xs font-medium" style={{ color: "var(--foreground-secondary)" }}>Total Rules:</span>
                <span className="text-sm font-semibold" style={{ color: "var(--foreground-primary)" }}>{totalRules}</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-xs font-medium" style={{ color: "var(--foreground-secondary)" }}>Passed:</span>
                <span className="text-sm font-semibold text-green-600">{passedRules}</span>
              </div>
              {failedRules > 0 ? (
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-xs font-medium" style={{ color: "var(--foreground-secondary)" }}>Failed:</span>
                  <span className="text-sm font-semibold text-red-600">{failedRules}</span>
                </div>
              ) : (
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-xs font-medium" style={{ color: "var(--foreground-secondary)" }}>Failed:</span>
                  <span className="text-sm font-semibold text-green-600">0</span>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
      
      {/* Show rule results details if available */}
      {!isLoading && ruleResults.length > 0 && (
        <div className="space-y-2 mb-3 pt-3 border-t" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
          <h4 className="text-xs font-semibold mb-1" style={{ color: "var(--foreground-primary)" }}>Rule Details:</h4>
          <div className="space-y-0.5">
            {ruleResults.map((rule, idx) => {
              const isNotImplemented = rule.status === "not_implemented" || rule.status === "missing";
              const isPassed = rule.passed && !isNotImplemented;
              
              return (
              <div
                key={idx}
                  className="flex items-center justify-between py-1 rounded"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    ) : isNotImplemented ? (
                      <Info className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                  )}
                  <span className="text-xs font-medium truncate" style={{ color: "var(--foreground-primary)" }}>
                    {rule.ruleName || rule.ruleId}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {rule.violations > 0 && !isNotImplemented && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      backgroundColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)",
                      color: "var(--foreground-primary)"
                    }}>
                      {rule.violations} violation{rule.violations !== 1 ? 's' : ''}
                    </span>
                  )}
                    <span className={`text-xs font-medium ${
                      isPassed 
                        ? 'text-green-600' 
                        : isNotImplemented 
                        ? 'text-gray-500' 
                        : 'text-red-600'
                    }`}>
                      {isPassed ? 'Passed' : isNotImplemented ? 'Not Implemented' : 'Failed'}
                  </span>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Violations Summary */}
      {!isLoading && totalCount > 0 && (
        <div className="space-y-1 pt-2 border-t" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }}>
          {errorCount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <XCircle className="w-3 h-3 text-red-600" />
                <span className="text-xs" style={{ color: "var(--foreground-secondary)" }}>Errors:</span>
              </div>
              <span className="text-xs font-medium text-red-600">{errorCount}</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-orange-600" />
                <span className="text-xs" style={{ color: "var(--foreground-secondary)" }}>Warnings:</span>
              </div>
              <span className="text-xs font-medium text-orange-600">{warningCount}</span>
            </div>
          )}
          {infoCount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Info className="w-3 h-3 text-blue-600" />
                <span className="text-xs" style={{ color: "var(--foreground-secondary)" }}>Info:</span>
              </div>
              <span className="text-xs font-medium text-blue-600">{infoCount}</span>
            </div>
          )}
        </div>
      )}

      {/* Violations List */}
      {!isLoading && totalCount > 0 && (
        <div className="space-y-1.5 pt-2 max-h-64 overflow-y-auto" style={{ scrollbarWidth: "thin" }} data-testid="governance-violations-list">
          {violations.map((violation, idx) => (
            <div
              key={idx}
              className="p-2 rounded text-xs"
              style={{
                backgroundColor: violation.severity === "error"
                  ? "color-mix(in srgb, rgb(239 68 68) 5%, transparent)"
                  : violation.severity === "warning"
                  ? "color-mix(in srgb, rgb(249 115 22) 5%, transparent)"
                  : "color-mix(in srgb, rgb(59 130 246) 5%, transparent)",
                borderColor: violation.severity === "error"
                  ? "color-mix(in srgb, rgb(239 68 68) 20%, transparent)"
                  : violation.severity === "warning"
                  ? "color-mix(in srgb, rgb(249 115 22) 20%, transparent)"
                  : "color-mix(in srgb, rgb(59 130 246) 20%, transparent)",
                borderWidth: "1px",
              }}
              data-testid={`governance-violation-${violation.severity}`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  {violation.severity === "error" ? (
                    <XCircle className="w-3 h-3 text-red-600" />
                  ) : violation.severity === "warning" ? (
                    <AlertTriangle className="w-3 h-3 text-orange-600" />
                  ) : (
                    <Info className="w-3 h-3 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium mb-1" style={{ color: "var(--foreground-primary)" }}>
                    {violation.ruleName}
                  </div>
                  <div className="mb-1" style={{ color: "var(--foreground-secondary)" }}>
                    {violation.message}
                  </div>
                  {violation.location && (
                    <div className="text-xs mt-1" style={{ color: "var(--foreground-tertiary)" }}>
                      {violation.location.file && (
                        <span className="font-mono">{violation.location.file}</span>
                      )}
                      {violation.location.line && (
                        <>
                          <span className="mx-1">•</span>
                          <span>Line {violation.location.line}</span>
                        </>
                      )}
                    </div>
                  )}
                  {violation.fix && (
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: "color-mix(in srgb, var(--foreground-tertiary) 10%, transparent)" }}>
                      <div className="text-xs" style={{ color: "var(--foreground-secondary)" }}>
                        <span className="font-medium">Fix:</span> {violation.fix.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Passed Message - Show only if we don't have detailed results */}
      {!isLoading && totalCount === 0 && (!alwaysShow || totalRules === 0) && (
        <div className="flex items-center gap-2 text-xs text-green-600 py-1" data-testid="governance-all-passed">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>
            {totalRules > 0 
              ? `All checks passed (${passedRules}/${totalRules} rules)`
              : ""}
          </span>
        </div>
      )}
      
      {/* Success message when all passed and we have detailed results */}
      {!isLoading && totalCount === 0 && alwaysShow && totalRules > 0 && passedRules === totalRules && (
        <div className="flex items-center gap-2 text-sm text-green-600 py-2 px-3 rounded mb-3" style={{
          backgroundColor: "color-mix(in srgb, rgb(34 197 94) 10%, transparent)",
        }} data-testid="governance-all-passed-detailed">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-medium">
            All checks passed ({passedRules}/{totalRules} rules)
          </span>
        </div>
      )}

      {/* Policy Bundles Info */}
      {!isLoading && (
        <div className="pt-4 border-t" style={{ borderColor: "color-mix(in srgb, var(--foreground-primary) 10%, transparent)" }} data-testid="governance-policy-bundles">
          <div className="text-xs" style={{ color: "var(--foreground-secondary)" }}>
            Learn more about{" "}
            <a
              href="http://localhost:3000/docs/governance/policy-bundles"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "var(--foreground-primary)" }}
            >
              policy bundles in {policyBundles.join(", ")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}


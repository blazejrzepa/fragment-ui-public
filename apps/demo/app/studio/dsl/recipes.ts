/**
 * Recipes System
 * 
 * Handles recipe selection and slot filling for UI-DSL generation.
 * Recipes are pre-defined templates for common UI patterns.
 */

import type { UiDsl, UiPage, UiLayout } from "./types";
import { generateId } from "./types";
import { readFileSync } from "fs";
import { join } from "path";

export interface Recipe {
  name: string;
  description: string;
  layout: UiLayout;
  slots: Record<string, string[]>;
  keywords: string[];
}

export interface RecipesData {
  recipes: Record<string, Recipe>;
}

// Load recipes from JSON file
function loadRecipes(): Record<string, Recipe> {
  try {
    // Use relative path from process.cwd() (which is apps/demo in Next.js)
    const recipesPath = join(process.cwd(), "../../packages/blocks-recipes/recipes.json");
    const recipesData = JSON.parse(readFileSync(recipesPath, "utf-8"));
    return (recipesData as RecipesData).recipes;
  } catch (error) {
    console.error("Failed to load recipes:", error);
    return {};
  }
}

const recipes = loadRecipes();

/**
 * Classify user intent from prompt
 */
export function classifyIntent(prompt: string): "dashboard" | "marketing" | "form" | "other" {
  const lower = prompt.toLowerCase();
  
  if (lower.includes("dashboard") || lower.includes("analytics") || lower.includes("kpi") || 
      lower.includes("metrics") || lower.includes("sales") || lower.includes("revenue")) {
    return "dashboard";
  }
  
  if (lower.includes("landing") || lower.includes("marketing") || lower.includes("saas") ||
      lower.includes("hero") || lower.includes("features") || lower.includes("pricing") ||
      lower.includes("testimonials") || lower.includes("faq") || lower.includes("cta")) {
    return "marketing";
  }
  
  if (lower.includes("form") || lower.includes("formularz") || lower.includes("register") ||
      lower.includes("login") || lower.includes("signup")) {
    return "form";
  }
  
  return "other";
}

/**
 * Select appropriate recipe based on intent and prompt
 */
export function selectRecipe(intent: string, prompt: string): Recipe | null {
  const lower = prompt.toLowerCase();
  
  // Find recipes matching the intent
  const matchingRecipes = Object.entries(recipes).filter(([key, recipe]) => {
    // Check if recipe keywords match prompt
    const keywordMatches = recipe.keywords.some(keyword => 
      lower.includes(keyword.toLowerCase())
    );
    
    // Check intent match
    const intentMatch = 
      (intent === "dashboard" && key.includes("dashboard")) ||
      (intent === "marketing" && key.includes("marketing"));
    
    return keywordMatches || intentMatch;
  });
  
  if (matchingRecipes.length === 0) {
    return null;
  }
  
  // Score recipes by keyword matches
  const scored = matchingRecipes.map(([key, recipe]) => {
    const score = recipe.keywords.reduce((acc, keyword) => {
      if (lower.includes(keyword.toLowerCase())) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return { key, recipe, score };
  });
  
  // Return highest scoring recipe
  scored.sort((a, b) => b.score - a.score);
  return scored[0].recipe;
}

/**
 * Parse slot component string (e.g., "Component{param=value}")
 */
function parseSlotComponent(slot: string): { component: string; params: Record<string, string> } {
  const match = slot.match(/^([A-Za-z]+)(?:\{([^}]+)\})?$/);
  if (!match) {
    return { component: slot, params: {} };
  }
  
  const component = match[1];
  const paramsStr = match[2];
  const params: Record<string, string> = {};
  
  if (paramsStr) {
    // Parse params like "items=Analytics,Reports,Settings" or "type=line"
    const paramPairs = paramsStr.split(",");
    for (const pair of paramPairs) {
      const [key, value] = pair.split("=").map(s => s.trim());
      if (key && value) {
        params[key] = value;
      }
    }
  }
  
  return { component, params };
}

/**
 * Fill recipe slots with components based on prompt
 */
export function fillRecipeSlots(recipe: Recipe, prompt: string): UiDsl {
  const lower = prompt.toLowerCase();
  
  // Create base page with layout
  const page: UiPage = {
    id: generateId(),
    type: "page",
    title: recipe.name,
    layout: recipe.layout,
    sections: [],
  };
  
  // Handle dashboard layout
  if (recipe.layout.type === "dashboard") {
    const areas = recipe.layout.areas;
    
    // Fill header slots
    if (areas.includes("header") && recipe.slots.header) {
      for (const slot of recipe.slots.header) {
        const { component, params } = parseSlotComponent(slot);
        if (!page.sections) page.sections = [];
        page.sections.push({
          id: generateId(),
          kind: "header",
          title: component,
          content: [],
        });
      }
    }
    
    // Fill sidebar slots
    if (areas.includes("sidebar") && recipe.slots.sidebar) {
      for (const slot of recipe.slots.sidebar) {
        const { component, params } = parseSlotComponent(slot);
        if (component === "NavMenu" && params.items) {
          const items = params.items.split(",").map(s => s.trim());
          if (!page.sections) page.sections = [];
        page.sections.push({
            id: generateId(),
            kind: "sidebar",
            title: "Navigation",
            content: [],
          });
        }
      }
    }
    
    // Fill content slots
    if (areas.includes("content") && recipe.slots.content) {
      for (const slot of recipe.slots.content) {
        const { component, params } = parseSlotComponent(slot);
        if (component === "KpiRow" && params.items) {
          const items = params.items.split(",").map(s => s.trim());
          if (!page.sections) page.sections = [];
        page.sections.push({
            id: generateId(),
            kind: "content",
            title: `KPIs: ${items.join(", ")}`,
            content: [],
          });
        } else if (component === "Chart" && params.type) {
          if (!page.sections) page.sections = [];
        page.sections.push({
            id: generateId(),
            kind: "content",
            title: `${params.type.charAt(0).toUpperCase() + params.type.slice(1)} Chart`,
            content: [],
          });
        } else if (component === "DataTable" && params.filters) {
          const filters = params.filters.split(",").map(s => s.trim());
          if (!page.sections) page.sections = [];
        page.sections.push({
            id: generateId(),
            kind: "content",
            title: `Data Table (filters: ${filters.join(", ")})`,
            content: [],
          });
        } else {
          if (!page.sections) page.sections = [];
        page.sections.push({
            id: generateId(),
            kind: "content",
            title: component,
            content: [],
          });
        }
      }
    }
  }
  
  // Handle marketing layout
  if (recipe.layout.type === "marketing") {
    // Marketing layout sections are already defined in layout.sections
    // Just create placeholder sections
    if (!page.sections) page.sections = [];
    for (const sectionType of recipe.layout.sections) {
      page.sections.push({
        id: generateId(),
        kind: sectionType,
        title: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
        content: [],
      });
    }
  }
  
  return page;
}

/**
 * Check if a prompt matches a recipe
 */
export function matchesRecipe(prompt: string, recipe: Recipe): boolean {
  const lower = prompt.toLowerCase();
  return recipe.keywords.some(keyword => lower.includes(keyword.toLowerCase()));
}


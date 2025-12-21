/**
 * Parser for Decision Pattern prompts
 */

import type { ParseResult } from './parser';
import type { UiDecision } from './types';
import { generateId } from './types';

/**
 * Parse a decision pattern prompt
 */
export function parseDecisionPrompt(prompt: string, pattern: UiDecision['pattern']): ParseResult {
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract title
  const titleMatch = prompt.match(/(?:create|build|make)\s+(?:a\s+)?(?:pricing\s+)?(?:page|screen|component)\s+(?:with|for|called)\s+([^,\.]+)/i);
  const title = titleMatch ? titleMatch[1].trim() : extractTitle(prompt);
  
  const dsl: UiDecision = {
    id: generateId(),
    type: 'decision',
    pattern,
    title: title || getDefaultTitle(pattern),
    options: [],
  };
  
  // Parse options based on pattern
  switch (pattern) {
    case 'compare-3':
      dsl.options = parseCompare3Options(prompt);
      break;
    case 'recommendation':
      dsl.options = parseRecommendationOptions(prompt);
      break;
    case 'tradeoffs':
      dsl.options = parseTradeoffsOptions(prompt);
      break;
    case 'review-confirm':
      // Review-confirm doesn't use options, it uses items
      (dsl as any).items = parseReviewConfirmItems(prompt);
      (dsl as any).confirmText = extractConfirmText(prompt);
      (dsl as any).cancelText = extractCancelText(prompt);
      (dsl as any).actionContractId = generateId();
      break;
  }
  
  return {
    dsl,
    confidence: 0.8,
  };
}

/**
 * Parse options for compare-3 pattern
 */
function parseCompare3Options(prompt: string): any[] {
  const options: any[] = [];
  
  // Try to extract plan names and prices - improved patterns
  // Pattern 1: "Starter ($9/month), Pro ($29/month), Enterprise ($99/month)"
  const pattern1 = prompt.matchAll(/(\w+)\s*\(?\$(\d+)\/?(\w+)?\)?/gi);
  // Pattern 2: "Starter: $9/month, Pro: $29/month"
  const pattern2 = prompt.matchAll(/(\w+):\s*\$(\d+)\/?(\w+)?/gi);
  // Pattern 3: "Starter plan $9 per month"
  const pattern3 = prompt.matchAll(/(\w+)\s+(?:plan|option|tier)?\s*\$(\d+)\s*(?:per|\/)?\s*(\w+)?/gi);
  
  const plans: Array<{ name: string; price: string; period?: string }> = [];
  
  // Try all patterns
  for (const match of [...pattern1, ...pattern2, ...pattern3]) {
    const name = match[1];
    const price = `$${match[2]}`;
    const period = match[3] || 'month';
    
    if (name && price && !plans.find(p => p.name.toLowerCase() === name.toLowerCase())) {
      plans.push({ name, price, period });
    }
  }
  
  // If we found plans, use them
  if (plans.length >= 2) {
    plans.slice(0, 3).forEach((plan, index) => {
      options.push({
        id: generateId(),
        name: plan.name,
        price: plan.price,
        pricePeriod: plan.period,
        features: [
          { key: 'storage', label: 'Storage', value: index === 0 ? '10GB' : index === 1 ? '100GB' : '1TB' },
          { key: 'support', label: 'Support', value: index === 0 ? 'Email' : index === 1 ? 'Priority' : '24/7' },
        ],
        ctaText: index === 2 ? 'Contact Sales' : 'Get Started',
        popular: index === 1,
        actionContractId: generateId(),
      });
    });
  } else {
    // Default options
    options.push(
      {
        id: generateId(),
        name: 'Starter',
        price: '$9',
        pricePeriod: 'month',
        features: [
          { key: 'storage', label: 'Storage', value: '10GB' },
          { key: 'support', label: 'Support', value: 'Email' },
        ],
        ctaText: 'Get Started',
        actionContractId: generateId(),
      },
      {
        id: generateId(),
        name: 'Pro',
        price: '$29',
        pricePeriod: 'month',
        features: [
          { key: 'storage', label: 'Storage', value: '100GB' },
          { key: 'support', label: 'Support', value: 'Priority' },
        ],
        ctaText: 'Get Started',
        popular: true,
        actionContractId: generateId(),
      },
      {
        id: generateId(),
        name: 'Enterprise',
        price: '$99',
        pricePeriod: 'month',
        features: [
          { key: 'storage', label: 'Storage', value: '1TB' },
          { key: 'support', label: 'Support', value: '24/7' },
        ],
        ctaText: 'Contact Sales',
        actionContractId: generateId(),
      }
    );
  }
  
  return options;
}

/**
 * Parse options for recommendation pattern
 */
function parseRecommendationOptions(prompt: string): any[] {
  const options: any[] = [];
  
  // Try to extract ranked options - improved patterns
  // Pattern 1: "rank 1: Pro Plan (95% match)"
  const pattern1 = prompt.matchAll(/(?:rank|#)\s*(\d+)[:\.]\s*(\w+(?:\s+\w+)*)\s*(?:\((\d+)%?\s*match)?\)?/gi);
  // Pattern 2: "Pro Plan (rank 1, 95% match)"
  const pattern2 = prompt.matchAll(/(\w+(?:\s+\w+)*)\s*\([^)]*rank\s*(\d+)[^)]*(\d+)%?/gi);
  // Pattern 3: "1. Pro Plan - 95%"
  const pattern3 = prompt.matchAll(/(\d+)\.\s*(\w+(?:\s+\w+)*)\s*[-–]\s*(\d+)%?/gi);
  
  const ranks: Array<{ rank: number; name: string; score?: number }> = [];
  
  // Try all patterns
  for (const match of [...pattern1, ...pattern2, ...pattern3]) {
    let rank: number;
    let name: string;
    let score: number | undefined;
    
    if (match.length >= 3) {
      // Pattern 1 or 3
      rank = parseInt(match[1]);
      name = match[2];
      score = match[3] ? parseInt(match[3]) : undefined;
    } else {
      // Pattern 2
      name = match[1];
      rank = parseInt(match[2]);
      score = match[3] ? parseInt(match[3]) : undefined;
    }
    
    if (rank && name && !ranks.find(r => r.rank === rank)) {
      ranks.push({ rank, name, score });
    }
  }
  
  // If we found ranks, use them
  if (ranks.length >= 2) {
    ranks.forEach(rank => {
      options.push({
        id: generateId(),
        name: rank.name,
        rank: rank.rank,
        reasoning: `Best balance of features and price`,
        score: rank.score,
        ctaText: 'Get Started',
        actionContractId: generateId(),
      });
    });
  } else {
    // Default options
    options.push(
      {
        id: generateId(),
        name: 'Pro Plan',
        rank: 1,
        reasoning: 'Best balance of features and price',
        score: 95,
        ctaText: 'Get Started',
        actionContractId: generateId(),
      },
      {
        id: generateId(),
        name: 'Enterprise Plan',
        rank: 2,
        reasoning: 'Great for teams',
        score: 85,
        ctaText: 'Contact Sales',
        actionContractId: generateId(),
      },
      {
        id: generateId(),
        name: 'Starter Plan',
        rank: 3,
        reasoning: 'Good starting point',
        score: 70,
        ctaText: 'Get Started',
        actionContractId: generateId(),
      }
    );
  }
  
  return options;
}

/**
 * Parse options for tradeoffs pattern
 */
function parseTradeoffsOptions(prompt: string): any[] {
  const options: any[] = [];
  
  // Try to extract dimensions
  const dimensionMatches = prompt.matchAll(/(\w+):\s*(\w+)\s*\((\d+)%?\)/gi);
  
  // Default options
  options.push(
    {
      id: generateId(),
      name: 'Quick Solution',
      description: 'Fast implementation, higher cost',
      dimensions: [
        { name: 'Cost', value: 80, label: 'High' },
        { name: 'Risk', value: 30, label: 'Low' },
        { name: 'Time', value: 20, label: 'Fast' },
      ],
      ctaText: 'Choose This',
      actionContractId: generateId(),
    },
    {
      id: generateId(),
      name: 'Balanced Approach',
      description: 'Moderate cost, risk, and time',
      dimensions: [
        { name: 'Cost', value: 50, label: 'Medium' },
        { name: 'Risk', value: 50, label: 'Medium' },
        { name: 'Time', value: 50, label: 'Medium' },
      ],
      ctaText: 'Choose This',
      actionContractId: generateId(),
    },
    {
      id: generateId(),
      name: 'Cost-Effective',
      description: 'Lower cost, longer time',
      dimensions: [
        { name: 'Cost', value: 20, label: 'Low' },
        { name: 'Risk', value: 60, label: 'Medium-High' },
        { name: 'Time', value: 80, label: 'Slow' },
      ],
      ctaText: 'Choose This',
      actionContractId: generateId(),
    }
  );
  
  return options;
}

/**
 * Parse items for review-confirm pattern
 */
function parseReviewConfirmItems(prompt: string): any[] {
  const items: any[] = [];
  
  // Try to extract items
  const itemMatches = prompt.matchAll(/(\w+(?:\s+\w+)*):\s*([^,\.]+)/gi);
  
  for (const match of itemMatches) {
    const label = match[1];
    const value = match[2].trim();
    
    if (label && value) {
      items.push({
        key: label.toLowerCase().replace(/\s+/g, '-'),
        label,
        value,
      });
    }
  }
  
  // Default items if none found
  if (items.length === 0) {
    items.push(
      { key: 'plan', label: 'Plan', value: 'Pro Plan' },
      { key: 'price', label: 'Price', value: '$29/month' },
      { key: 'billing', label: 'Billing', value: 'Monthly' },
    );
  }
  
  return items;
}

/**
 * Extract confirm text from prompt
 */
function extractConfirmText(prompt: string): string {
  const match = prompt.match(/(?:confirm|submit|order|checkout)\s+(?:text|button)?:?\s*["']?([^"',\.]+)["']?/i);
  return match ? match[1].trim() : 'Confirm Order';
}

/**
 * Extract cancel text from prompt
 */
function extractCancelText(prompt: string): string {
  const match = prompt.match(/(?:cancel|back)\s+(?:text|button)?:?\s*["']?([^"',\.]+)["']?/i);
  return match ? match[1].trim() : 'Cancel';
}

/**
 * Extract title from prompt
 */
function extractTitle(prompt: string): string | undefined {
  const match = prompt.match(/(?:create|build|make)\s+(?:a\s+)?(?:pricing\s+)?(?:page|screen|component)\s+(?:with|for|called)\s+([^,\.]+)/i);
  return match ? match[1].trim() : undefined;
}

/**
 * Get default title for pattern
 */
function getDefaultTitle(pattern: UiDecision['pattern']): string {
  switch (pattern) {
    case 'compare-3':
      return 'Choose Your Plan';
    case 'recommendation':
      return 'Recommended for You';
    case 'tradeoffs':
      return 'Compare Tradeoffs';
    case 'review-confirm':
      return 'Review & Confirm';
  }
}


/**
 * Form generation helper functions
 */

import type { UiForm, UiCommon } from "../types";
import type { GeneratorOptions } from "../generator";

/**
 * Generate review step for hard/high risk actions
 * Shows a summary section before actions that require confirmation
 */
export function generateReviewStep(dsl: UiForm, options: GeneratorOptions): string {
  const commonDsl = dsl as UiCommon;
  const hardOrHighRiskActions = commonDsl.actions?.filter(
    ac => ac.kind === 'hard' || ac.riskLevel === 'high'
  ) || [];
  
  if (hardOrHighRiskActions.length === 0) {
    return '';
  }
  
  // Collect action labels for the warning message
  const actionLabels = hardOrHighRiskActions.map(ac => ac.label).join(', ');
  
  // Generate field summary list (static for now - in real implementation, this would use form state)
  const fieldSummary = dsl.fields.map(f => {
    const fieldLabel = f.label || f.name;
    return `            <div className="flex justify-between py-1">
              <span className="text-[color:var(--color-fg-secondary)]">${fieldLabel}:</span>
              <span className="font-medium text-[color:var(--color-fg-primary)]">[Your ${fieldLabel}]</span>
            </div>`;
  }).join('\n');
  
  return `
        <div className="mt-6 p-4 border border-[color:var(--color-border-primary)] rounded-lg bg-[color:var(--color-surface-2)]" data-ui-id="${dsl.id}-review" data-section-role="confirmation" data-intent="review-summary">
          <h3 className="text-lg font-semibold mb-2">Review Before Proceeding</h3>
          <p className="text-sm text-[color:var(--color-fg-muted)] mb-4">
            Please review your information before ${actionLabels.toLowerCase()}. This action ${hardOrHighRiskActions.some(ac => ac.kind === 'hard') ? 'cannot be undone' : 'requires confirmation'}.
          </p>
          ${dsl.fields.length > 0 ? `<div className="space-y-2 text-sm">
${fieldSummary}
          </div>` : ''}
        </div>`;
}


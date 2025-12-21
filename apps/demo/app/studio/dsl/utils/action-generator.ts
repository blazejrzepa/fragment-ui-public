/**
 * Action generation utilities
 */

import type { ActionContract, UiForm } from "../types";

/**
 * Create default Action Contract for an action
 * Automatically determines kind and risk level based on action label/type
 */
export function createDefaultActionContract(action: NonNullable<UiForm['actions']>[0]): ActionContract {
  const label = action.label || 'Button';
  const labelLower = label.toLowerCase();
  
  // Determine kind based on action label
  let kind: "hard" | "soft" = "soft";
  let riskLevel: "low" | "medium" | "high" = "low";
  let requiresConfirmation = false;
  
  // Hard actions (destructive/irreversible)
  const hardKeywords = ['delete', 'remove', 'destroy', 'cancel', 'reset', 'clear', 'erase', 'usun', 'usuń', 'anuluj', 'kasuj'];
  const highRiskKeywords = ['delete', 'remove', 'destroy', 'erase', 'usun', 'usuń', 'kasuj'];
  
  if (hardKeywords.some(keyword => labelLower.includes(keyword))) {
    kind = "hard";
    requiresConfirmation = true;
    
    if (highRiskKeywords.some(keyword => labelLower.includes(keyword))) {
      riskLevel = "high";
    } else {
      riskLevel = "medium";
    }
  } else if (action.type === 'submit') {
    // Submit actions are usually soft, but can be medium risk
    kind = "soft";
    riskLevel = "medium";
  }
  
  return {
    id: action.id,
    label: label,
    kind,
    riskLevel,
    requiresConfirmation,
    preauthAllowed: kind === "soft" ? false : undefined,
  };
}

/**
 * Generate ACL attributes from Action Contract
 * Maps ActionContract to data-action-* attributes for agent-readable UI
 */
export function actionAclAttrs(actionContract: ActionContract): string[] {
  const attrs: string[] = [];
  
  // Ensure kind is set (fallback to "soft" if undefined)
  const kind = actionContract.kind || "soft";
  
  attrs.push(`data-action-id="${actionContract.id}"`);
  attrs.push(`data-action-kind="${kind}"`);
  
  if (actionContract.riskLevel) {
    attrs.push(`data-action-risk-level="${actionContract.riskLevel}"`);
  }
  
  if (actionContract.requiresConfirmation !== undefined) {
    attrs.push(`data-action-requires-confirmation="${actionContract.requiresConfirmation}"`);
  }
  
  if (actionContract.preauthAllowed !== undefined) {
    attrs.push(`data-action-preauth-allowed="${actionContract.preauthAllowed}"`);
  }
  
  if (actionContract.sideEffects && actionContract.sideEffects.length > 0) {
    attrs.push(`data-action-side-effects="${JSON.stringify(actionContract.sideEffects).replace(/"/g, '&quot;')}"`);
  }
  
  if (actionContract.telemetry) {
    if (actionContract.telemetry.eventName) {
      attrs.push(`data-action-telemetry-event="${actionContract.telemetry.eventName}"`);
    }
    if (actionContract.telemetry.properties) {
      attrs.push(`data-action-telemetry-props="${JSON.stringify(actionContract.telemetry.properties).replace(/"/g, '&quot;')}"`);
    }
  }
  
  return attrs;
}

/**
 * Generate action button JSX with ACL attributes
 */
export function generateAction(action: NonNullable<UiForm['actions']>[0], actionContract?: ActionContract): string {
  const props: string[] = [];
  
  if (action.type === 'submit') {
    props.push('type="submit"');
  } else {
    props.push('type="button"');
  }

  if (action.variant) {
    props.push(`variant="${action.variant}"`);
  }

  if (action.onClick) {
    props.push(`onClick={${action.onClick}}`);
  }

  // Add ACL attributes if ActionContract is provided
  if (actionContract) {
    const aclAttrs = actionAclAttrs(actionContract);
    props.push(...aclAttrs);
  }

  const componentProps = props.length > 0 ? ` ${props.join(' ')}` : '';
  return `<Button${componentProps} data-ui-id="${action.id}">${action.label}</Button>`;
}


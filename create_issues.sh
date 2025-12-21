#!/bin/bash

# Script to create GitHub issues for v1.1.0 components
# Requires GitHub CLI (gh) - install: brew install gh

echo "Creating GitHub issues for v1.1.0 Must-Have components..."

# Issue 1: Slider
gh issue create \
  --title "[Component] Slider" \
  --body "## Component Proposal

**Component Name:** Slider

**Category:** Form Control

**Priority:** Must-Have (v1.1.0)

## Description
Essential form control for numeric ranges, volume controls, filters.

## Use Cases
- Settings panels
- Filters
- Configuration
- Media controls

## API Design
\`\`\`typescript
interface SliderProps {
  defaultValue?: number[];
  value?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
}
\`\`\`

## Dependencies
- Package: \`@radix-ui/react-slider\`

## Estimated Effort
- Implementation: 2 hours
- Tests: 30 minutes
- Documentation: 30 minutes
- **Total:** 3 hours

## Acceptance Criteria
- [ ] Component implemented
- [ ] Unit tests added
- [ ] Storybook stories created
- [ ] Documentation page added
- [ ] Registry entry created
- [ ] Accessibility tested" \
  --label "component,enhancement,must-have" 2>/dev/null && echo "✅ Created: Slider" || echo "⚠️  Failed or already exists: Slider"

echo "Done! Check: https://github.com/blazejrzepa/fragment-ui/issues"

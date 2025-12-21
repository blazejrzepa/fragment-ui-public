# RFC Process - Fragment UI

## Overview

RFC (Request for Comments) is the process for proposing and discussing significant changes to Fragment UI. This ensures all stakeholders have visibility and input into major decisions.

## When to Create an RFC

Create an RFC for:
- ✅ New components or blocks
- ✅ Breaking changes to existing components
- ✅ API changes
- ✅ Process changes
- ✅ Architecture decisions
- ✅ Major feature additions

**Don't create an RFC for:**
- ❌ Bug fixes
- ❌ Documentation updates
- ❌ Minor improvements
- ❌ Internal refactoring

## RFC Template

```markdown
# RFC: [Title]

## Summary
Brief description of the proposal (1-2 sentences)

## Motivation
Why is this change needed? What problem does it solve?

## Detailed Design
Detailed explanation of the proposed change

## Alternatives Considered
What other approaches were considered? Why were they rejected?

## Impact
- Breaking changes?
- Migration path?
- Performance impact?
- Accessibility impact?

## Implementation Plan
- Steps to implement
- Timeline
- Dependencies

## Open Questions
Questions that need to be resolved

## References
Links to related issues, discussions, or documentation
```

## RFC Workflow

1. **Draft** - Create RFC document
2. **Review** - Submit for review (assign to DS Owner)
3. **Discussion** - Stakeholders provide feedback
4. **Approval** - DS Owner approves or rejects
5. **Implementation** - Implement approved RFC
6. **Completion** - Mark RFC as complete

## RFC Status

- `draft` - Initial draft, not yet submitted
- `review` - Under review
- `approved` - Approved, ready for implementation
- `rejected` - Rejected, will not be implemented
- `implementing` - Currently being implemented
- `completed` - Implementation complete

## RFC Repository

RFCs should be stored in `docs/rfcs/` directory with naming convention:
- `RFC-001-title.md`
- `RFC-002-title.md`
- etc.

## Review Criteria

RFCs are evaluated based on:
- Alignment with design system goals
- Impact on existing code
- Migration complexity
- Performance implications
- Accessibility considerations
- Developer experience

## Decision Making

- **DS Owner** - Final decision authority
- **Maintainers** - Provide technical review
- **Contributors** - Provide feedback and input

---

*Last updated: 2025-01-05*


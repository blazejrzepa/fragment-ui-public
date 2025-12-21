# Automated Component Testing Script

This document contains instructions for automated testing using MCP browser tools.

## Test Plan

### Components to Test: 67
1. Accordion
2. Alert
3. AspectRatio
4. Avatar
5. Badge
6. Breadcrumbs
7. Button
8. Calendar
9. Card
10. Carousel
11. Checkbox
12. Collapsible
13. ColorPicker
14. Combobox
15. CommandPalette
16. ContextMenu
17. DataTable
18. DatePicker
19. Dialog
20. DropdownMenu
21. FileUpload
22. Form
23. FormField
24. FormFieldEnhanced
25. HoverCard
26. Input
27. Kbd
28. Menubar
29. MultiSelect
30. NavigationMenu
31. Pagination
32. PasswordInput
33. Popover
34. Progress
35. Radio
36. Rating
37. Resizable
38. ScrollArea
39. SegmentedControl
40. Select
41. Separator
42. Sheet
43. Skeleton
44. Slider
45. Spinner
46. SplitButton
47. Stepper
48. Switch
49. TabContent
50. TabTrigger
51. Table
52. Tabs
53. TabsList
54. TagInput
55. Textarea
56. Timeline
57. Toast
58. Toggle
59. ToggleGroup
60. Tooltip
61. TreeView
62. activity-feed
63. chart
64. filter-bar
65. metric-card
66. notification-list
67. quick-actions

### Blocks to Test: 21
1. AnalyticsDashboard
2. AuthenticationBlock
3. BenefitsSection
4. CardGrid
5. ComparisonSection
6. DashboardLayout
7. FooterSection
8. FormContainer
9. KpiDashboard
10. NavigationHeader
11. PricingTable
12. SettingsScreen
13. VoiceChatPanel
14. cta-section
15. dashboard-widgets
16. faq-section
17. feature-grid-section
18. hero-section
19. stats-section
20. testimonials-section
21. widget-container

## Testing Steps (for each component/block)

1. Navigate to http://localhost:3002/studio
2. Click "Library" tab in left pane
3. Click "Component" or "Block" filter button
4. Click on component name
5. Wait for preview to load
6. Check console for errors
7. Navigate to http://localhost:3002/studio?tab=library
8. Verify component appears in library view
9. Record results

## Automated Test Commands

Run the following commands in sequence for each component:

```bash
# For each component:
# 1. Navigate
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

# 2. Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-library-tab"

# 3. Click Component/Block filter
mcp_cursor-ide-browser_browser_click --element "Component/Block button" --ref "ref-filter-button"

# 4. Click component
mcp_cursor-ide-browser_browser_click --element "ComponentName button" --ref "ref-component-button"

# 5. Check console
mcp_cursor-ide-browser_browser_console_messages

# 6. Check preview
mcp_cursor-ide-browser_browser_snapshot

# 7. Navigate to library tab
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"

# 8. Verify component
mcp_cursor-ide-browser_browser_snapshot
```

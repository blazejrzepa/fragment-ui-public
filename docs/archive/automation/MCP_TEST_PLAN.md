# Component Testing Plan

Total: 67 components + 21 blocks = 88 items

## Components

### 1. Accordion

# Test Accordion (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Accordion button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Accordion


### 2. Alert

# Test Alert (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Alert button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Alert


### 3. AspectRatio

# Test AspectRatio (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "AspectRatio button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: AspectRatio


### 4. Avatar

# Test Avatar (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Avatar button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Avatar


### 5. Badge

# Test Badge (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Badge button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Badge


### 6. Breadcrumbs

# Test Breadcrumbs (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Breadcrumbs button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Breadcrumbs


### 7. Button

# Test Button (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Button button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Button


### 8. Calendar

# Test Calendar (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Calendar button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Calendar


### 9. Card

# Test Card (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Card button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Card


### 10. Carousel

# Test Carousel (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Carousel button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Carousel


### 11. Checkbox

# Test Checkbox (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Checkbox button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Checkbox


### 12. Collapsible

# Test Collapsible (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Collapsible button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Collapsible


### 13. ColorPicker

# Test ColorPicker (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "ColorPicker button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: ColorPicker


### 14. Combobox

# Test Combobox (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Combobox button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Combobox


### 15. CommandPalette

# Test CommandPalette (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "CommandPalette button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: CommandPalette


### 16. ContextMenu

# Test ContextMenu (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "ContextMenu button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: ContextMenu


### 17. DataTable

# Test DataTable (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "DataTable button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: DataTable


### 18. DatePicker

# Test DatePicker (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "DatePicker button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: DatePicker


### 19. Dialog

# Test Dialog (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Dialog button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Dialog


### 20. DropdownMenu

# Test DropdownMenu (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "DropdownMenu button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: DropdownMenu


### 21. FileUpload

# Test FileUpload (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "FileUpload button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: FileUpload


### 22. Form

# Test Form (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Form button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Form


### 23. FormField

# Test FormField (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "FormField button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: FormField


### 24. FormFieldEnhanced

# Test FormFieldEnhanced (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "FormFieldEnhanced button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: FormFieldEnhanced


### 25. HoverCard

# Test HoverCard (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "HoverCard button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: HoverCard


### 26. Input

# Test Input (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Input button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Input


### 27. Kbd

# Test Kbd (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Kbd button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Kbd


### 28. Menubar

# Test Menubar (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Menubar button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Menubar


### 29. MultiSelect

# Test MultiSelect (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "MultiSelect button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: MultiSelect


### 30. NavigationMenu

# Test NavigationMenu (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "NavigationMenu button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: NavigationMenu


### 31. Pagination

# Test Pagination (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Pagination button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Pagination


### 32. PasswordInput

# Test PasswordInput (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "PasswordInput button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: PasswordInput


### 33. Popover

# Test Popover (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Popover button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Popover


### 34. Progress

# Test Progress (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Progress button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Progress


### 35. Radio

# Test Radio (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Radio button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Radio


### 36. Rating

# Test Rating (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Rating button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Rating


### 37. Resizable

# Test Resizable (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Resizable button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Resizable


### 38. ScrollArea

# Test ScrollArea (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "ScrollArea button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: ScrollArea


### 39. SegmentedControl

# Test SegmentedControl (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "SegmentedControl button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: SegmentedControl


### 40. Select

# Test Select (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Select button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Select


### 41. Separator

# Test Separator (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Separator button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Separator


### 42. Sheet

# Test Sheet (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Sheet button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Sheet


### 43. Skeleton

# Test Skeleton (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Skeleton button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Skeleton


### 44. Slider

# Test Slider (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Slider button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Slider


### 45. Spinner

# Test Spinner (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Spinner button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Spinner


### 46. SplitButton

# Test SplitButton (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "SplitButton button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: SplitButton


### 47. Stepper

# Test Stepper (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Stepper button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Stepper


### 48. Switch

# Test Switch (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Switch button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Switch


### 49. TabContent

# Test TabContent (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "TabContent button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: TabContent


### 50. TabTrigger

# Test TabTrigger (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "TabTrigger button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: TabTrigger


### 51. Table

# Test Table (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Table button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Table


### 52. Tabs

# Test Tabs (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Tabs button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Tabs


### 53. TabsList

# Test TabsList (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "TabsList button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: TabsList


### 54. TagInput

# Test TagInput (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "TagInput button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: TagInput


### 55. Textarea

# Test Textarea (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Textarea button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Textarea


### 56. Timeline

# Test Timeline (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Timeline button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Timeline


### 57. Toast

# Test Toast (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Toast button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Toast


### 58. Toggle

# Test Toggle (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Toggle button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Toggle


### 59. ToggleGroup

# Test ToggleGroup (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "ToggleGroup button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: ToggleGroup


### 60. Tooltip

# Test Tooltip (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "Tooltip button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: Tooltip


### 61. TreeView

# Test TreeView (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "TreeView button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: TreeView


### 62. activity-feed

# Test activity-feed (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "activity-feed button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: activity-feed


### 63. chart

# Test chart (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "chart button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: chart


### 64. filter-bar

# Test filter-bar (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "filter-bar button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: filter-bar


### 65. metric-card

# Test metric-card (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "metric-card button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: metric-card


### 66. notification-list

# Test notification-list (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "notification-list button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: notification-list


### 67. quick-actions

# Test quick-actions (Component)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Component filter button" --ref "ref-7ti75aycz4l"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "quick-actions button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: quick-actions


## Blocks

### 1. AnalyticsDashboard

# Test AnalyticsDashboard (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "AnalyticsDashboard button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: AnalyticsDashboard


### 2. AuthenticationBlock

# Test AuthenticationBlock (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "AuthenticationBlock button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: AuthenticationBlock


### 3. BenefitsSection

# Test BenefitsSection (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "BenefitsSection button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: BenefitsSection


### 4. CardGrid

# Test CardGrid (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "CardGrid button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: CardGrid


### 5. ComparisonSection

# Test ComparisonSection (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "ComparisonSection button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: ComparisonSection


### 6. DashboardLayout

# Test DashboardLayout (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "DashboardLayout button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: DashboardLayout


### 7. FooterSection

# Test FooterSection (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "FooterSection button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: FooterSection


### 8. FormContainer

# Test FormContainer (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "FormContainer button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: FormContainer


### 9. KpiDashboard

# Test KpiDashboard (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "KpiDashboard button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: KpiDashboard


### 10. NavigationHeader

# Test NavigationHeader (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "NavigationHeader button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: NavigationHeader


### 11. PricingTable

# Test PricingTable (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "PricingTable button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: PricingTable


### 12. SettingsScreen

# Test SettingsScreen (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "SettingsScreen button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: SettingsScreen


### 13. VoiceChatPanel

# Test VoiceChatPanel (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "VoiceChatPanel button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: VoiceChatPanel


### 14. cta-section

# Test cta-section (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "cta-section button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: cta-section


### 15. dashboard-widgets

# Test dashboard-widgets (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "dashboard-widgets button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: dashboard-widgets


### 16. faq-section

# Test faq-section (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "faq-section button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: faq-section


### 17. feature-grid-section

# Test feature-grid-section (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "feature-grid-section button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: feature-grid-section


### 18. hero-section

# Test hero-section (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "hero-section button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: hero-section


### 19. stats-section

# Test stats-section (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "stats-section button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: stats-section


### 20. testimonials-section

# Test testimonials-section (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "testimonials-section button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: testimonials-section


### 21. widget-container

# Test widget-container (Block)

## Step 1: Navigate to Studio
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio"

## Step 2: Click Library tab
mcp_cursor-ide-browser_browser_click --element "Library button" --ref "ref-pgh1qcwnxcq"
mcp_cursor-ide-browser_browser_wait_for --time 2

## Step 3: Filter by Component/Block
mcp_cursor-ide-browser_browser_click --element "Block filter button" --ref "ref-wsghdv5qk2e"
mcp_cursor-ide-browser_browser_wait_for --time 1

## Step 4: Click component
mcp_cursor-ide-browser_browser_click --element "widget-container button" --ref "ref-COMPONENT_REF"
mcp_cursor-ide-browser_browser_wait_for --time 3

## Step 5: Check Preview and Console
mcp_cursor-ide-browser_browser_console_messages
mcp_cursor-ide-browser_browser_snapshot

## Step 6: Test Library tab view
mcp_cursor-ide-browser_browser_navigate --url "http://localhost:3002/studio?tab=library"
mcp_cursor-ide-browser_browser_wait_for --time 2
mcp_cursor-ide-browser_browser_snapshot

## Step 7: Record results
# Update checklist: widget-container


# @fragment_ui/ui-native

React Native adapters for Fragment UI components. These components provide the same API and design tokens as their web counterparts, allowing you to share code between web and mobile.

## Installation

```bash
npm install @fragment_ui/ui-native @fragment_ui/tokens react react-native
```

## Usage

```tsx
import { Button, Input } from '@fragment_ui/ui-native';

function MyScreen() {
  return (
    <View>
      <Button variant="solid" size="md">
        Click me
      </Button>
      <Input 
        placeholder="Enter text..."
        label="Username"
      />
    </View>
  );
}
```

## Components

### Button

Same API as web `@fragment_ui/ui` Button:

```tsx
<Button 
  variant="solid" | "outline" | "ghost"
  size="sm" | "md" | "lg"
  loading={boolean}
  disabled={boolean}
>
  Button Text
</Button>
```

### Input

Same API as web `@fragment_ui/ui` Input, with additional React Native features:

```tsx
<Input 
  placeholder="Enter text..."
  label="Field Label"
  error="Error message"
  value={value}
  onChangeText={setValue}
/>
```

## Design Tokens

All components use the same design tokens from `@fragment_ui/tokens`, ensuring visual consistency across platforms.

## Platform-Specific Considerations

- **Touch Feedback**: Buttons use `TouchableOpacity` with active opacity
- **Keyboard**: Inputs work with React Native's keyboard handling
- **Styling**: Uses StyleSheet instead of CSS classes
- **Icons**: Requires React Native icon libraries (not included)

## Components

### Button ✅
- Variants: solid, outline, ghost
- Sizes: sm, md, lg
- Loading state
- Disabled state

### Input ✅
- Label support
- Error messages
- Placeholder text
- Validation states

### Checkbox ✅
- Checked/unchecked states
- Label support
- Disabled state
- Custom styling

### Radio & RadioGroup ✅
- Single selection
- Group management
- Label support
- Disabled state

### Switch ✅
- Toggle functionality
- Label support
- Disabled state
- Custom colors

## Future Components

More components will be added:
- Select/Dropdown
- DatePicker
- Dialog/Modal
- Navigation components

## Contributing

When adding new components:
1. Match the API of the web component
2. Use design tokens from `@fragment_ui/tokens`
3. Follow React Native best practices
4. Add proper TypeScript types
5. Include in Storybook (when available)


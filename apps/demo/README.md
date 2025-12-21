# Fragment UI Demo - AI Playground

## 🔗 Live Demo

**Production URL:** https://demo-oe8tmopzp-blakes-projects-7564cdfa.vercel.app/playground

## Overview

Fragment UI Demo is an AI-powered playground where you can build React components and forms using natural language. Simply describe what you want to build, and the AI generates complete, working code using Fragment UI components.

## Features

### 🚀 AI Playground

- **Natural Language Input**: Describe what you want to build in plain language
- **Automatic Code Generation**: AI generates complete React component code
- **Fragment UI Integration**: All generated components use Fragment UI design system
- **Demo Management**: Save, view, and manage your generated demos
- **Code Preview**: View and copy generated code

### Example Prompts

- "Zbuduj formularz rejestracyjny z polami: email, hasło i numer telefonu"
- "Create a registration form with fields A, B, and C"
- "Formularz kontaktowy z polami: imię, email, wiadomość"

## How It Works

1. **Enter a Prompt**: Describe what component or form you want to build
2. **AI Generates Code**: The system parses your prompt and generates React component code
3. **View & Save**: Generated components are saved and can be viewed later
4. **Live Preview**: See your component rendered in real-time with live editing
5. **Test**: Validate code syntax and component props directly in the browser
6. **Copy Code**: Copy the generated code to use in your projects

See [docs/HOW_IT_WORKS.md](./docs/HOW_IT_WORKS.md) for detailed architecture and workflow.

## Architecture

### API Route: `/api/generate`

The API route (`app/api/generate/route.ts`) handles:
- Parsing natural language prompts
- Extracting form fields and requirements
- Generating React component code
- Returning complete, ready-to-use code

### Components

- **`AIPromptInput`**: Input component for entering prompts
- **`ReactLiveRenderer`**: Renders generated components with live editing and preview using react-live
- **`DemoList`**: Displays list of saved demos

### Data Storage

Demos are stored in browser `localStorage` for now. Future versions may include:
- Server-side storage
- Database integration
- Sharing capabilities

## Usage

### Development

```bash
cd apps/demo
pnpm dev
```

The demo app runs on `http://localhost:3002`

### Accessing AI Playground

1. Navigate to `http://localhost:3002/playground`
2. Enter a prompt describing what you want to build
3. Click "Generate Component"
4. View the generated code and save it as a demo

### Automated Testing

Test prompts automatically from the command line:

```bash
# Basic test (no browser)
pnpm test-prompt "Zbuduj formularz rejestracyjny z polami: email, hasło"

# Test with browser rendering
pnpm test-prompt "List View z tabelą i paginacją" --browser

# Verbose output
pnpm test-prompt "Stwórz formularz kontaktowy" --browser --verbose
```

The test script will:
- ✅ Generate code via API
- ✅ Validate code syntax
- ✅ Check required component props
- ✅ (Optional) Test rendering in browser

See [docs/AUTOMATED_TESTING.md](./docs/AUTOMATED_TESTING.md) for more details.

## Future Enhancements

- [x] Real-time preview of generated components (implemented with react-live)
- [ ] Integration with MCP server for better AI capabilities
- [ ] Support for more complex component types
- [ ] Export to CodeSandbox/StackBlitz
- [ ] Sharing demos via URL
- [ ] Database storage for demos

## Technical Notes

### Current Implementation

- **Component Rendering**: Uses `react-live` for live editing and preview
- **Code Generation**: Uses `@fragment_ui/ui-dsl` package for structured code generation
- **Prompt Parsing**: Rule-based parsing with UI-DSL intermediate format
- **Storage**: Client-side only (localStorage)

### Security Considerations

- Generated code is executed in `react-live` context with proper React hooks support
- All Fragment UI components are available in scope
- Code is transpiled using Babel before execution
- Sanitize user inputs before code generation


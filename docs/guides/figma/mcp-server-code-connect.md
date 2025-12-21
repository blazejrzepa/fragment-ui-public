# 🔗 Code Connect through MCP Server in Figma

MCP Server (Model Context Protocol) is a new Figma feature that allows connecting components with code.

## 📋 What You See:

In **"MCP server"** section in Dev Mode you see:
```
Implement this design from Figma.
@https://www.figma.com/design/dccfbPgHqbWW7K687i9Fv3/Fragment-UI-Design-System?node-id=1304-13481&m=dev
```

This is **link to Button component** in Figma in Dev Mode.

---

## 🚀 How to Add Connection with Code:

### Option 1: Add Code Link in MCP Server

1. **In MCP server section:**
   - Click on text field (where prompt is)
   - You can add link to GitHub code

2. **Paste link to code:**
   ```
   Code: https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx
   ```

3. **Or use full prompt:**
   ```
   Implement this design from Figma.
   @https://www.figma.com/design/dccfbPgHqbWW7K687i9Fv3/Fragment-UI-Design-System?node-id=1304-13481&m=dev
   
   Code: https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx
   ```

---

### Option 2: Configure MCP Server with GitHub

1. **In MCP server section:**
   - Check if there's configuration option (⚙️ icon or "Settings")
   - You can add GitHub connection there

2. **If there's "Connect to GitHub" option:**
   - Click on it
   - Authorize access
   - Select repo: `blazejrzepa/fragment-ui`
   - MCP server will automatically detect files from `figma-code-connect/`

---

### Option 3: Use Prompt with Link

1. **In MCP server text field:**
   - You can use prompt with link to code:
   ```
   Implement this design from Figma.
   @https://www.figma.com/design/dccfbPgHqbWW7K687i9Fv3/Fragment-UI-Design-System?node-id=1304-13481&m=dev
   
   Related code: https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx
   
   Variants:
   - variant: solid, outline, ghost
   - size: sm
   - icons: leading, trailing
   ```

2. **Click "Send" or "Copy example prompt":**
   - MCP server will remember connection
   - In future will automatically use this link

---

## 📝 What You Can Do Now:

1. **Add code link in MCP server:**
   - Paste link to `button.tsx` in MCP server section
   - MCP server will remember connection

2. **Use "Copy example prompt":**
   - Click on button
   - Prompt will be copied with link to Figma
   - You can use it in AI tools (e.g. Claude, ChatGPT)

3. **Configure MCP Server:**
   - If there's configuration option, add GitHub connection
   - Automatic synchronization with code

---

## 🎯 Benefits:

✅ **Design ↔ Code Connection:** MCP server connects components with code  
✅ **AI Tools:** You can use prompts with AI to generate code from Figma  
✅ **Automation:** If configured, automatically detects changes  

---

## 💡 Usage Example:

When using AI (e.g. Claude) for implementation:

1. **Copy prompt from MCP server** ("Copy example prompt" button)
2. **Paste to AI** together with link to code
3. **AI understands:** Design from Figma + existing code = updated implementation

---

*MCP Server is a modern way for Code Connect!* 🚀

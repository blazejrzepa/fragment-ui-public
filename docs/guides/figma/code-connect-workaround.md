# 🔄 Code Connect Workaround - Dev Resources

Since Code Connect is only available in **Organization** and **Enterprise** plans ([source](https://help.figma.com/hc/en-us/articles/360040328273-Figma-plans-and-features)), and you have Professional plan, we'll use **Dev Resources** as an alternative.

## ✅ What Works in Professional Plan:

- ✅ **Dev Mode** - available
- ✅ **Dev Resources** - you can add links to code
- ✅ **MCP Server** - available
- ❌ **Code Connect** - only Organization/Enterprise

---

## 🚀 Solution: Dev Resources

### Step 1: Add Dev Resource Link

1. **In Figma, in Dev Mode:**
   - Right-click on Button component
   - Select **"Add a dev resource link"**

2. **Paste link to code:**
   ```
   https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx
   ```

3. **Save** - link will be visible for all Button instances

---

## 📋 What You Can Do with Dev Resources:

### ✅ Advantages:

- **Links to code** - visible in Dev Mode
- **Navigation** - clicking opens file in GitHub
- **For all instances** - link inherited by all component instances
- **Free** - works in Professional plan

### ⚠️ Limitations (vs Code Connect):

- ❌ **No automatic variant mapping** - you need to manually add links
- ❌ **No automatic synchronization** - no automatic change detection
- ❌ **No code examples** - no automatic example code display

---

## 💡 Alternative Solutions:

### Option 1: Dev Resources (Recommended)

Add links manually for each component:
- Button → link to button.tsx
- Input → link to input.tsx
- etc.

### Option 2: MCP Server

Use MCP Server section in Dev Mode:
- Add code links in prompts
- Use with AI tools for code generation

### Option 3: Upgrade to Organization

If you need full Code Connect functionality:
- Upgrade to Organization or Enterprise plan
- Then Code Connect will be available

---

## 📝 Dev Resources Checklist:

- [ ] Button: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx`
- [ ] Input: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/input.tsx`
- [ ] Select: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/select.tsx`
- [ ] ... (add for all components)

---

## 🎯 What's Next?

1. **Add Dev Resources** for all components
2. **Document** links in README or documentation
3. **Consider upgrade** if you need full Code Connect functionality

---

*Dev Resources is a good solution that works now in your plan!* ✅

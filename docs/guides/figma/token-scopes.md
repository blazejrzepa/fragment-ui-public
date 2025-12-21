# 🔐 Figma Access Token - Required Permissions

When creating Personal Access Token for Code Connect, select the following permissions (scopes):

## ✅ REQUIRED (Select these):

### 📁 Files
- ✅ **Read the contents of and render images from files**
  - Needed to read components and their variants
- ✅ **Read metadata of files**
  - Needed to read file information

### 🛠️ Development
- ✅ **Read and list dev resources in accessible files**
  - Needed to read existing Code Connect connections
- ✅ **Create and modify dev resources in accessible files** ⭐ **IMPORTANT!**
  - **This is crucial!** Without this you won't be able to publish connections

### 🎨 Design systems (Optional, but recommended)
- ✅ **Read data about individual components and styles**
  - Useful for reading information about components from design system

---

## ❌ NOT NEEDED (You can skip):

- ❌ **Comments** - We don't need to read/edit comments
- ❌ **Version history** - We don't need version history
- ❌ **Projects** - We don't need project structure
- ❌ **Webhooks** - We don't need webhooks
- ❌ **Users** - We don't need user data (unless you want)

---

## 📝 Minimum configuration:

**Minimum for Code Connect to work:**
1. Files: "Read the contents of and render images from files"
2. Files: "Read metadata of files"
3. Development: "Create and modify dev resources in accessible files"

**Recommended configuration (additionally):**
4. Development: "Read and list dev resources in accessible files"
5. Design systems: "Read data about individual components and styles"

---

## ⚠️ Security Note:

- Token gives access to your Figma files
- Use token only in secure environment
- Don't share token publicly
- If token is exposed, immediately delete it and create new one

---

## 🔄 After creating token:

1. Copy token (will be visible only once!)
2. Set in terminal:
   ```bash
   export FIGMA_TOKEN="your-token-here"
   ```
3. Run publishing:
   ```bash
   pnpm figma:publish
   ```

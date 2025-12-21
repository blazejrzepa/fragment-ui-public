# 🔗 Dev Resources - Pasting URL from GitHub

In Dev Mode, in Dev Resources section, Figma asks to paste URL to file from GitHub.

## 📋 URL to paste:

### For Button component:

```
https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx
```

### If you're on a different branch:

Replace `main` with your branch name:
```
https://github.com/blazejrzepa/fragment-ui/blob/BRANCH/packages/ui/src/button.tsx
```

---

## 🚀 Step by step:

1. **Copy URL** (above)

2. **In Figma Dev Resources:**
   - Paste URL in text field
   - Click "Connect" or "Save"

3. **Figma should:**
   - Connect component with code
   - Show link to file
   - Enable navigation between Figma and code

---

## ⚠️ Important:

### Before pasting URL, make sure:

1. **File is in repo:**
   ```bash
   git add packages/ui/src/button.tsx
   git commit -m "Add button component"
   git push
   ```

2. **You're on correct branch:**
   - If you're on `release/v1.4.0`, use that branch in URL
   - If you want to use `main`, first merge changes

3. **File exists in repo:**
   - Check on GitHub: https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/button.tsx
   - If you see 404, file is not in repo

---

## 📝 For other components:

### URL Format:
```
https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/COMPONENT.tsx
```

### Examples:
- Input: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/input.tsx`
- Select: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/select.tsx`
- Dialog: `https://github.com/blazejrzepa/fragment-ui/blob/main/packages/ui/src/dialog.tsx`

---

## ✅ After connecting:

1. **In Dev Mode you should see:**
   - Link to code next to component
   - Ability to navigate to GitHub
   - Component information

2. **In Figma:**
   - Right-click on component
   - You should see option "View code" or "Open in GitHub"

3. **In GitHub:**
   - You can add link back to Figma in code comments

---

## 🔄 What's next?

After connecting Button, you can:
1. Add more components (Input, Select, etc.)
2. Add links to Storybook
3. Create full documentation of connections

---

*This is simpler than plugin - works directly through Dev Resources!* 🎉

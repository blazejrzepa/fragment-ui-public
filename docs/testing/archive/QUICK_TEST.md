# Quick Testing Guide

Fast guide to test all three implementations.

## 🚀 Quick Tests

### 1. Test MCP Server (2 minutes)

```bash
# Run automated tests
node test-mcp-server.js

# Expected output:
# ✅ Component found: button
# ✅ Found suggestions
# ✅ Validation complete (catches violations)
# ✅ Code generated
# ✅ Tokens retrieved
```

### 2. Test ROI Metrics (1 minute)

```bash
# Run automated tests
node test-roi-metrics.mjs

# Expected output:
# ✅ All 6 metrics tested
# ✅ Status indicators working
# ✅ Targets compared correctly
```

### 3. Test ROI Dashboard (2 minutes)

```bash
# Start dev server
cd apps/www
pnpm dev

# Visit in browser:
# http://localhost:3000/tools/roi-dashboard

# Verify:
# - All 6 KPI cards display
# - Status indicators show (✅ ⚠️ ❌)
# - Progress bars render
# - No console errors
```

### 4. Test ROI API (30 seconds)

```bash
# Test API endpoint
curl http://localhost:3000/api/roi

# Or visit in browser:
# http://localhost:3000/api/roi

# Expected: JSON with metrics data
```

### 5. Test Cursor Integration (5 minutes)

1. **Configure Cursor:**
   ```json
   // ~/.cursor/mcp.json
   {
     "mcpServers": {
       "fragment-ui": {
         "command": "node",
         "args": [
           "/absolute/path/to/fragment-ui/packages/mcp-server/dist/index.js"
         ]
       }
     }
   }
   ```

2. **Restart Cursor**

3. **Test in Cursor:**
   - Ask: "What Fragment UI components are available?"
   - Ask: "Generate a Button component"
   - Ask: "Validate this code: const color = '#ff0000';"

### 6. Test Governance (5 minutes)

1. **Test RFC Template:**
   ```bash
   cp docs/governance/RFC_TEMPLATE.md docs/rfcs/RFC-001-test.md
   # Fill in template
   ```

2. **Test Deprecation Notice:**
   - Check if deprecation notices appear in IDE
   - Verify documentation shows deprecation

3. **Test Contributing Guide:**
   - Follow setup instructions
   - Create test PR

## ✅ Success Criteria

### MCP Server
- ✅ All 5 tools work
- ✅ Validation catches violations
- ✅ Component info returns data
- ✅ Code generation works

### ROI Metrics
- ✅ All 6 metrics calculate correctly
- ✅ Status indicators work
- ✅ Targets are compared

### ROI Dashboard
- ✅ Dashboard loads
- ✅ All KPIs display
- ✅ API returns data

### Governance
- ✅ RFC template is complete
- ✅ Processes are documented
- ✅ Guidelines are clear

## 🐛 Troubleshooting

**MCP Server not working:**
- Check: `pnpm build` in `packages/mcp-server`
- Check: Path in `mcp.json` is absolute
- Restart: Cursor

**Dashboard not loading:**
- Check: Dev server is running
- Check: No console errors
- Check: API endpoint accessible

**Metrics not calculating:**
- Check: Functions are imported correctly
- Check: Data types are correct

---

*Last updated: 2025-01-05*


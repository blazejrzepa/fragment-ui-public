# GitHub Integration Setup Guide

Guide for setting up GitHub webhook integration for automatic PR tracking and ROI metrics.

## Overview

The GitHub integration automatically tracks:
- **Lead Time** - Time from Figma design to PR creation
- **Component Usage** - Which Fragment UI components are used in PRs
- **Reuse Rate** - How often components are reused across repositories

## Setup

### 1. Create GitHub Webhook

1. Go to your repository: `Settings` → `Webhooks` → `Add webhook`
2. **Payload URL**: `https://your-domain.com/api/github/webhook`
3. **Content type**: `application/json`
4. **Secret**: Generate a secure random string (save it!)
5. **Events**: Select `Pull requests`
6. Click `Add webhook`

### 2. Configure Environment Variables

Add to your `.env.local` or deployment environment:

```env
# GitHub Webhook Secret (from step 1)
GITHUB_WEBHOOK_SECRET=your-webhook-secret-here

# GitHub Personal Access Token (optional, for fetching PR files)
GITHUB_TOKEN=ghp_your-token-here
```

### 3. Generate GitHub Token (Optional)

If you want to fetch PR files automatically:

1. Go to: https://github.com/settings/tokens
2. Click `Generate new token (classic)`
3. Select scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
4. Copy the token and add to `GITHUB_TOKEN`

## How It Works

### PR Opened Event

When a PR is opened:

1. **Extract Figma Links** - Scans PR description for Figma URLs
2. **Calculate Lead Time** - Time from Figma creation to PR creation
3. **Extract Component Usage** - Scans PR files for Fragment UI imports
4. **Track Metrics** - Stores metrics for ROI dashboard

### Example PR Description

```markdown
## Description

Implements new button component based on Figma design.

**Figma:** https://figma.com/file/123/button-design

## Changes

- Added Button component
- Updated styling
- Added tests
```

The webhook will:
- Extract Figma link: `https://figma.com/file/123/button-design`
- Calculate lead time from Figma to PR
- Track component usage: `Button`

### Component Usage Detection

The integration detects Fragment UI components from:

1. **Direct imports:**
   ```typescript
   import { Button, Input } from "@fragment_ui/ui";
   ```

2. **Local component imports:**
   ```typescript
   import { Button } from "@/components/ui/button";
   ```

## Testing

### Test Webhook Locally

1. **Install ngrok** (or similar tunnel):
   ```bash
   npm install -g ngrok
   ngrok http 3000
   ```

2. **Update webhook URL** to ngrok URL:
   ```
   https://your-ngrok-url.ngrok.io/api/github/webhook
   ```

3. **Create a test PR** with Figma link in description

4. **Check logs** for webhook events:
   ```bash
   # In your terminal running the dev server
   [GitHub Webhook] Lead time tracked: { value: 0.8, unit: 'days' }
   [GitHub Webhook] Component usage tracked: { components: ['Button'] }
   ```

### Manual Testing

You can test the integration manually:

```typescript
import { processPRWebhook } from "@fragment_ui/telemetry/github-integration";

const testPR = {
  number: 123,
  title: "Add Button component",
  body: "Figma: https://figma.com/file/123/button",
  html_url: "https://github.com/owner/repo/pull/123",
  created_at: "2025-01-05T10:00:00Z",
  updated_at: "2025-01-05T10:00:00Z",
  user: { login: "developer" },
  head: { ref: "feature/button", sha: "abc123" },
  base: { ref: "main" },
  files: [
    {
      filename: "src/components/Button.tsx",
      additions: 50,
      deletions: 0,
      patch: "+import { Button } from '@fragment_ui/ui';",
    },
  ],
};

const result = await processPRWebhook(testPR);
console.log(result);
// {
//   leadTime: { value: 0.8, unit: 'days', ... },
//   componentUsage: ['Button']
// }
```

## API Endpoints

### POST `/api/github/webhook`

GitHub webhook endpoint. Handles PR events automatically.

**Headers:**
- `X-Hub-Signature-256`: Webhook signature (GitHub provides this)

**Body:** GitHub webhook payload (JSON)

**Response:**
```json
{
  "success": true,
  "leadTime": {
    "value": 0.8,
    "unit": "days",
    "figmaUrl": "https://figma.com/file/123",
    "prUrl": "https://github.com/owner/repo/pull/123"
  },
  "componentUsage": ["Button", "Input"]
}
```

## Metrics Tracking

### Lead Time

Automatically calculated when:
- PR description contains Figma link
- PR is opened or updated

**Formula:**
```
Lead Time = PR Created At - Figma Created At
```

**Note:** If Figma creation time is not available, estimates 1 day before PR creation.

### Component Usage

Automatically detected from:
- PR file diffs
- Import statements
- Component names

### Reuse Rate

Calculated based on:
- Component name
- Number of repositories using component
- Total repositories

## Troubleshooting

### Webhook Not Receiving Events

1. **Check webhook status** in GitHub: `Settings` → `Webhooks`
2. **Verify URL** is accessible (not localhost)
3. **Check secret** matches in environment variables
4. **Review webhook logs** in GitHub for delivery errors

### Lead Time Not Calculated

1. **Check PR description** contains Figma link
2. **Verify link format**: `https://figma.com/file/...`
3. **Check logs** for extraction errors

### Component Usage Not Detected

1. **Verify imports** use correct format:
   - `@fragment_ui/ui` or
   - `@/components/ui/component-name`
2. **Check PR files** are included in webhook payload
3. **Enable GITHUB_TOKEN** to fetch files automatically

## Security

### Webhook Signature Verification

The integration verifies webhook signatures to ensure requests come from GitHub:

```typescript
const isValid = verifyWebhookSignature(
  payload,
  signature,
  webhookSecret
);
```

**Important:** Always set `GITHUB_WEBHOOK_SECRET` in production!

### Development Mode

In development (`NODE_ENV=development`), signature verification is optional for easier testing.

## Next Steps

1. **Database Integration** - Store metrics in database
2. **Figma API Integration** - Get actual creation times
3. **Repository Tracking** - Track component usage across repos
4. **Dashboard Updates** - Real-time metric updates

---

*Last updated: 2025-01-05*


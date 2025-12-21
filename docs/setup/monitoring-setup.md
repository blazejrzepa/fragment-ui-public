# 📊 Monitoring & Analytics Setup Guide

## 🎯 Overview

Fragment UI includes multiple monitoring and analytics options. Choose what fits your needs.

## ✅ Option 1: Vercel Analytics (Recommended - Easiest)

Vercel Analytics is built-in, free, and requires minimal setup.

### Setup

1. **Install package:**
   ```bash
   cd apps/www
   pnpm add @vercel/analytics
   ```

2. **Add to layout:**
   ```typescript
   // apps/www/app/layout.tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

3. **Enable in Vercel:**
   - Vercel Dashboard → Project → Settings → Analytics
   - Enable "Web Analytics"
   - Done! ✅

### Features:
- ✅ Page views
- ✅ Web Vitals (CLS, FID, LCP, FCP, TTFB)
- ✅ Real-time analytics
- ✅ Free tier available
- ✅ No code changes needed (after initial setup)

## 🔍 Option 2: Enhanced Telemetry Backend

Extend the existing telemetry system to send data to analytics services.

### A. PostHog (Open Source, Privacy-Friendly)

**Setup:**

1. **Create PostHog account:**
   - Go to: https://posthog.com
   - Sign up (free tier available)

2. **Get API key:**
   - Project Settings → Project API Key

3. **Install PostHog:**
   ```bash
   pnpm add posthog-js
   ```

4. **Update telemetry API:**
   ```typescript
   // apps/www/app/api/telemetry/route.ts
   import { PostHog } from 'posthog-node';
   
   const posthog = process.env.POSTHOG_API_KEY 
     ? new PostHog(process.env.POSTHOG_API_KEY, {
         host: 'https://app.posthog.com'
       })
     : null;
   
   export async function POST(request: NextRequest) {
     const { events } = await request.json();
     
     if (posthog && events) {
       events.forEach((event: any) => {
         posthog.capture({
           distinctId: event.userId || event.sessionId || 'anonymous',
           event: event.name,
           properties: event.properties,
         });
       });
     }
     
     return NextResponse.json({ success: true });
   }
   ```

5. **Add env var in Vercel:**
   - `POSTHOG_API_KEY` = your PostHog API key

### B. Plausible (Privacy-Friendly, Simple)

**Setup:**

1. **Create Plausible account:**
   - Go to: https://plausible.io
   - Add your domain

2. **Add script to layout:**
   ```typescript
   // apps/www/app/layout.tsx
   import Script from 'next/script';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <head>
           <Script
             defer
             data-domain="yourdomain.com"
             src="https://plausible.io/js/script.js"
           />
         </head>
         <body>
           {children}
         </body>
       </html>
     );
   }
   ```

### C. Custom Backend (Database, Data Warehouse)

Update telemetry API to store events:

```typescript
// Example: Store in database
import { db } from '@/lib/db'; // Your database client

export async function POST(request: NextRequest) {
  const { events } = await request.json();
  
  // Store in database
  await db.telemetryEvents.createMany({
    data: events.map((e: any) => ({
      type: e.type,
      name: e.name,
      properties: e.properties,
      timestamp: new Date(e.timestamp),
      userId: e.userId,
      sessionId: e.sessionId,
    })),
  });
  
  return NextResponse.json({ success: true });
}
```

## 🚨 Option 3: Error Tracking - Sentry

Track errors and exceptions in production.

### Setup:

1. **Create Sentry account:**
   - Go to: https://sentry.io
   - Create project (Next.js)

2. **Install Sentry:**
   ```bash
   pnpm add @sentry/nextjs
   ```

3. **Initialize Sentry:**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```
   This creates `sentry.client.config.ts` and `sentry.server.config.ts`

4. **Add env vars in Vercel:**
   - `SENTRY_DSN` = your Sentry DSN
   - `SENTRY_AUTH_TOKEN` = for source maps (optional)

5. **Integrate with telemetry:**
   ```typescript
   // apps/www/src/lib/telemetry.ts
   import * as Sentry from '@sentry/nextjs';
   
   // Track errors automatically
   client.track('error', 'Error occurred', {
     error: error.message,
     stack: error.stack,
   });
   
   // Also send to Sentry
   Sentry.captureException(error);
   ```

## 📈 Option 4: Performance Monitoring

### A. Vercel Speed Insights

Built-in performance monitoring from Vercel.

**Setup:**

1. **Install:**
   ```bash
   pnpm add @vercel/speed-insights
   ```

2. **Add to layout:**
   ```typescript
   import { SpeedInsights } from '@vercel/speed-insights/next';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <SpeedInsights />
         </body>
       </html>
     );
   }
   ```

### B. Web Vitals (Already Tracked)

The telemetry system already tracks Web Vitals. You can extend it:

```typescript
// Track Web Vitals
if (typeof window !== 'undefined') {
  import('web-vitals').then(({ onCLS, onFID, onLCP, onFCP, onTTFB }) => {
    onCLS(metric => client.track('custom', 'web_vital', { name: 'CLS', value: metric.value }));
    onFID(metric => client.track('custom', 'web_vital', { name: 'FID', value: metric.value }));
    onLCP(metric => client.track('custom', 'web_vital', { name: 'LCP', value: metric.value }));
    onFCP(metric => client.track('custom', 'web_vital', { name: 'FCP', value: metric.value }));
    onTTFB(metric => client.track('custom', 'web_vital', { name: 'TTFB', value: metric.value }));
  });
}
```

## 🎯 Recommended Setup

### Minimal (Free):
- ✅ **Vercel Analytics** - Built-in, free
- ✅ **Vercel Speed Insights** - Performance monitoring
- ✅ **Existing Telemetry** - Custom tracking

### Complete (Production):
- ✅ **Vercel Analytics** - Web analytics
- ✅ **Vercel Speed Insights** - Performance
- ✅ **Sentry** - Error tracking
- ✅ **PostHog/Plausible** - Advanced analytics
- ✅ **Custom Telemetry** - Component usage, installations

## 🔧 Configuration

### Environment Variables

Add to Vercel Dashboard → Settings → Environment Variables:

```env
# Telemetry
NEXT_PUBLIC_TELEMETRY_ENABLED=true
NEXT_PUBLIC_TELEMETRY_ENDPOINT=/api/telemetry

# PostHog (optional)
POSTHOG_API_KEY=your-key-here

# Sentry (optional)
SENTRY_DSN=your-dsn-here
SENTRY_AUTH_TOKEN=your-token-here
NEXT_PUBLIC_SENTRY_DSN=your-dsn-here
```

## 📊 What Gets Tracked

### Current Telemetry Events:
- `page_view` - Page views
- `component_view` - Component documentation views
- `component_install` - Component installations via registry
- `version_switch` - Documentation version switches
- `search_query` - Search queries
- `link_click` - Link clicks
- `error` - Errors

### Extended Tracking:
- Web Vitals (CLS, FID, LCP, FCP, TTFB)
- Error stack traces
- User sessions
- Component usage patterns
- Performance metrics

## 🔐 Privacy

- All tracking respects user privacy
- No personal data collected
- Anonymous sessions
- GDPR compliant options (Plausible, PostHog)
- User can opt-out via env var: `NEXT_PUBLIC_TELEMETRY_ENABLED=false`

## 🚀 Next Steps

1. **Start with Vercel Analytics** (easiest)
2. **Add Sentry** for error tracking
3. **Extend telemetry** with PostHog or custom backend
4. **Monitor metrics** in respective dashboards

## 📚 Resources

- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [PostHog Docs](https://posthog.com/docs)
- [Plausible Docs](https://plausible.io/docs)


# Assets Directory

This directory contains static assets for the Fragment UI Design System website.

## Structure

```
public/
├── assets/
│   ├── logo/              # Logo files
│   │   ├── logo-light.svg
│   │   ├── logo-dark.svg
│   │   ├── logo-icon.svg
│   │   └── favicon.ico
│   ├── images/            # General images
│   │   ├── hero/
│   │   ├── screenshots/
│   │   └── illustrations/
│   ├── icons/             # Custom icons (if not using icon library)
│   └── graphics/          # Other graphics
│       ├── patterns/
│       └── backgrounds/
└── r/                     # Registry files (component definitions)
```

## Usage

### Logo

```tsx
import Image from "next/image";

// In your component
<Image
  src="/assets/logo/logo-light.svg"
  alt="Fragment UI"
  width={120}
  height={40}
/>
```

### Images

```tsx
import Image from "next/image";

<Image
  src="/assets/images/hero/hero-image.png"
  alt="Hero image"
  width={800}
  height={600}
  priority
/>
```

### Using OptimizedImage Component

```tsx
import { OptimizedImage } from "@/components/optimized-image";

<OptimizedImage
  src="/assets/images/screenshots/dashboard.png"
  alt="Dashboard screenshot"
  width={1200}
  height={800}
/>
```

## File Formats

- **SVG**: For logos, icons, and simple graphics
- **PNG**: For screenshots and images with transparency
- **WebP/AVIF**: For optimized photos (Next.js will auto-convert)
- **ICO**: For favicons

## Naming Convention

- Use kebab-case: `logo-light.svg`, `hero-image.png`
- Be descriptive: `dashboard-screenshot.png` not `img1.png`
- Include variant in name: `logo-light.svg`, `logo-dark.svg`

## Optimization

Next.js automatically optimizes images placed in the `public/` directory:
- Automatic format conversion (WebP, AVIF)
- Responsive image generation
- Lazy loading (unless `priority` is set)

## White-Label Support

For white-label branding, use the `BrandLogo` component from `@fragment_ui/ui`:

```tsx
import { BrandLogo } from "@fragment_ui/ui";

<BrandLogo variant="auto" className="h-8" />
```

This will automatically use the configured brand logo from the white-label system.


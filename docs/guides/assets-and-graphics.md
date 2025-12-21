# 📸 Assets and Graphics Guide

This guide explains where to add logos, images, and other graphic assets in the Fragment UI Design System.

## 📁 Directory Structure

All static assets should be placed in the `apps/www/public/assets/` directory:

```
apps/www/public/
├── assets/
│   ├── logo/              # Logo files
│   │   ├── logo-light.svg      # Light theme logo
│   │   ├── logo-dark.svg       # Dark theme logo
│   │   ├── logo-icon.svg       # Icon-only logo
│   │   └── favicon.ico         # Browser favicon
│   ├── images/            # General images
│   │   ├── hero/               # Hero section images
│   │   ├── screenshots/        # Component screenshots
│   │   └── illustrations/      # Illustrations
│   ├── icons/             # Custom icons (if not using icon library)
│   └── graphics/          # Other graphics
│       ├── patterns/           # Background patterns
│       └── backgrounds/        # Background images
└── r/                     # Registry files (component definitions)
```

## 🎨 Adding a Logo

### Step 1: Add Logo Files

Place your logo files in `apps/www/public/assets/logo/`:

- `logo-light.svg` - Logo for light theme
- `logo-dark.svg` - Logo for dark theme
- `logo-icon.svg` - Icon-only version (optional)
- `favicon.ico` - Browser favicon

### Step 2: Use the Logo Component

The `Logo` component is already integrated in the navigation. It automatically:
- Uses white-label logo if configured
- Falls back to default logo files
- Handles light/dark theme switching

```tsx
import { Logo } from "@/components/logo";

// In your component
<Logo variant="auto" showText={true} />
```

**Props:**
- `variant`: `"light" | "dark" | "auto"` - Logo variant (default: `"auto"`)
- `showText`: `boolean` - Show text next to logo (default: `true`)
- `className`: `string` - Additional CSS classes
- `href`: `string` - Link destination (default: `"/"`)

### Step 3: Update Favicon

1. Add `favicon.ico` to `apps/www/public/assets/logo/`
2. Update `apps/www/app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Fragment UI",
  description: "AI-native design system",
  icons: {
    icon: "/assets/logo/favicon.ico",
  },
};
```

## 🖼️ Adding Images

### Using Next.js Image Component

```tsx
import Image from "next/image";

<Image
  src="/assets/images/hero/hero-image.png"
  alt="Hero image"
  width={800}
  height={600}
  priority // For above-the-fold images
/>
```

### Using OptimizedImage Component

For better optimization and lazy loading:

```tsx
import { OptimizedImage } from "@/components/optimized-image";

<OptimizedImage
  src="/assets/images/screenshots/dashboard.png"
  alt="Dashboard screenshot"
  width={1200}
  height={800}
  priority={false} // Lazy load by default
/>
```

## 📐 File Format Recommendations

### SVG
- **Use for**: Logos, icons, simple graphics
- **Advantages**: Scalable, small file size, crisp at any size
- **Example**: `logo-light.svg`, `icon-check.svg`

### PNG
- **Use for**: Screenshots, images with transparency
- **Advantages**: Lossless compression, transparency support
- **Example**: `screenshot-dashboard.png`

### WebP/AVIF
- **Use for**: Photos, complex images
- **Advantages**: Better compression than PNG/JPEG
- **Note**: Next.js automatically converts to WebP/AVIF

### ICO
- **Use for**: Favicons
- **Example**: `favicon.ico`

## 🎯 Naming Conventions

- Use **kebab-case**: `logo-light.svg`, `hero-image.png`
- Be **descriptive**: `dashboard-screenshot.png` not `img1.png`
- Include **variant** in name: `logo-light.svg`, `logo-dark.svg`
- Include **size** if multiple: `icon-16.svg`, `icon-24.svg`

## ⚡ Optimization

Next.js automatically optimizes images in the `public/` directory:

- **Automatic format conversion**: WebP, AVIF
- **Responsive image generation**: Multiple sizes
- **Lazy loading**: Images load when needed (unless `priority` is set)
- **Blur placeholder**: For better UX during loading

## 🎨 White-Label Support

For white-label branding, use the `BrandLogo` component from `@fragment_ui/ui`:

```tsx
import { BrandLogo } from "@fragment_ui/ui";

<BrandLogo variant="auto" className="h-8" />
```

This automatically uses the configured brand logo from the white-label system.

## 📝 Examples

### Logo in Navigation

Already implemented in `TopNavigation` component:

```tsx
<Logo variant="auto" showText={true} />
```

### Hero Image

```tsx
import Image from "next/image";

<Image
  src="/assets/images/hero/hero-image.png"
  alt="Fragment UI Design System"
  width={1200}
  height={600}
  priority
  className="rounded-lg"
/>
```

### Component Screenshot

```tsx
import { OptimizedImage } from "@/components/optimized-image";

<OptimizedImage
  src="/assets/images/screenshots/button-variants.png"
  alt="Button component variants"
  width={800}
  height={400}
/>
```

### Background Pattern

```tsx
<div
  className="bg-cover bg-center"
  style={{
    backgroundImage: "url('/assets/graphics/patterns/grid.svg')",
  }}
>
  {/* Content */}
</div>
```

## 🔗 Related Components

- `Logo` - Logo component with theme support
- `OptimizedImage` - Optimized image component
- `BrandLogo` - White-label logo component
- `Image` - Next.js Image component

## 📚 Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [SVG Optimization Guide](https://jakearchibald.github.io/svgomg/)
- [WebP vs AVIF Comparison](https://web.dev/avif/)

---

*Last updated: 2025-11-07*


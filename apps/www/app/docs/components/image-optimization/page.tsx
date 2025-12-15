"use client";

import { OptimizedImage } from "../../../../src/components/optimized-image";
import { Card, CardContent, DocumentContent } from "@fragment_ui/ui";

export default function ImageOptimizationPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 className="text-3xl font-medium" id="page">Image Optimization</h1>
      </div>
      <p className="mb-6 intro-text">
        Fragment UI uses Next.js Image component for automatic image optimization.
        Images are automatically converted to modern formats (WebP, AVIF), resized,
        and lazy-loaded for better performance.
      </p>
      
      <h2 id="features">Features</h2>
      <ul>
        <li>✅ Automatic format conversion (WebP, AVIF)</li>
        <li>✅ Responsive images with srcset</li>
        <li>✅ Lazy loading by default</li>
        <li>✅ Placeholder support (blur, skeleton)</li>
        <li>✅ Error handling with fallbacks</li>
        <li>✅ External image support (configured domains)</li>
      </ul>

      <h2 id="usage">Usage</h2>
      <p>Use the <code>OptimizedImage</code> component for optimized images:</p>
      
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto">
        <code>{`import { OptimizedImage } from "@/components/optimized-image";

// Basic usage
<OptimizedImage src="/image.jpg" alt="Description" width={800} height={600} />

// With lazy loading (default)
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false}
/>

// Priority loading (above the fold)
<OptimizedImage
  src="/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority
/>

// Fill container
<OptimizedImage src="/image.jpg" alt="Description" fill className="object-cover" />

// With blur placeholder
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>`}</code>
      </pre>

      <div className="space-y-6 my-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Standard Image</h3>
            <OptimizedImage
              src="https://github.com/shadcn.png"
              alt="Example image"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Responsive Image</h3>
            <OptimizedImage
              src="https://github.com/shadcn.png"
              alt="Responsive example"
              width={400}
              height={300}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fill Container</h3>
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <OptimizedImage
                src="https://github.com/shadcn.png"
                alt="Fill example"
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 id="configuration">Configuration</h2>
      <p>
        Image optimization is configured in <code>next.config.mjs</code>:
      </p>
      <pre className="bg-[color:var(--color-surface-1)] p-4 rounded-lg overflow-x-auto"><code>{`images: {
  formats: ["image/avif", "image/webp"],
  remotePatterns: [
    {
      protocol: "https",
      hostname: "github.com",
    },
  ],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}`}</code></pre>

      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li>
          <strong>Use priority for above-the-fold images:</strong> Set <code>priority={true}</code> for images visible without scrolling.
        </li>
        <li>
          <strong>Provide width and height:</strong> Prevents layout shift and improves performance.
        </li>
        <li>
          <strong>Use appropriate sizes:</strong> Specify <code>sizes</code> prop for responsive images.
        </li>
        <li>
          <strong>Optimize source images:</strong> Use appropriate formats (JPG for photos, PNG for graphics).
        </li>
        <li>
          <strong>Add blur placeholder:</strong> Use blur placeholder for better perceived performance.
        </li>
      </ul>

      <h2 id="benefits">Benefits</h2>
      <ul>
        <li>🚀 Faster page loads - smaller file sizes</li>
        <li>📱 Better mobile experience - responsive images</li>
        <li>⚡ Improved Core Web Vitals</li>
        <li>💾 Reduced bandwidth usage</li>
        <li>🎨 Modern formats (AVIF, WebP) with fallbacks</li>
      </ul>


    </DocumentContent>
  );
}


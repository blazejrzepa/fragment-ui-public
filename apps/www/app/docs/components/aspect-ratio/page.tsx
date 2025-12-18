"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { AspectRatio, AspectRatioPresets, DocumentContent, Badge } from "@fragment_ui/ui";
import { CodeBlock } from "@fragment_ui/ui";

export default function AspectRatioPage() {
  return (
    <DocumentContent as="article">
      <div className="flex items-center gap-4 mb-1">
        <h1 id="aspect-ratio">Aspect Ratio</h1>
      </div>
      <p className="mb-6 intro-text">
        AspectRatio component maintains a consistent aspect ratio for media content like images, videos, or custom content.
        Built on Radix UI AspectRatio, fully responsive and accessible.
      </p>
      <h2>Overview</h2>
      
      <h2>Install</h2>
      <CodeBlock language="bash" highlightApiUrl="/api/highlight-code">npx shadcn@latest add /r/aspect-ratio.json</CodeBlock>
      
      <h2>Examples</h2>
      <div className="space-y-6 my-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Video (16:9)</h3>
          <div className="max-w-md">
            <AspectRatio ratio={AspectRatioPresets.video}>
              <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-surface-2)] rounded-lg">
                <span className="text-2xl">16:9 Video</span>
              </div>
            </AspectRatio>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Square (1:1)</h3>
          <div className="max-w-xs">
            <AspectRatio ratio={AspectRatioPresets.square}>
              <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-surface-2)] rounded-lg">
                <span className="text-2xl">1:1</span>
              </div>
            </AspectRatio>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Photo (4:3)</h3>
          <div className="max-w-md">
            <AspectRatio ratio={AspectRatioPresets.photo}>
              <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-surface-2)] rounded-lg">
                <span className="text-2xl">4:3 Photo</span>
              </div>
            </AspectRatio>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Custom Ratio</h3>
          <div className="max-w-md">
            <AspectRatio ratio={2.5}>
              <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-surface-2)] rounded-lg">
                <span className="text-2xl">2.5:1 Custom</span>
              </div>
            </AspectRatio>
          </div>
        </div>
      </div>
      
      <h2>Code Examples</h2>
      <CodeBlock language="typescript" highlightApiUrl="/api/highlight-code">{`import { AspectRatio, AspectRatioPresets } from "@fragment_ui/ui";

// Video aspect ratio (16:9)
<AspectRatio ratio={AspectRatioPresets.video}>
</AspectRatio>

// Square aspect ratio (1:1)
<AspectRatio ratio={AspectRatioPresets.square}>
</AspectRatio>

// Custom ratio
<AspectRatio ratio={2.5}>
  <div>Content</div>
</AspectRatio>`}</CodeBlock>

      <h2>Available Presets</h2>
      <ul>
        <li><code>AspectRatioPresets.square</code> - 1:1</li>
        <li><code>AspectRatioPresets.video</code> - 16:9</li>
        <li><code>AspectRatioPresets.photo</code> - 4:3</li>
        <li><code>AspectRatioPresets.portrait</code> - 3:4</li>
        <li><code>AspectRatioPresets.wide</code> - 21:9</li>
        <li><code>AspectRatioPresets.ultrawide</code> - 32:9</li>
        <li><code>AspectRatioPresets.story</code> - 9:16</li>
      </ul>

      <h2>Props</h2>
      <ul>
        <li><code>ratio</code> - Aspect ratio (default: 16/9). Can use preset or custom number.</li>
        <li><code>className</code> - Additional CSS classes</li>
        <li><code>children</code> - Content to maintain aspect ratio</li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>Maintains consistent aspect ratio</li>
        <li>Responsive and fluid</li>
        <li>Common preset ratios included</li>
        <li>Custom ratios supported</li>
        <li>Works with any content (images, videos, divs)</li>
      </ul>

      <h2>Accessibility</h2>
      <p>
        AspectRatio maintains proper semantic structure. Ensure content inside has appropriate accessibility attributes
        (alt text for images, captions for videos, etc.).
      </p>
      


    </DocumentContent>
  );
}


import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createRequire } from "module";
import createMDX from "@next/mdx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Prevent dev/build from clobbering each other's output (missing chunk errors).
  // Next sets NODE_ENV=development for `next dev` and NODE_ENV=production for `next build`.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  
  // Ensure markdown files are included in the build
  // This is critical for production builds on Vercel
  outputFileTracingIncludes: {
    '/**': ['./app/**/*.md'],
  },
  
  // Transpile workspace packages (needed for pnpm workspaces)
  // This enables hot reload for workspace packages
  transpilePackages: [
    "@fragment_ui/ui",
    "@fragment_ui/blocks",
  ],
  
  // Enable experimental features for better hot reload
  experimental: {
    // Optimize package imports for better hot reload
    optimizePackageImports: ["@fragment_ui/ui", "@fragment_ui/blocks"],
  },
  
  // External packages for server components (prevents bundling)
  
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    // Allow external images from trusted domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "vercel.com",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
    ],
    // Enable image optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum quality for optimized images
    minimumCacheTTL: 60,
  },

  webpack: (config, { isServer, dev }) => {
    // Resolve workspace packages for CSS imports
    const rootPath = path.resolve(__dirname, "../..");
    
    // Add rule for importing markdown files as raw strings
    // This allows: import content from './file.md?raw'
    config.module.rules.push({
      test: /\.md$/,
      resourceQuery: /raw/, // Only apply to imports with ?raw query
      type: 'asset/source', // This makes the file content available as a string
    });
    
    // Add rule for JSON files to be parsed correctly
    // This ensures registry.json and other JSON files are loaded as modules
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
      parser: {
        parse: JSON.parse,
      },
    });
    
    // Build alias object - always add all aliases, webpack will handle server/client separation
    const aliases = {
      ...config.resolve.alias,
      // IMPORTANT: use "$" so this alias matches ONLY the bare specifier.
      // Otherwise it also matches subpaths like "@fragment_ui/tokens/json" and breaks resolution.
      "@fragment_ui/tokens$": path.resolve(__dirname, "../../packages/tokens"),
      // Support package export subpath used by docs/components.
      // The @fragment_ui/tokens alias above bypasses package.json "exports",
      // so we need to explicitly map the "/json" entry.
      "@fragment_ui/tokens/json": path.resolve(__dirname, "../../packages/tokens/dist/tokens.ts"),
    };
    
    config.resolve.alias = aliases;
    
    // Exclude better-sqlite3 from client bundle (it's Node.js only)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
      
      // Ignore better-sqlite3 in client bundle
      config.externals = config.externals || [];
      config.externals.push({
        "better-sqlite3": "commonjs better-sqlite3",
      });
    }
    
    // Ensure webpack can resolve package.json exports
    config.resolve.extensionAlias = {
      ".js": [".js", ".ts", ".tsx"],
    };
    
    // Help webpack find workspace packages
    // Include root node_modules first, then package-specific node_modules
    config.resolve.modules = [
      "node_modules",
      path.resolve(rootPath, "node_modules"),
      path.resolve(__dirname, "../../packages"),
      path.resolve(__dirname, "node_modules"),
      ...(config.resolve.modules || []),
    ];
    
    // For pnpm workspaces, we need to resolve symlinks
    config.resolve.symlinks = true;
    
    // Enable package.json exports field resolution
    config.resolve.conditionNames = ["import", "require", "default"];
    
    // Ensure webpack resolves aliases before package.json exports
    // This is critical for sub-path exports with slashes
    config.resolve.aliasFields = ["browser", "module", "main"];
    config.resolve.mainFields = ["browser", "module", "main"];
    
    // Force webpack to use aliases by setting resolveLoader to use the same aliases
    // This ensures aliases are checked before package.json resolution
    if (!config.resolveLoader) {
      config.resolveLoader = {};
    }
    config.resolveLoader.alias = {
      ...(config.resolveLoader.alias || {}),
      ...aliases,
    };

    // Performance optimizations - only in production
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },
};

// Wrap MDX and Next.js config with each other
export default withMDX(nextConfig);


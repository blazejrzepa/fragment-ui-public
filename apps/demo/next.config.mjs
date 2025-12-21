import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile workspace packages and react-live
  transpilePackages: ['@fragment_ui/ui-dsl', '@fragment_ui/ui', '@fragment_ui/blocks', 'react-live', '@stackblitz/sdk'],
  // Headers - COEP removed as it blocks blob URLs needed for dynamic imports
  // StackBlitz is not used, so SharedArrayBuffer headers are not needed
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
  // Configure webpack
  webpack: (config, { isServer }) => {
    // Configure path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    
    // Exclude JSON files from being processed as modules
    // This prevents webpack from trying to parse JSON with invalid syntax
    // JSON files should be loaded as assets or via dynamic import
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
      parser: {
        parse: JSON.parse,
      },
    });
    
    // Exclude esbuild from webpack processing (it's used in API routes only)
    if (isServer) {
      config.externals = config.externals || [];
      if (typeof config.externals === 'function') {
        const originalExternals = config.externals;
        config.externals = [
          ...(Array.isArray(originalExternals) ? originalExternals : []),
          'esbuild',
        ];
      } else if (Array.isArray(config.externals)) {
        config.externals.push('esbuild');
      }
    }
    
    return config;
  },
};

export default nextConfig;

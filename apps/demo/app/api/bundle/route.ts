import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import * as fs from "fs";
import { createJsxRuntimeReplacementPlugin } from "./jsx-runtime-replacement";
import type { PluginBuild } from "esbuild";
import { logger } from "@/lib/server-logger";

/**
 * API endpoint to bundle @fragment_ui/ui for Sandpack
 * 
 * This allows Sandpack to use the local @fragment_ui/ui package
 * without requiring it to be published on npm.
 * 
 * Uses require() to avoid webpack processing esbuild
 */
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // Get the correct path to UI package
    // In Next.js API routes, process.cwd() can vary:
    // - Local dev: usually apps/demo
    // - Vercel: could be root, apps/demo, or .next directory
    const cwd = process.cwd();
    
    // Helper function to find package.json and determine project root
    function findProjectRoot(startPath: string, maxDepth: number = 5): string | null {
      let current = startPath;
      for (let i = 0; i < maxDepth; i++) {
        const packageJsonPath = path.join(current, "package.json");
        if (fs.existsSync(packageJsonPath)) {
          try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
            // Check if this is the monorepo root (has workspaces or turbo)
            if (packageJson.workspaces || packageJson.turbo) {
              return current;
            }
          } catch (e) {
            // Continue searching
          }
        }
        const parent = path.dirname(current);
        if (parent === current) break; // Reached filesystem root
        current = parent;
      }
      return null;
    }
    
    // Find project root
    const projectRoot = findProjectRoot(cwd) || cwd;
    
    /**
     * Resolve package entry point using require.resolve() as primary method
     * Falls back to manual path resolution only if require.resolve fails
     */
    function resolvePackageEntry(packageName: string): string | null {
      // PRIMARY: Use require.resolve() - works for installed packages
      try {
        const resolvedPath = require.resolve(packageName);
      if (fs.existsSync(resolvedPath)) {
          logger.debug(`✅ Resolved ${packageName} via require.resolve: ${resolvedPath}`);
          return resolvedPath;
        }
      } catch (e) {
        logger.debug(`⚠️ require.resolve(${packageName}) failed, trying fallback paths...`);
    }
    
      // FALLBACK: Manual path resolution (for development/monorepo scenarios)
      const fallbackPaths = [
        // Production builds (dist)
        path.resolve(projectRoot, `packages/${packageName.replace("@fragment_ui/", "")}/dist/index.js`),
        path.resolve(cwd, `../../packages/${packageName.replace("@fragment_ui/", "")}/dist/index.js`),
        // Development (source)
        path.resolve(projectRoot, `packages/${packageName.replace("@fragment_ui/", "")}/src/index.ts`),
        path.resolve(cwd, `../../packages/${packageName.replace("@fragment_ui/", "")}/src/index.ts`),
      ];
      
      for (const fallbackPath of fallbackPaths) {
        if (fs.existsSync(fallbackPath)) {
          logger.debug(`✅ Resolved ${packageName} via fallback: ${fallbackPath}`);
          return fallbackPath;
        }
      }
      
      // Try package.json entry point resolution
      const packageJsonPaths = [
        path.resolve(projectRoot, `packages/${packageName.replace("@fragment_ui/", "")}/package.json`),
        path.resolve(cwd, `../../packages/${packageName.replace("@fragment_ui/", "")}/package.json`),
      ];
    
      for (const pkgJsonPath of packageJsonPaths) {
        if (fs.existsSync(pkgJsonPath)) {
            try {
            const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
            let entryPoint: string | undefined;
            
              // Try exports field first (modern), then main/module (legacy)
              if (pkgJson.exports?.["."]) {
                const exports = pkgJson.exports["."];
                entryPoint = exports.import || exports.require || exports.default;
              }
              if (!entryPoint) {
                entryPoint = pkgJson.main || pkgJson.module;
              }
              
              if (entryPoint) {
              const entryPath = path.resolve(path.dirname(pkgJsonPath), entryPoint);
                if (fs.existsSync(entryPath)) {
                logger.debug(`✅ Resolved ${packageName} via package.json entry (${entryPoint}): ${entryPath}`);
                return entryPath;
                }
              }
            } catch (e) {
              // Continue searching
            }
        }
      }
      
      return null;
    }
    
    const uiIndexPath = resolvePackageEntry("@fragment_ui/ui");

    if (!uiIndexPath) {
      logger.error(`❌ UI package (@fragment_ui/ui) not found`);
      logger.error(`Current working directory: ${cwd}`);
      logger.error(`Project root: ${projectRoot}`);
      
      return NextResponse.json(
        { 
          error: `UI package (@fragment_ui/ui) not found`,
          cwd: cwd,
          projectRoot: projectRoot,
          hint: "Make sure @fragment_ui/ui is built (pnpm build) or installed"
        },
        { status: 500 }
      );
    }

    // Use require() to avoid webpack processing esbuild
    const esbuild = require("esbuild") as typeof import("esbuild");
    
    // Determine if we're using a built file or source file
    const isBuiltFile = uiIndexPath.endsWith('.js');
    const isTypeScript = uiIndexPath.endsWith('.ts') || uiIndexPath.endsWith('.tsx');
    
    // Bundle the UI package with optimizations
    // Use jsx: "automatic" to use react/jsx-runtime (which handles object components)
    // IMPORTANT: Always use jsx: "automatic" for AI components to work correctly
    // This ensures that components like Button work with jsx() calls from worker.js
    const buildOptions: any = {
      entryPoints: [uiIndexPath!],
      bundle: true,
      format: "esm",
      platform: "browser",
      target: "es2020",
      // Always use jsx: "automatic" to enable react/jsx-runtime
      // This is critical for AI components that use Button and other components from @fragment_ui/ui
      jsx: "automatic",
      jsxImportSource: "react",
      // Use packages: "external" to automatically mark all node_modules as external
      // This prevents esbuild from bundling dependencies that contain react/jsx-runtime
      packages: "external",
      // Mark all CSS files as external - CSS is loaded via <link> tags, not ESM imports
      // This is the proper way to handle CSS in ESM bundles
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      write: false,
      // Enable tree-shaking (default, but explicit)
      treeShaking: true,
      // Temporarily disable minification to debug react/jsx-runtime issues
      // TODO: Re-enable after fixing react/jsx-runtime
      minify: false,
      minifyWhitespace: false,
      minifyIdentifiers: false,
      minifySyntax: false,
      // Source maps disabled for smaller size
      sourcemap: false,
      // Remove development code
      define: {
        "process.env.NODE_ENV": '"production"',
        "__DEV__": "false",
      },
      // Drop console statements in production
      drop: ["console"],
      // CSS files are handled by plugin below - marked as external
      // CSS is loaded via <link> tags in iframe.html, not as ESM imports
      plugins: [
        {
          name: "remove-css-imports",
          setup(build: PluginBuild) {
            // Remove all CSS imports completely - they're loaded via <link> tags
            // This is better than external because external still tries to resolve the path
            build.onResolve({ filter: /\.css$/ }, () => {
              return { path: "", namespace: "css-stub" };
            });
            // Also catch CSS files in paths like "react-day-picker/dist/style.css"
            build.onResolve({ filter: /.*\/.*\.css/ }, (args) => {
              if (args.path.endsWith('.css') || args.path.includes('/style.css') || args.path.includes('react-day-picker')) {
                return { path: "", namespace: "css-stub" };
              }
              return undefined;
            });
            // Return empty module for all CSS imports
            build.onLoad({ filter: /.*/, namespace: "css-stub" }, () => {
              return { contents: "", loader: "js" };
            });
          },
        },
        createJsxRuntimeReplacementPlugin(),
      ],
    };
    
    const result = await esbuild.build(buildOptions);

    if (!result.outputFiles || result.outputFiles.length === 0) {
      return NextResponse.json(
        { error: "Bundle failed: no output files" },
        { status: 500 }
      );
    }

    let bundledCode = result.outputFiles[0].text;
    
    // Log initial state for debugging
    const initialJsxRuntimeCount = (bundledCode.match(/react\/jsx-runtime/g) || []).length;
    const initialJsxDevRuntimeCount = (bundledCode.match(/react\/jsx-dev-runtime/g) || []).length;
    if (initialJsxRuntimeCount > 0 || initialJsxDevRuntimeCount > 0) {
      logger.debug(`Initial bundle contains ${initialJsxRuntimeCount} react/jsx-runtime and ${initialJsxDevRuntimeCount} react/jsx-dev-runtime references`);
    }
    
    // CRITICAL: Do NOT remove react/jsx-runtime references!
    // When using jsx: "automatic", esbuild generates jsx() and jsxs() calls that require react/jsx-runtime
    // Custom jsx runtime plugin handles object components during bundling
    // This is essential for AI components that use Button and other components from @fragment_ui/ui
    // CSS imports are already external, so they won't be in the bundle
    
    // Ensure React is imported (for React.createElement fallback and other React APIs)
    if (!bundledCode.includes('import React') && !bundledCode.includes('import * as React')) {
      bundledCode = `import React from "react";\n${bundledCode}`;
    }
    
    // Verify that react/jsx-runtime imports are present (they should be with jsx: "automatic")
    const jsxRuntimeCount = (bundledCode.match(/\breact\/jsx-runtime\b/g) || []).length;
    if (jsxRuntimeCount > 0) {
      logger.debug(`✅ /api/bundle uses react/jsx-runtime (${jsxRuntimeCount} references) - required for AI components`);
    } else {
      logger.warn(`⚠️ /api/bundle does NOT use react/jsx-runtime - this may cause issues with AI components`);
    }

    // Return the bundled code with appropriate headers
    // In development, disable caching to ensure latest changes are loaded
    const headers: HeadersInit = {
      "Content-Type": "application/javascript",
    };
    
    if (process.env.NODE_ENV === "development") {
      headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
      headers["Pragma"] = "no-cache";
      headers["Expires"] = "0";
    } else {
      headers["Cache-Control"] = "public, max-age=3600, s-maxage=3600";
    }
    
    return new NextResponse(bundledCode, {
      status: 200,
      headers,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Log detailed error information for debugging
    logger.error("Bundle error:", error);
    logger.error("Bundle error details:", {
      message: errorMessage,
      stack: errorStack,
      cwd: process.cwd(),
      appDir: process.cwd(),
    });
    
    return NextResponse.json(
      { 
        error: "Bundle failed", 
        message: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}


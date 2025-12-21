import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import * as fs from "fs";
import type { PluginBuild } from "esbuild";
import { logger } from "@/lib/server-logger";

/**
 * API endpoint to bundle @fragment_ui/blocks for Playground
 * 
 * This allows Playground to use the local @fragment_ui/blocks package
 * without requiring it to be published on npm.
 * 
 * Uses require() to avoid webpack processing esbuild
 */
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // Get the correct path to Blocks package
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
    
    const blocksIndexPath = resolvePackageEntry("@fragment_ui/blocks");

    if (!blocksIndexPath) {
      logger.error(`❌ Blocks package (@fragment_ui/blocks) not found`);
      logger.error(`Current working directory: ${cwd}`);
      logger.error(`Project root: ${projectRoot}`);
      
      return NextResponse.json(
        { 
          error: `Blocks package (@fragment_ui/blocks) not found`,
          cwd: cwd,
          projectRoot: projectRoot,
          hint: "Make sure @fragment_ui/blocks is built (pnpm build) or installed"
        },
        { status: 500 }
      );
    }

    // Use require() to avoid webpack processing esbuild
    const esbuild = require("esbuild") as typeof import("esbuild");
    
    // Determine if we're using a built file or source file
    const isTypeScript = blocksIndexPath.endsWith('.ts') || blocksIndexPath.endsWith('.tsx');
    
    // Bundle the Blocks package with optimizations
    const buildOptions: any = {
      entryPoints: [blocksIndexPath!],
      bundle: true,
      format: "esm",
      platform: "browser",
      target: "es2020",
      // Only apply JSX transform if it's a TypeScript/JSX source file
      ...(isTypeScript ? {
        jsx: "transform",
        jsxFactory: "React.createElement",
        jsxFragment: "React.Fragment",
      } : {}),
      // Use packages: "external" to automatically mark all node_modules as external
      packages: "external",
      // Mark dependencies as external
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@fragment_ui/ui", // Blocks depend on UI, but UI is loaded separately
      ],
      write: false,
      treeShaking: true,
      minify: false,
      minifyWhitespace: false,
      minifyIdentifiers: false,
      minifySyntax: false,
      sourcemap: false,
      define: {
        "process.env.NODE_ENV": '"production"',
        "__DEV__": "false",
      },
      drop: ["console"],
      // CSS files are handled by plugin - marked as external
      plugins: [
        {
          name: "remove-css-imports",
          setup(build: PluginBuild) {
            // Remove all CSS imports completely - they're loaded via <link> tags
            build.onResolve({ filter: /\.css$/ }, () => {
              return { path: "", namespace: "css-stub" };
            });
            build.onResolve({ filter: /.*\/.*\.css/ }, (args) => {
              if (args.path.endsWith('.css') || args.path.includes('/style.css')) {
                return { path: "", namespace: "css-stub" };
              }
              return undefined;
            });
            build.onLoad({ filter: /.*/, namespace: "css-stub" }, () => {
              return { contents: "", loader: "js" };
            });
          },
        },
        {
          name: "replace-jsx-runtime",
          setup(build: PluginBuild) {
            // Intercept react/jsx-runtime imports and redirect to react
            build.onResolve({ filter: /^react\/jsx-runtime$/ }, () => {
              return { path: "react", namespace: "jsx-runtime-replacement" };
            });
            build.onLoad({ filter: /.*/, namespace: "jsx-runtime-replacement" }, () => {
              return {
                contents: `
                  import React from "react";
                  export const jsx = React.createElement;
                  export const jsxs = React.createElement;
                  export const jsxDEV = React.createElement;
                  export const Fragment = React.Fragment;
                `,
                loader: "js",
              };
            });
          },
        },
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
    
    // Post-process: ensure React is imported and remove any react/jsx-runtime references
    bundledCode = bundledCode.replace(
      /import\s+.*from\s+["']react\/jsx-runtime["'];?\n?/g,
      ""
    );
    bundledCode = bundledCode.replace(
      /import\s+{.*}\s+from\s+["']react\/jsx-runtime["'];?\n?/g,
      ""
    );
    bundledCode = bundledCode.replace(
      /import\s+.*from\s+["']react\/jsx-dev-runtime["'];?\n?/g,
      ""
    );
    bundledCode = bundledCode.replace(
      /import\s+{.*}\s+from\s+["']react\/jsx-dev-runtime["'];?\n?/g,
      ""
    );
    
    // Ensure React is imported at the top
    if (!bundledCode.includes('import React from "react"') && !bundledCode.includes("import React from 'react'")) {
      bundledCode = 'import React from "react";\n' + bundledCode;
    }
    
    // Remove any remaining react/jsx-runtime references in the code
    bundledCode = bundledCode.replace(/react\/jsx-runtime/g, "react");
    bundledCode = bundledCode.replace(/react\/jsx-dev-runtime/g, "react");
    
    // Set cache headers
    const headers = new Headers();
    headers.set("Content-Type", "application/javascript; charset=utf-8");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    
    logger.debug(`✅ Bundled @fragment_ui/blocks (${bundledCode.length} bytes)`);
    
    return new NextResponse(bundledCode, {
      status: 200,
      headers,
    });
  } catch (error) {
    logger.error("Error bundling blocks:", error);
    return NextResponse.json(
      {
        error: "Failed to bundle blocks",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


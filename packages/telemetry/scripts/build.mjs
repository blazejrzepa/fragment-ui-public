// Build script for telemetry package - compiles TypeScript to JavaScript
// Uses tsx if available, otherwise requires TypeScript to be pre-built

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const distDir = path.join(rootDir, "dist");

// Try different ways to run TypeScript compiler
function buildTypeScript() {
  // First, try using pnpm exec to find tsc from any workspace
  // Note: --from syntax may not work in older pnpm versions, so try multiple approaches
  const pnpmCommands = [
    "pnpm exec tsc", // Try pnpm exec without --from (most reliable)
    "pnpm -C ../.. exec tsc", // Try from root directory
    "pnpm --filter @fragment_ui/telemetry exec tsc", // Try with filter
  ];

  for (const cmd of pnpmCommands) {
    try {
      console.log(`Trying: ${cmd}`);
      execSync(`${cmd} -p tsconfig.json`, {
        cwd: rootDir,
        stdio: "inherit",
        env: { ...process.env, NODE_ENV: "production" },
      });
      return true;
    } catch (e) {
      // Try next command
      continue;
    }
  }

  // Fallback to direct paths
  const tscPaths = [
    path.join(rootDir, "node_modules/.bin/tsc"),
    path.join(rootDir, "../../node_modules/.bin/tsc"),
    "tsc", // in PATH
  ];

  for (const tscPath of tscPaths) {
    try {
      console.log(`Trying: ${tscPath}`);
      execSync(`${tscPath} -p tsconfig.json`, {
        cwd: rootDir,
        stdio: "inherit",
        env: { ...process.env, NODE_ENV: "production" },
      });
      return true;
    } catch (e) {
      // Try next path
      continue;
    }
  }

  // If all tsc paths failed, try using tsx to compile
  try {
    const tsxPaths = [
      path.join(rootDir, "node_modules/.bin/tsx"),
      path.join(rootDir, "../../node_modules/.bin/tsx"),
      "tsx",
    ];

    for (const tsxPath of tsxPaths) {
      try {
        console.log(`Trying tsx: ${tsxPath}`);
        // Use tsx to run a simple TypeScript file that compiles
        execSync(`${tsxPath} --version`, { stdio: "ignore" });
        // If tsx is available, we still need tsc for declaration files
        // So this is a fallback that won't work perfectly
        console.warn("tsx found but we need tsc for declarations");
        continue;
      } catch (e) {
        continue;
      }
    }
  } catch (e) {
    // Ignore
  }

  return false;
}

// Main build
try {
  console.log("Building telemetry package...");
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Try to build with TypeScript compiler
  const success = buildTypeScript();

  if (!success) {
    // Last resort: try to install TypeScript temporarily
    console.log("TypeScript not found, attempting to install...");
    try {
      execSync("pnpm add -D typescript --ignore-scripts", {
        cwd: rootDir,
        stdio: "inherit",
      });
      // Try again after installation
      const retrySuccess = buildTypeScript();
      if (!retrySuccess) {
        console.error("❌ Could not find TypeScript compiler (tsc)");
        console.error("Please ensure TypeScript is installed:");
        console.error("  pnpm add -D typescript");
        process.exit(1);
      }
    } catch (installError) {
      console.error("❌ Could not install TypeScript automatically");
      console.error("Please ensure TypeScript is installed:");
      console.error("  pnpm add -D typescript");
      process.exit(1);
    }
  }

  // Verify output
  const requiredFiles = [
    "dist/index.js",
    "dist/index.d.ts",
    "dist/client.js",
    "dist/client.d.ts",
    "dist/types.js",
    "dist/types.d.ts",
  ];

  const missingFiles = requiredFiles.filter(
    (file) => !fs.existsSync(path.join(rootDir, file))
  );

  if (missingFiles.length > 0) {
    console.error("❌ Missing build outputs:");
    missingFiles.forEach((file) => console.error(`  - ${file}`));
    process.exit(1);
  }

  console.log("✔ telemetry built");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}


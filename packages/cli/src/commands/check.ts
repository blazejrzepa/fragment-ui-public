import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// From dist/commands/check.js -> packages/cli/dist -> packages/cli -> root
const root = path.join(__dirname, "../../../..");
const registryPath = path.join(root, "packages/registry/registry.json");

interface ComponentVersion {
  name: string;
  installed: boolean;
  version?: string;
  latestVersion?: string;
  needsUpdate?: boolean;
}

export async function checkComponents(projectPath?: string) {
  const projectRoot = projectPath || process.cwd();
  const componentsDir = path.join(projectRoot, "components/ui");
  const blocksDir = path.join(projectRoot, "components/blocks");

  try {
    const registryContent = fs.readFileSync(registryPath, "utf-8");
    const registry = JSON.parse(registryContent);

    const components: ComponentVersion[] = [];
    const installedComponents: string[] = [];

    // Check for installed components
    if (fs.existsSync(componentsDir)) {
      const files = fs.readdirSync(componentsDir, { recursive: true });
      files.forEach((file) => {
        if (typeof file === "string" && file.endsWith(".tsx")) {
          const componentName = file.replace(/\.tsx$/, "").replace(/\//g, "-");
          if (!installedComponents.includes(componentName)) {
            installedComponents.push(componentName);
          }
        }
      });
    }

    if (fs.existsSync(blocksDir)) {
      const files = fs.readdirSync(blocksDir, { recursive: true });
      files.forEach((file) => {
        if (typeof file === "string" && file.endsWith(".tsx")) {
          const componentName = file.replace(/\.tsx$/, "").replace(/\//g, "-");
          if (!installedComponents.includes(componentName)) {
            installedComponents.push(componentName);
          }
        }
      });
    }

    // Get all available components from registry
    for (const [name] of Object.entries(registry)) {
      const isInstalled = installedComponents.some(
        (installed) => installed === name || installed.includes(name)
      );

      components.push({
        name,
        installed: isInstalled,
        latestVersion: "1.5.0", // TODO: Get from package.json or registry
      });
    }

    const installed = components.filter((c) => c.installed);
    const available = components.filter((c) => !c.installed);

    console.log("\n🔍 Fragment UI Component Check\n");
    console.log(`Project: ${projectRoot}\n`);

    if (installed.length > 0) {
      console.log(`✅ Installed (${installed.length}):`);
      installed.forEach((comp) => {
        console.log(`   • ${comp.name}`);
      });
      console.log();
    }

    if (available.length > 0) {
      console.log(`📦 Available (${available.length}):`);
      // Show first 10 available
      available.slice(0, 10).forEach((comp) => {
        console.log(`   • ${comp.name}`);
      });
      if (available.length > 10) {
        console.log(`   ... and ${available.length - 10} more`);
      }
      console.log();
    }

    // Check dependencies
    const packageJsonPath = path.join(projectRoot, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };

        const requiredDeps = ["react", "react-dom"];
        const missingDeps: string[] = [];

        requiredDeps.forEach((dep) => {
          if (!allDeps[dep]) {
            missingDeps.push(dep);
          }
        });

        if (missingDeps.length > 0) {
          console.log(`⚠️  Missing dependencies:`);
          missingDeps.forEach((dep) => {
            console.log(`   • ${dep}`);
          });
          console.log(`\n💡 Install missing dependencies:`);
          console.log(`   npm install ${missingDeps.join(" ")}`);
          console.log(`   # or`);
          console.log(`   pnpm add ${missingDeps.join(" ")}\n`);
        } else {
          console.log(`✅ All required dependencies installed\n`);
        }
      } catch {
        // Ignore package.json parsing errors
      }
    }

    console.log(`💡 Install a component:`);
    console.log(`   npx shadcn@latest add https://fragmentui.com/r/<component>.json\n`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("\n⚠️  No Fragment UI components found in this project.");
      console.log(`   Run 'ds init' to set up Fragment UI in this project.\n`);
    } else {
      console.error(`❌ Error checking components: ${error}`);
      process.exit(1);
    }
  }
}


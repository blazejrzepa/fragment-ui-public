import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// From dist/commands/remove.js -> packages/cli/dist -> packages/cli -> root
const root = path.join(__dirname, "../../../..");
const registryPath = path.join(root, "packages/registry/registry.json");

export async function removeComponent(componentName: string, projectPath?: string) {
  const projectRoot = projectPath || process.cwd();

  try {
    const registryContent = fs.readFileSync(registryPath, "utf-8");
    const registry = JSON.parse(registryContent);

    if (!registry[componentName]) {
      console.error(`❌ Component "${componentName}" not found in registry.`);
      console.log(`\n💡 Run 'ds list' to see all available components.\n`);
      process.exit(1);
    }

    const componentData = registry[componentName];
    const isBlock = componentData.files.some((f: { from: string }) =>
      f.from.includes("/blocks/")
    );
    const targetDir = isBlock
      ? path.join(projectRoot, "components/blocks")
      : path.join(projectRoot, "components/ui");

    // Find component files
    const componentFile = path.join(
      targetDir,
      componentName.replace(/-/g, "/") + ".tsx"
    );
    const componentFileAlt = path.join(targetDir, componentName + ".tsx");

    let foundFile: string | null = null;
    if (fs.existsSync(componentFile)) {
      foundFile = componentFile;
    } else if (fs.existsSync(componentFileAlt)) {
      foundFile = componentFileAlt;
    }

    if (!foundFile) {
      console.error(`❌ Component "${componentName}" is not installed.`);
      console.log(`\n💡 Run 'ds check' to see installed components.\n`);
      process.exit(1);
    }

    // Remove the file
    fs.unlinkSync(foundFile);
    console.log(`\n✅ Removed component: ${componentName}`);
    console.log(`   Deleted: ${foundFile}\n`);

    // Try to remove empty directories
    let currentDir = path.dirname(foundFile);
    while (currentDir !== targetDir && currentDir !== projectRoot) {
      try {
        const files = fs.readdirSync(currentDir);
        if (files.length === 0) {
          fs.rmdirSync(currentDir);
          currentDir = path.dirname(currentDir);
        } else {
          break;
        }
      } catch {
        break;
      }
    }

    console.log(`💡 Don't forget to:`);
    console.log(`   1. Remove any imports of this component from your code`);
    console.log(`   2. Remove unused dependencies if any\n`);
  } catch (error) {
    console.error(`❌ Error removing component: ${error}`);
    process.exit(1);
  }
}


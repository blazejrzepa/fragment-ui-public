import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// From dist/commands/update.js -> packages/cli/dist -> packages/cli -> root
const root = path.join(__dirname, "../../../..");
const registryPath = path.join(root, "packages/registry/registry.json");

export async function updateComponent(componentName: string, projectPath?: string) {
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

    // Check if component is installed
    const componentFile = path.join(
      targetDir,
      componentName.replace(/-/g, "/") + ".tsx"
    );
    const componentFileAlt = path.join(targetDir, componentName + ".tsx");

    if (!fs.existsSync(componentFile) && !fs.existsSync(componentFileAlt)) {
      console.error(`❌ Component "${componentName}" is not installed.`);
      console.log(`\n💡 Install it first:`);
      console.log(`   npx shadcn@latest add https://fragment-ui.dev/r/${componentName}.json\n`);
      process.exit(1);
    }

    console.log(`\n🔄 Updating component: ${componentName}\n`);

    // For now, we'll just reinstall using shadcn
    // In the future, we could implement smart diffing and updating
    console.log(`💡 To update this component, reinstall it:`);
    console.log(`   npx shadcn@latest add https://fragment-ui.dev/r/${componentName}.json --overwrite\n`);

    console.log(`⚠️  Note: Full update functionality coming soon!`);
    console.log(`   For now, please reinstall the component manually.\n`);
  } catch (error) {
    console.error(`❌ Error updating component: ${error}`);
    process.exit(1);
  }
}


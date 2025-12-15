import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// From dist/commands/list.js -> packages/cli/dist -> packages/cli -> root
const root = path.join(__dirname, "../../../..");
const registryPath = path.join(root, "packages/registry/registry.json");

interface ComponentInfo {
  name: string;
  type: "ui" | "block";
  files: number;
}

export async function listComponents() {
  try {
    const registryContent = fs.readFileSync(registryPath, "utf-8");
    const registry = JSON.parse(registryContent);

    const components: ComponentInfo[] = [];
    const uiComponents: string[] = [];
    const blockComponents: string[] = [];

    for (const [name, data] of Object.entries(registry)) {
      const componentData = data as { files: Array<{ from: string }> };
      const isBlock = componentData.files.some((f) => f.from.includes("/blocks/"));
      
      components.push({
        name,
        type: isBlock ? "block" : "ui",
        files: componentData.files.length,
      });

      if (isBlock) {
        blockComponents.push(name);
      } else {
        uiComponents.push(name);
      }
    }

    // Sort alphabetically
    uiComponents.sort();
    blockComponents.sort();

    console.log("\n📦 Fragment UI Components\n");
    console.log(`Total: ${components.length} components\n`);

    if (uiComponents.length > 0) {
      console.log("🎨 UI Components:");
      uiComponents.forEach((name) => {
        const component = components.find((c) => c.name === name);
        console.log(`  • ${name.padEnd(25)} (${component?.files || 0} file${component?.files !== 1 ? "s" : ""})`);
      });
      console.log();
    }

    if (blockComponents.length > 0) {
      console.log("🧩 Blocks:");
      blockComponents.forEach((name) => {
        const component = components.find((c) => c.name === name);
        console.log(`  • ${name.padEnd(25)} (${component?.files || 0} file${component?.files !== 1 ? "s" : ""})`);
      });
      console.log();
    }

    console.log(`\n💡 Install a component:`);
    console.log(`   npx shadcn@latest add https://fragmentui.com/r/<component>.json\n`);
  } catch (error) {
    console.error(`❌ Error reading registry: ${error}`);
    process.exit(1);
  }
}


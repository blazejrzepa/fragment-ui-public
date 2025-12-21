// Registry generation script in JavaScript (ESM) - no tsx required
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
const registryDir = path.join(rootDir, "packages/registry");
const registryPath = path.join(registryDir, "registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

const publicDir = path.join(rootDir, "apps/www/public/r");
fs.mkdirSync(publicDir, { recursive: true });

// Get components from registry (new structure has "components" key)
const components = registry.components || registry;

// Iterate only over components, skip metadata keys
for (const [name, config] of Object.entries(components)) {
  // Skip if config doesn't have expected structure
  if (!config || typeof config !== "object") {
    continue;
  }

  // If config has files array (old structure), use it
  if (config.files && Array.isArray(config.files)) {
  const files = config.files.map((file) => {
    // Resolve path relative to registry directory (where registry.json is)
    const sourcePath = path.resolve(registryDir, file.from);
    const content = fs.readFileSync(sourcePath, "utf-8");
    return {
      path: file.to,
      content,
    };
  });

  const registryJson = {
    name,
    type: name.includes("-") ? "registry:block" : "registry:component",
    dependencies: ["react", "react-dom"],
    files,
  };

  const outputPath = path.join(publicDir, `${name}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(registryJson, null, 2));
  console.log(`✔ Generated ${outputPath}`);
  } else {
    // New structure: generate from component source file
    // Extract component name from import path (e.g., "@fragment_ui/ui/button" -> "button")
    const importPath = config.import || "";
    const componentName = importPath.split("/").pop() || name.toLowerCase();
    const sourcePath = path.join(rootDir, "packages/ui/src", `${componentName}.tsx`);
    
    // Check if source file exists
    if (fs.existsSync(sourcePath)) {
      const content = fs.readFileSync(sourcePath, "utf-8");
      const files = [{
        path: `components/ui/${name}.tsx`,
        content,
      }];

      const registryJson = {
        name: name.toLowerCase(),
        type: name.includes("-") ? "registry:block" : "registry:component",
        dependencies: ["react", "react-dom", "@fragment_ui/ui"],
        files,
      };

      const outputPath = path.join(publicDir, `${name.toLowerCase()}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(registryJson, null, 2));
      console.log(`✔ Generated ${outputPath}`);
    } else {
      // Skip silently when source is absent; not all registry entries have matching files
      continue;
    }
  }
}

console.log("✔ All registry JSON files generated");


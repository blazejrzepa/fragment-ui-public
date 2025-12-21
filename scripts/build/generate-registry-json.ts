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

for (const [name, config] of Object.entries(registry) as [string, any][]) {
  const files = config.files.map((file: { from: string; to: string }) => {
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
}

console.log("✔ All registry JSON files generated");


import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import http from "node:http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RegistryFile {
  path: string;
  content: string;
}

interface RegistryComponent {
  name: string;
  type: string;
  dependencies?: string[];
  files: RegistryFile[];
}

/**
 * Fetch JSON from URL
 */
function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    
    client.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch: ${res.statusCode} ${res.statusMessage}`));
        return;
      }

      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error}`));
        }
      });
    }).on("error", (error) => {
      reject(error);
    });
  });
}

/**
 * Read components.json or create default
 */
function getComponentsConfig(projectRoot: string): any {
  const configPath = path.join(projectRoot, "components.json");
  
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (error) {
      console.warn(`⚠️  Warning: Could not parse components.json: ${error}`);
    }
  }

  // Return default config
  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "default",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "tailwind.config.js",
      css: "app/globals.css",
      baseColor: "slate",
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
    },
  };
}

/**
 * Save components.json
 */
function saveComponentsConfig(projectRoot: string, config: any): void {
  const configPath = path.join(projectRoot, "components.json");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

/**
 * Resolve path alias (e.g., @/components -> src/components or components)
 */
function resolveAlias(filePath: string, aliases: Record<string, string>, projectRoot: string): string {
  // Replace aliases in path
  let resolved = filePath;
  for (const [alias, value] of Object.entries(aliases)) {
    if (resolved.startsWith(alias)) {
      resolved = resolved.replace(alias, value);
      break;
    }
  }

  // Remove @ prefix if present
  resolved = resolved.replace(/^@\//, "");

  // If path starts with /, make it relative to project root
  if (resolved.startsWith("/")) {
    return path.join(projectRoot, resolved.slice(1));
  }

  // Otherwise, resolve relative to project root
  return path.resolve(projectRoot, resolved);
}

/**
 * Install component from registry
 */
export async function installComponent(
  componentName: string,
  projectPath?: string,
  registryUrl?: string,
  options?: { overwrite?: boolean }
): Promise<void> {
  const projectRoot = projectPath || process.cwd();
  const baseUrl = registryUrl || "https://fragmentui.com/r";
  const url = `${baseUrl}/${componentName}.json`;

  try {
    console.log(`\n📦 Fetching component: ${componentName}`);
    console.log(`   URL: ${url}\n`);

    // Fetch registry JSON
    const registryData: RegistryComponent = await fetchJson(url);

    if (!registryData.name || !registryData.files || !Array.isArray(registryData.files)) {
      throw new Error("Invalid registry format: missing name or files");
    }

    // Get components.json config
    const config = getComponentsConfig(projectRoot);
    const aliases = config.aliases || { components: "@/components", utils: "@/lib/utils" };

    // Determine if it's a block or component
    const isBlock = registryData.type === "registry:block" || 
                   registryData.files.some(f => f.path.includes("/blocks/"));
    const baseDir = isBlock ? "components/blocks" : "components/ui";

    console.log(`📝 Installing ${registryData.files.length} file(s)...\n`);

    // Install each file
    for (const file of registryData.files) {
      // Resolve path using aliases
      let filePath = file.path;
      
      // If path doesn't start with alias, prepend components alias
      if (!filePath.startsWith("@") && !filePath.startsWith("/")) {
        filePath = path.join(baseDir, path.basename(filePath));
      }

      const resolvedPath = resolveAlias(filePath, aliases, projectRoot);
      const dir = path.dirname(resolvedPath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`   📁 Created: ${dir}`);
      }

      // Check if file exists
      const fileExists = fs.existsSync(resolvedPath);
      if (fileExists && !options?.overwrite) {
        console.log(`   ⚠️  Skipped: ${resolvedPath} (already exists, use --overwrite to replace)`);
        continue;
      }

      // Write file
      fs.writeFileSync(resolvedPath, file.content, "utf-8");
      console.log(`   ✅ ${fileExists ? "Updated" : "Installed"}: ${resolvedPath}`);
    }

    // Update components.json (add to installed components list if it exists)
    if (!config.components) {
      config.components = [];
    }
    if (Array.isArray(config.components) && !config.components.includes(componentName)) {
      config.components.push(componentName);
      saveComponentsConfig(projectRoot, config);
    }

    // Show dependencies info
    if (registryData.dependencies && registryData.dependencies.length > 0) {
      const deps = registryData.dependencies.filter(
        (dep) => !dep.startsWith("react") && !dep.startsWith("react-dom")
      );
      
      if (deps.length > 0) {
        console.log(`\n📦 Dependencies:`);
        console.log(`   ${deps.join(", ")}`);
        console.log(`\n💡 Make sure these are installed in your project.\n`);
      }
    }

    console.log(`\n✅ Successfully installed: ${componentName}\n`);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("404") || error.message.includes("Failed to fetch")) {
        console.error(`\n❌ Component "${componentName}" not found in registry.`);
        console.error(`   URL: ${url}`);
        console.log(`\n💡 Run 'fragmentui list' to see all available components.\n`);
      } else {
        console.error(`\n❌ Error installing component: ${error.message}\n`);
      }
    } else {
      console.error(`\n❌ Error installing component: ${error}\n`);
    }
    process.exit(1);
  }
}


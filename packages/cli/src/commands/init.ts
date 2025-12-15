import fs from "node:fs";
import path from "node:path";

export async function initProject(projectPath?: string) {
  const projectRoot = projectPath || process.cwd();
  const componentsDir = path.join(projectRoot, "components/ui");
  const blocksDir = path.join(projectRoot, "components/blocks");

  try {
    // Check if already initialized
    if (fs.existsSync(componentsDir) || fs.existsSync(blocksDir)) {
      console.log("\n⚠️  Fragment UI appears to be already initialized in this project.");
      console.log(`   Components directory: ${componentsDir}`);
      console.log(`   Blocks directory: ${blocksDir}\n`);
      return;
    }

    // Create directories
    fs.mkdirSync(componentsDir, { recursive: true });
    fs.mkdirSync(blocksDir, { recursive: true });

    // Create .gitkeep files
    fs.writeFileSync(path.join(componentsDir, ".gitkeep"), "");
    fs.writeFileSync(path.join(blocksDir, ".gitkeep"), "");

    // Create components.json if it doesn't exist
    const componentsJsonPath = path.join(projectRoot, "components.json");
    if (!fs.existsSync(componentsJsonPath)) {
      const componentsJson = {
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

      fs.writeFileSync(
        componentsJsonPath,
        JSON.stringify(componentsJson, null, 2)
      );
    }

    console.log("\n✅ Fragment UI initialized successfully!\n");
    console.log(`📁 Created directories:`);
    console.log(`   • ${componentsDir}`);
    console.log(`   • ${blocksDir}\n`);

    console.log(`💡 Next steps:`);
    console.log(`   1. Install a component:`);
    console.log(`      npx shadcn@latest add https://fragmentui.com/r/button.json`);
    console.log(`   2. List all available components:`);
    console.log(`      ds list`);
    console.log(`   3. Check your installation:`);
    console.log(`      ds check\n`);
  } catch (error) {
    console.error(`❌ Error initializing project: ${error}`);
    process.exit(1);
  }
}


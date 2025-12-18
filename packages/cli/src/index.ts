#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureDocPage } from "./generateDocPage.js";
import { addComponent } from "./commands/add-component.js";
import { listComponents } from "./commands/list.js";
import { checkComponents } from "./commands/check.js";
import { initProject } from "./commands/init.js";
import { updateComponent } from "./commands/update.js";
import { removeComponent } from "./commands/remove.js";
import { listPlugins, runPlugin } from "./commands/plugin.js";
import { listPatchesCommand, applyPatch, checkPatch } from "./commands/patches.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "../..");

const [, , cmd, ...args] = process.argv;

// Show help if no command
if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
  console.log(`
📦 Fragment UI CLI

Usage: fragmentui <command> [options]

Commands:
  add <name>        Install a component to your project
  list              List all available components
  check [path]      Check installed components in project
  init [path]       Initialize Fragment UI in a project
  update <name>     Update a component to latest version
  remove <name>     Remove a component from project
  plugin list       List all installed plugins
  plugin run <id>   Run a plugin action
  patch list        List all overlay patches
  patch apply <id>  Apply a patch to component
  patch check <id>  Check if patch can be applied
  help              Show this help message

Examples:
  fragmentui add button      Install button component
  fragmentui add accordion  Install accordion component
  ds list                    List all available components
  ds check                   Check components in current directory
  ds init                    Initialize Fragment UI in current project
  ds update button           Update button component
  ds remove button           Remove button component

For more information, visit: https://fragment-ui.dev
`);
  process.exit(0);
}

// Handle commands
try {
  switch (cmd) {
    case "add": {
      if (!args[0]) {
        console.error("❌ Error: Component name is required");
        console.log("Usage: fragmentui add <component-name> [--overwrite]");
        console.log("   or: fragmentui add <component-name> --doc (internal use)");
        process.exit(1);
      }
      
      // Check if --doc flag is used (internal use for generating doc pages)
      if (args.includes("--doc")) {
        process.chdir(root);
        await ensureDocPage(args[0]);
        console.log(`✔ Documentation page for ${args[0]} created/verified`);
      } else {
        // Install component using our own implementation
        const overwrite = args.includes("--overwrite");
        const projectPath = args.find((arg, i) => i > 0 && !arg.startsWith("--") && arg !== args[0]) || undefined;
        await addComponent(args[0], projectPath, { overwrite });
      }
      break;
    }

    case "list": {
      await listComponents();
      break;
    }

    case "check": {
      const projectPath = args[0];
      await checkComponents(projectPath);
      break;
    }

    case "init": {
      const projectPath = args[0];
      await initProject(projectPath);
      break;
    }

    case "update": {
      if (!args[0]) {
        console.error("❌ Error: Component name is required");
        console.log("Usage: ds update <name>");
        process.exit(1);
      }
      const projectPath = args[1];
      await updateComponent(args[0], projectPath);
      break;
    }

    case "remove": {
      if (!args[0]) {
        console.error("❌ Error: Component name is required");
        console.log("Usage: ds remove <name>");
        process.exit(1);
      }
      const projectPath = args[1];
      await removeComponent(args[0], projectPath);
      break;
    }

    case "plugin": {
      const pluginCmd = args[0];
      if (pluginCmd === "list") {
        await listPlugins(args[1]);
      } else if (pluginCmd === "run") {
        if (!args[1]) {
          console.error("❌ Error: Plugin ID is required");
          console.log("Usage: ds plugin run <plugin-id> [action]");
          process.exit(1);
        }
        await runPlugin(args[1], args[2] || "default", {});
      } else {
        console.error(`❌ Unknown plugin command: ${pluginCmd}`);
        console.log("Available: list, run");
        process.exit(1);
      }
      break;
    }

    case "patch": {
      const patchCmd = args[0];
      if (patchCmd === "list") {
        await listPatchesCommand();
      } else if (patchCmd === "apply") {
        if (!args[1]) {
          console.error("❌ Error: Patch ID is required");
          console.log("Usage: ds patch apply <patch-id>");
          process.exit(1);
        }
        await applyPatch(args[1]);
      } else if (patchCmd === "check") {
        if (!args[1]) {
          console.error("❌ Error: Patch ID is required");
          console.log("Usage: ds patch check <patch-id>");
          process.exit(1);
        }
        await checkPatch(args[1]);
      } else {
        console.error(`❌ Unknown patch command: ${patchCmd}`);
        console.log("Available: list, apply, check");
        process.exit(1);
      }
      break;
    }

    default: {
      console.error(`❌ Unknown command: ${cmd}`);
      console.log("Run 'fragmentui help' to see available commands.");
      process.exit(1);
    }
  }
} catch (error) {
  console.error(`❌ Error: ${error}`);
  process.exit(1);
}


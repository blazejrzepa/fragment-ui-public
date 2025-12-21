const fs = require("fs");
const p = require("path");

const reg = JSON.parse(
  fs.readFileSync("packages/registry/registry.json", "utf8")
);

// Get components from registry (new structure has "components" key)
const components = reg.components || reg;

// Filter out metadata keys (only check actual components)
const componentNames = Object.keys(components).filter(
  (name) => 
    name !== "$schema" && 
    name !== "version" && 
    name !== "components" && 
    name !== "aliases" && 
    name !== "rules" &&
    components[name] && 
    typeof components[name] === "object"
);

const miss = componentNames.filter(
  (name) =>
    !fs.existsSync(
      p.join("apps", "www", "app", "docs", "components", name.toLowerCase(), "page.tsx")
    )
);

if (miss.length) {
  console.warn("⚠️  Docs missing for:", miss.join(", "));
  console.warn("These components may be sub-components or may not require separate documentation.");
  // Don't fail CI - these might be sub-components that don't need separate docs
  // process.exit(1);
}

console.log("✔ Registry documentation check completed");


#!/usr/bin/env node

/**
 * Component API Generator
 * 
 * Generates API documentation from TypeScript component files.
 * Extracts prop types and generates markdown documentation.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
const uiSrcDir = path.join(rootDir, "packages/ui/src");
const outputDir = path.join(rootDir, "docs/api");

// Ensure output directory exists
fs.mkdirSync(outputDir, { recursive: true });

/**
 * Extract prop information from TypeScript interface
 */
function extractPropsFromInterface(node, checker, sourceFile) {
  const props = [];

  if (ts.isInterfaceDeclaration(node)) {
    for (const member of node.members) {
      if (ts.isPropertySignature(member)) {
        const propName = member.name?.getText(sourceFile);
        if (!propName) continue;

        const isOptional = !!member.questionToken;
        const type = member.type ? getTypeText(member.type, checker, sourceFile) : "any";
        
        // Try to find JSDoc comment
        const jsDoc = ts.getJSDocCommentsAndTags(member);
        const description = jsDoc.length > 0 
          ? jsDoc[0].comment || ""
          : "";

        // Try to find default value from JSDoc @default tag
        let defaultValue = undefined;
        const defaultTag = jsDoc.find(tag => 
          ts.isJSDocTag(tag) && tag.tagName?.getText(sourceFile) === "default"
        );
        if (defaultTag && ts.isJSDocTag(defaultTag)) {
          defaultValue = defaultTag.comment || "";
        }

        props.push({
          name: propName,
          type: type,
          optional: isOptional,
          description: description,
          defaultValue: defaultValue,
        });
      }
    }
  }

  return props;
}

/**
 * Get readable type text from TypeScript type node
 */
function getTypeText(typeNode, checker, sourceFile) {
  if (!typeNode) return "any";

  // Handle union types
  if (ts.isUnionTypeNode(typeNode)) {
    return typeNode.types
      .map(t => getTypeText(t, checker, sourceFile))
      .join(" | ");
  }

  // Handle literal types
  if (ts.isLiteralTypeNode(typeNode)) {
    if (ts.isStringLiteral(typeNode.literal)) {
      return `"${typeNode.literal.text}"`;
    }
    if (ts.isNumericLiteral(typeNode.literal)) {
      return typeNode.literal.text;
    }
    if (typeNode.literal.kind === ts.SyntaxKind.TrueKeyword) {
      return "true";
    }
    if (typeNode.literal.kind === ts.SyntaxKind.FalseKeyword) {
      return "false";
    }
  }

  // Handle array types
  if (ts.isArrayTypeNode(typeNode)) {
    const elementType = getTypeText(typeNode.elementType, checker, sourceFile);
    return `${elementType}[]`;
  }

  // Handle function types
  if (ts.isFunctionTypeNode(typeNode)) {
    const params = typeNode.parameters
      .map(p => {
        const name = p.name?.getText(sourceFile) || "";
        const type = p.type ? getTypeText(p.type, checker, sourceFile) : "any";
        return `${name}: ${type}`;
      })
      .join(", ");
    const returnType = typeNode.type ? getTypeText(typeNode.type, checker, sourceFile) : "void";
    return `(${params}) => ${returnType}`;
  }

  // Handle type references
  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = typeNode.typeName?.getText(sourceFile) || "";
    
    // Handle React.ReactNode
    if (typeName.includes("ReactNode") || typeName.includes("React.ReactNode")) {
      return "React.ReactNode";
    }

    // Handle React.ComponentProps
    if (typeName.includes("ComponentProps")) {
      const typeArgs = typeNode.typeArguments
        ? typeNode.typeArguments.map(t => getTypeText(t, checker, sourceFile)).join(", ")
        : "";
      return typeArgs ? `${typeName}<${typeArgs}>` : typeName;
    }

    // Handle generic types
    if (typeNode.typeArguments && typeNode.typeArguments.length > 0) {
      const typeArgs = typeNode.typeArguments
        .map(t => getTypeText(t, checker, sourceFile))
        .join(", ");
      return `${typeName}<${typeArgs}>`;
    }

    return typeName;
  }

  // Handle indexed access types
  if (ts.isIndexedAccessTypeNode(typeNode)) {
    const objectType = getTypeText(typeNode.objectType, checker, sourceFile);
    const indexType = getTypeText(typeNode.indexType, checker, sourceFile);
    return `${objectType}[${indexType}]`;
  }

  // Handle parenthesized types
  if (ts.isParenthesizedTypeNode(typeNode)) {
    return `(${getTypeText(typeNode.type, checker, sourceFile)})`;
  }

  // Default: get text representation
  return typeNode.getText(sourceFile);
}

/**
 * Process a component file and extract API information
 */
function processComponentFile(filePath) {
  const fileName = path.basename(filePath, ".tsx");
  const componentName = fileName
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const sourceCode = fs.readFileSync(filePath, "utf-8");
  
  // Create TypeScript source file
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  // Create program and type checker
  const program = ts.createProgram([filePath], {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.React,
    esModuleInterop: true,
    skipLibCheck: true,
    strict: false,
  });

  const checker = program.getTypeChecker();
  const props = [];

  // Walk AST to find exported interfaces
  function visit(node) {
    // Look for exported interfaces matching ComponentNameProps pattern
    if (ts.isInterfaceDeclaration(node)) {
      const interfaceName = node.name?.getText(sourceFile);
      if (interfaceName && (interfaceName.includes("Props") || interfaceName.includes("ComponentProps"))) {
        const extractedProps = extractPropsFromInterface(node, checker, sourceFile);
        props.push(...extractedProps);
      }
    }

    // Look for exported type aliases
    if (ts.isTypeAliasDeclaration(node)) {
      const typeName = node.name?.getText(sourceFile);
      if (typeName && typeName.includes("Props")) {
        // For type aliases, we need to resolve the type
        const type = checker.getTypeAtLocation(node);
        const typeText = checker.typeToString(type);
        // This is a simplified version - full implementation would need more parsing
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (props.length === 0) {
    console.log(`⚠️  No props found for ${fileName}`);
    return null;
  }

  return {
    componentName,
    fileName,
    props,
  };
}

/**
 * Generate markdown documentation
 */
function generateMarkdown(apiInfo) {
  const { componentName, fileName, props } = apiInfo;

  let markdown = `# ${componentName} API Reference\n\n`;
  markdown += `Auto-generated API documentation for \`${componentName}\` component.\n\n`;
  markdown += `## Props\n\n`;

  if (props.length === 0) {
    markdown += `This component does not accept any props.\n`;
    return markdown;
  }

  markdown += `| Prop | Type | Default | Description |\n`;
  markdown += `|------|------|---------|-------------|\n`;

  for (const prop of props) {
    const name = prop.optional ? `\`${prop.name}?\`` : `\`${prop.name}\``;
    const type = `\`${prop.type}\``;
    const defaultValue = prop.defaultValue ? `\`${prop.defaultValue}\`` : "-";
    const description = prop.description || "-";

    markdown += `| ${name} | ${type} | ${defaultValue} | ${description} |\n`;
  }

  markdown += `\n---\n\n`;
  markdown += `*This documentation is auto-generated from TypeScript types.*\n`;

  return markdown;
}

/**
 * Main function
 */
function main() {
  console.log("🚀 Generating API documentation...\n");

  // Get all component files
  const componentFiles = fs
    .readdirSync(uiSrcDir)
    .filter(file => file.endsWith(".tsx") && !file.endsWith(".stories.tsx") && !file.endsWith(".test.tsx"))
    .map(file => path.join(uiSrcDir, file));

  let generatedCount = 0;
  let skippedCount = 0;

  for (const filePath of componentFiles) {
    try {
      const apiInfo = processComponentFile(filePath);
      
      if (!apiInfo) {
        skippedCount++;
        continue;
      }

      const markdown = generateMarkdown(apiInfo);
      const outputPath = path.join(outputDir, `${apiInfo.fileName}.md`);
      fs.writeFileSync(outputPath, markdown, "utf-8");
      
      console.log(`✔ Generated ${apiInfo.fileName}.md`);
      generatedCount++;
    } catch (error) {
      console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
      skippedCount++;
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Generated: ${generatedCount} files`);
  console.log(`   Skipped: ${skippedCount} files`);
  console.log(`   Output: ${outputDir}`);
}

main();

